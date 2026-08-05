let interiorThree=null;
function makeTextPlane(text, color, w, h){
  const canvas=document.createElement('canvas');
  canvas.width=1024; canvas.height=256;
  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font='700 150px "Space Grotesk", sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.shadowColor='rgba(0,0,0,0.6)'; ctx.shadowBlur=14;
  ctx.fillStyle=color;
  ctx.fillText(text, canvas.width/2, canvas.height/2);
  const tex=new THREE.CanvasTexture(canvas);
  tex.needsUpdate=true;
  const mat=new THREE.MeshBasicMaterial({map:tex, transparent:true, depthWrite:false});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h), mat);
  return mesh;
}
function populateInteriorRouteSelects(){
  const srcEl=document.getElementById('interiorSourceSelect'), dstEl=document.getElementById('interiorDestSelect');
  if(!srcEl || !dstEl || srcEl.dataset.populated) return;
  const rooms=adminInteriorAllRooms();
  const opts = rooms.map(r=>`<option value="${r.id}">${r.name}</option>`).join('');
  srcEl.innerHTML = opts;
  dstEl.innerHTML = opts;
  let saved={};
  try{ saved=JSON.parse(localStorage.getItem('campusNav_lastInteriorRoute')||'{}'); }catch(e){}
  srcEl.value = (saved.src && rooms.some(r=>r.id===saved.src)) ? saved.src : ADMIN_ROOMS[0].id;
  dstEl.value = (saved.dst && rooms.some(r=>r.id===saved.dst)) ? saved.dst : ADMIN_ENTRANCE_ROOM.id;
  [srcEl,dstEl].forEach(el=>el.addEventListener('change',()=>{
    try{ localStorage.setItem('campusNav_lastInteriorRoute', JSON.stringify({src:srcEl.value, dst:dstEl.value})); }catch(e){}
  }));
  srcEl.dataset.populated = '1';
}
function initAdminInterior(){
  const container=document.getElementById('viewer3dInterior');
  if(interiorThree){ resizeInteriorRenderer(); return; }
  const W=container.clientWidth, H=container.clientHeight;
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x0f172a);

  const camera=new THREE.PerspectiveCamera(50, W/H, 0.1, 500);
  const renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(W,H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff,0.55));
  const dirLight=new THREE.DirectionalLight(0xffffff,0.9); dirLight.position.set(20,30,10); scene.add(dirLight);
  const fillLight=new THREE.DirectionalLight(0xffffff,0.3); fillLight.position.set(-20,15,-10); scene.add(fillLight);

  const ground=new THREE.Mesh(new THREE.PlaneGeometry(70,70), new THREE.MeshStandardMaterial({color:0x1e293b}));
  ground.rotation.x=-Math.PI/2; ground.position.y=-0.02;
  scene.add(ground);
  scene.add(new THREE.GridHelper(70,70,0x334155,0x1e293b));

  // ---------- primitives (translated from the AdminInteriorNavigator layout) ----------
  function addBox(x,z,w,d,h,mat,yBase=0){
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
    mesh.position.set(x+w/2, yBase+h/2, z+d/2);
    scene.add(mesh);
    return mesh;
  }
  const wallMat=new THREE.MeshStandardMaterial({color:0xf1f5f9});
  const stepMat=new THREE.MeshStandardMaterial({color:0xcbd5e1});
  const glassMat=new THREE.MeshStandardMaterial({color:0x60a5fa, transparent:true, opacity:0.55, side:THREE.DoubleSide});
  const facadeMat=new THREE.MeshStandardMaterial({color:0xdbe4ee});
  const pillarMat=new THREE.MeshStandardMaterial({color:0xcbd5e1});

  function addHWall(xStart,z,width,thickness,height,mat,gap){
    if(!gap){ addBox(xStart,z,width,thickness,height,mat); return; }
    const seg=(width-gap)/2;
    if(seg>0.05){
      addBox(xStart,z,seg,thickness,height,mat);
      addBox(xStart+width-seg,z,seg,thickness,height,mat);
      addBox(xStart+seg,z,gap,thickness,0.4,mat,height-0.4);
    }
  }
  function addVWall(x,zStart,depth,thickness,height,mat,gap){
    if(!gap){ addBox(x,zStart,thickness,depth,height,mat); return; }
    const seg=(depth-gap)/2;
    if(seg>0.05){
      addBox(x,zStart,thickness,seg,height,mat);
      addBox(x,zStart+depth-seg,thickness,seg,height,mat);
      addBox(x,zStart+seg,thickness,gap,0.4,mat,height-0.4);
    }
  }
  function toLocal(px,py){ return {x:px*ADMIN_SCALE, z:py*ADMIN_SCALE}; }

  const navMeshes=[]; // clickable footprints, tagged userData.navId
  const labels=[];

  // ---------- regular rooms ----------
  ADMIN_ROOMS.forEach(room=>{
    const {x:rx, z:rz}=toLocal(room.x, room.y);
    const rw=room.w*ADMIN_SCALE, rh=room.h*ADMIN_SCALE;
    const floorMat=new THREE.MeshStandardMaterial({color:room.color, transparent:true, opacity:0.5});
    const floor=addBox(rx,rz,rw,rh,0.08,floorMat);
    floor.userData.navId=room.id;
    navMeshes.push(floor);

    addHWall(rx, rz, rw, ADMIN_WALL_THICK, ADMIN_WALL_HEIGHT, wallMat, room.door==='north'?ADMIN_DOOR_W:0);
    addHWall(rx, rz+rh-ADMIN_WALL_THICK, rw, ADMIN_WALL_THICK, ADMIN_WALL_HEIGHT, wallMat, room.door==='south'?ADMIN_DOOR_W:0);
    addVWall(rx, rz, rh, ADMIN_WALL_THICK, ADMIN_WALL_HEIGHT, wallMat, room.door==='west'?ADMIN_DOOR_W:0);
    addVWall(rx+rw-ADMIN_WALL_THICK, rz, rh, ADMIN_WALL_THICK, ADMIN_WALL_HEIGHT, wallMat, room.door==='east'?ADMIN_DOOR_W:0);

    labels.push({pos:new THREE.Vector3(rx+rw/2, ADMIN_WALL_HEIGHT+0.5, rz+rh/2), name:room.name.toUpperCase()});
  });

  // ---------- staircases ----------
  ADMIN_STAIRS.forEach(def=>{
    const {x:rx, z:rz}=toLocal(def.x, def.y);
    const rw=def.w*ADMIN_SCALE, rh=def.h*ADMIN_SCALE;

    const footprintMat=new THREE.MeshStandardMaterial({color:0x334155, transparent:true, opacity:0.4});
    const footprint=addBox(rx,rz,rw,rh,0.08,footprintMat);
    footprint.userData.navId=def.id;
    navMeshes.push(footprint);

    if(def.door!=='north') addHWall(rx, rz, rw, ADMIN_WALL_THICK, ADMIN_WALL_HEIGHT, wallMat, 0);
    if(def.door!=='south') addHWall(rx, rz+rh-ADMIN_WALL_THICK, rw, ADMIN_WALL_THICK, ADMIN_WALL_HEIGHT, wallMat, 0);
    if(def.door!=='west')  addVWall(rx, rz, rh, ADMIN_WALL_THICK, ADMIN_WALL_HEIGHT, wallMat, 0);
    if(def.door!=='east')  addVWall(rx+rw-ADMIN_WALL_THICK, rz, rh, ADMIN_WALL_THICK, ADMIN_WALL_HEIGHT, wallMat, 0);

    const steps=9, stepH=ADMIN_WALL_HEIGHT/steps, longAxisIsX=rw>=rh;
    if(longAxisIsX){
      const stepW=rw/steps;
      for(let i=0;i<steps;i++){
        const sx = def.door==='east' ? rx+rw-stepW*(i+1) : rx+stepW*i;
        addBox(sx, rz+rh*0.1, stepW, rh*0.8, stepH, stepMat, i*stepH);
      }
    } else {
      const stepD=rh/steps;
      for(let i=0;i<steps;i++){
        const sz = def.door==='south' ? rz+rh-stepD*(i+1) : rz+stepD*i;
        addBox(rx+rw*0.1, sz, rw*0.8, stepD, stepH, stepMat, i*stepH);
      }
    }
    labels.push({pos:new THREE.Vector3(rx+rw/2, ADMIN_WALL_HEIGHT+0.5, rz+rh/2), name:def.name.toUpperCase()});
  });

  // ---------- entrance facade ----------
  const ent=ADMIN_ENTRANCE_ROOM;
  const {x:ex, z:ez}=toLocal(ent.x, ent.y);
  const ew=ent.w*ADMIN_SCALE, eh=ent.h*ADMIN_SCALE;

  const entranceFloorMat=new THREE.MeshStandardMaterial({color:0xe2e8f0, transparent:true, opacity:0.4});
  const entFloor=addBox(ex,ez,ew,eh,0.08,entranceFloorMat);
  entFloor.userData.navId=ent.id;
  navMeshes.push(entFloor);

  addVWall(ex, ez, eh, ADMIN_WALL_THICK, ADMIN_WALL_HEIGHT, facadeMat, 0);
  addVWall(ex+ew-ADMIN_WALL_THICK, ez, eh, ADMIN_WALL_THICK, ADMIN_WALL_HEIGHT, facadeMat, 0);
  const doorGap=3.2;
  addHWall(ex, ez+eh-ADMIN_WALL_THICK, ew, ADMIN_WALL_THICK, ADMIN_WALL_HEIGHT, facadeMat, doorGap);

  const doorPanelW=doorGap/2-0.1;
  const doorL=new THREE.Mesh(new THREE.BoxGeometry(doorPanelW, ADMIN_WALL_HEIGHT-0.5, 0.06), glassMat);
  doorL.position.set(ex+ew/2-doorGap/2+doorPanelW/2, (ADMIN_WALL_HEIGHT-0.5)/2, ez+eh-ADMIN_WALL_THICK);
  doorL.rotation.y=0.4;
  scene.add(doorL);
  const doorR=doorL.clone();
  doorR.position.x=ex+ew/2+doorGap/2-doorPanelW/2;
  doorR.rotation.y=-0.4;
  scene.add(doorR);

  addBox(ex+ew/2-doorGap/2-0.6, ez+eh-0.1, doorGap+1.2, 1.8, 0.15, facadeMat, ADMIN_WALL_HEIGHT+0.4);
  addBox(ex+ew/2-doorGap/2-0.5, ez+eh+1.4, 0.15, 0.15, ADMIN_WALL_HEIGHT+0.4, pillarMat);
  addBox(ex+ew/2+doorGap/2+0.35, ez+eh+1.4, 0.15, 0.15, ADMIN_WALL_HEIGHT+0.4, pillarMat);
  addBox(ex+ew/2-doorGap/2-0.6, ez+eh, doorGap+1.2, 1.2, 0.12, stepMat);
  addBox(ex+ew/2-doorGap/2-0.8, ez+eh+1.2, doorGap+1.6, 0.5, 0.06, stepMat);

  labels.push({pos:new THREE.Vector3(ex+ew/2, ADMIN_WALL_HEIGHT+1.4, ez+eh+0.2), name:'ENTRANCE'});

  // ---------- routing (source -> corridor hub -> destination) ----------
  let routeMesh=null, routeGlow=null, walkerMesh=null, walkerT=0, walkerCurve=null, walkerActive=false;
  const tubeMat=new THREE.MeshStandardMaterial({color:0x2f6fed, emissive:0x2f6fed, emissiveIntensity:0.9, roughness:0.3, metalness:0.2});
  function clearRoute(){
    if(routeMesh){ scene.remove(routeMesh); routeMesh.geometry.dispose(); routeMesh.material.dispose(); routeMesh=null; }
    if(routeGlow){ scene.remove(routeGlow); routeGlow.geometry.dispose(); routeGlow.material.dispose(); routeGlow=null; }
    if(walkerMesh){ scene.remove(walkerMesh); walkerMesh.geometry.dispose(); walkerMesh.material.dispose(); walkerMesh=null; }
    walkerActive=false; walkerCurve=null; walkerT=0;
    const dirEl=document.getElementById('interiorDirections');
    if(dirEl){ dirEl.style.display='none'; dirEl.innerHTML=''; }
  }
  function turnByTurn(srcName, dstName, distMeters){
    const walkSecs=Math.max(5, Math.round(distMeters/1.1));
    return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
        <div class="section-title" style="margin:0;"><span class="dot" style="background:var(--blue);box-shadow:0 0 8px var(--blue)"></span>Directions: ${srcName} → ${dstName}</div>
        <div style="font-family:'JetBrains Mono';font-size:12.5px;color:var(--teal);">${distMeters.toFixed(0)} m · ~${walkSecs} s</div>
      </div>
      <ol style="margin:0;padding-left:18px;font-size:13px;color:var(--text-dim);display:flex;flex-direction:column;gap:5px;">
        <li>Exit <b>${srcName}</b> into the corridor.</li>
        <li>Follow the corridor toward the destination wing.</li>
        <li>Arrive at <b>${dstName}</b>.</li>
      </ol>`;
  }
  function drawRoute(sourceId, destId){
    clearRoute();
    const route=adminInteriorPath(sourceId, destId);
    if(!route) return;
    const pts=route.pts.map(p=>new THREE.Vector3(p.x, 0.4, p.z));
    const curvePath=new THREE.CurvePath();
    for(let i=0;i<pts.length-1;i++) curvePath.add(new THREE.LineCurve3(pts[i], pts[i+1]));
    const segs=Math.max(2, pts.length*8);
    const tubeGeo=new THREE.TubeGeometry(curvePath, segs, 0.09, 10, false);
    routeMesh=new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(routeMesh);
    const glowGeo=new THREE.TubeGeometry(curvePath, segs, 0.22, 10, false);
    const glowMat=new THREE.MeshBasicMaterial({color:0x2f6fed, transparent:true, opacity:0.25});
    routeGlow=new THREE.Mesh(glowGeo, glowMat);
    scene.add(routeGlow);
    walkerMesh=new THREE.Mesh(new THREE.SphereGeometry(0.2,16,16), new THREE.MeshBasicMaterial({color:0x18d1c4}));
    scene.add(walkerMesh);
    walkerCurve=curvePath; walkerT=0; walkerActive=true;
    const dirEl=document.getElementById('interiorDirections');
    if(dirEl){ dirEl.style.display='block'; dirEl.innerHTML=turnByTurn(route.src.name, route.dst.name, route.distMeters); }
  }

  // ---------- camera (drag to orbit, wheel/pinch to zoom, right-drag to pan) ----------
  const hub=adminCorridorHub();
  const floorW=hub.maxX-hub.minX, floorH=hub.maxZ-hub.minZ;
  const centerX=(hub.minX+hub.maxX)/2, centerZ=(hub.minZ+hub.maxZ)/2;
  const baseTarget=new THREE.Vector3(centerX, ADMIN_WALL_HEIGHT*0.6, centerZ);
  let target=baseTarget.clone(), radius=Math.max(floorW,floorH)*0.9, theta=0.6, phi=0.9;
  function updateCamPos(){
    camera.position.x = target.x + radius*Math.sin(phi)*Math.sin(theta);
    camera.position.y = target.y + radius*Math.cos(phi);
    camera.position.z = target.z + radius*Math.sin(phi)*Math.cos(theta);
    camera.lookAt(target);
  }
  updateCamPos();

  let dragging=false, panning=false, lastX=0, lastY=0;
  renderer.domElement.addEventListener('contextmenu', e=>e.preventDefault());
  renderer.domElement.addEventListener('mousedown', e=>{
    lastX=e.clientX; lastY=e.clientY;
    if(e.button===2) panning=true; else dragging=true;
  });
  window.addEventListener('mouseup', ()=>{ dragging=false; panning=false; });
  window.addEventListener('mousemove', e=>{
    if(!interiorThree || !interiorThree.active) return;
    const dx=e.clientX-lastX, dy=e.clientY-lastY;
    lastX=e.clientX; lastY=e.clientY;
    if(dragging){
      theta-=dx*0.006; phi=Math.min(Math.max(phi-dy*0.006,0.2),1.5);
      updateCamPos();
    } else if(panning){
      const panSpeed=radius*0.0015;
      const right=new THREE.Vector3(Math.cos(theta),0,-Math.sin(theta));
      const up=new THREE.Vector3(0,1,0);
      target.addScaledVector(right,-dx*panSpeed);
      target.addScaledVector(up,dy*panSpeed);
      updateCamPos();
    }
  });
  renderer.domElement.addEventListener('wheel', e=>{
    e.preventDefault();
    radius=Math.min(Math.max(radius+e.deltaY*0.02, 4), Math.max(floorW,floorH)*3);
    updateCamPos();
  },{passive:false});
  let pinchDist=null;
  renderer.domElement.addEventListener('touchstart', e=>{
    if(e.touches.length===1){ dragging=true; lastX=e.touches[0].clientX; lastY=e.touches[0].clientY; }
    else if(e.touches.length===2){ dragging=false; pinchDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY); }
  },{passive:true});
  renderer.domElement.addEventListener('touchmove', e=>{
    if(e.touches.length===1 && dragging){
      const dx=e.touches[0].clientX-lastX, dy=e.touches[0].clientY-lastY;
      theta-=dx*0.006; phi=Math.min(Math.max(phi-dy*0.006,0.2),1.5);
      lastX=e.touches[0].clientX; lastY=e.touches[0].clientY; updateCamPos();
    } else if(e.touches.length===2 && pinchDist!==null){
      e.preventDefault();
      const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
      radius=Math.min(Math.max(radius-(d-pinchDist)*0.05, 4), Math.max(floorW,floorH)*3);
      pinchDist=d; updateCamPos();
    }
  },{passive:false});
  renderer.domElement.addEventListener('touchend', e=>{ if(e.touches.length<2) pinchDist=null; if(e.touches.length===0) dragging=false; });

  const raycaster=new THREE.Raycaster(); const mouse=new THREE.Vector2();
  renderer.domElement.addEventListener('click', e=>{
    const rect=renderer.domElement.getBoundingClientRect();
    mouse.x=((e.clientX-rect.left)/rect.width)*2-1;
    mouse.y=-((e.clientY-rect.top)/rect.height)*2+1;
    raycaster.setFromCamera(mouse,camera);
    const hits=raycaster.intersectObjects(navMeshes);
    const infoEl=document.getElementById('info3dInterior');
    if(hits.length){
      const r=adminInteriorAllRooms().find(rr=>rr.id===hits[0].object.userData.navId);
      infoEl.style.display='block';
      infoEl.innerHTML=`<h4>${r.name}</h4><div style="color:var(--text-dim);">${r.desc}</div>`;
    } else infoEl.style.display='none';
  });

  const labelLayer=document.createElement('div');
  labelLayer.style.position='absolute'; labelLayer.style.inset='0'; labelLayer.style.pointerEvents='none';
  container.appendChild(labelLayer);
  const labelEls=labels.map(l=>{
    const d=document.createElement('div');
    d.className='label3d'; d.textContent=l.name;
    labelLayer.appendChild(d);
    return {...l, el:d};
  });

  interiorThree={scene,camera,renderer,container,active:true,
    resetView:()=>{ target=baseTarget.clone(); radius=Math.max(floorW,floorH)*0.9; theta=0.6; phi=0.9; updateCamPos(); },
    topView:()=>{ phi=0.05; radius=Math.max(floorW,floorH)*1.3; updateCamPos(); },
    drawRoute, clearRoute
  };
  populateInteriorRouteSelects();

  function animate(){
    requestAnimationFrame(animate);
    labelEls.forEach(l=>{
      const pos=l.pos.clone();
      pos.project(camera);
      const x=(pos.x*0.5+0.5)*container.clientWidth, y=(-pos.y*0.5+0.5)*container.clientHeight;
      l.el.style.left=x+'px'; l.el.style.top=y+'px';
      l.el.style.opacity = pos.z<1 ? '1' : '0';
    });
    if(walkerActive && walkerMesh && walkerCurve){
      walkerT+=0.0035;
      if(walkerT>1) walkerT=0;
      const p=walkerCurve.getPointAt(walkerT);
      walkerMesh.position.set(p.x, p.y+0.3, p.z);
    }
    renderer.render(scene,camera);
  }
  animate();
  window.addEventListener('resize', resizeInteriorRenderer);
  function resizeInteriorRenderer(){
    if(!interiorThree) return;
    const w=container.clientWidth, h=container.clientHeight;
    interiorThree.camera.aspect=w/h; interiorThree.camera.updateProjectionMatrix();
    interiorThree.renderer.setSize(w,h);
  }
}
function switch3DView(view){
  document.getElementById('view3dCampusChip').classList.toggle('active', view==='campus');
  document.getElementById('view3dInteriorChip').classList.toggle('active', view==='interior');
  document.getElementById('view3d-campus').style.display = view==='campus' ? 'block':'none';
  document.getElementById('view3d-interior').style.display = view==='interior' ? 'block':'none';
  if(view==='interior') setTimeout(initAdminInterior, 30);
}
