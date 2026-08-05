let three = null;
function init3D(){
  const container=document.getElementById('viewer3d');
  if(three){ resizeRenderer(); return; }
  const W=container.clientWidth, H=container.clientHeight;
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x070c17);
  scene.fog=new THREE.Fog(0x070c17, 200, 900);

  const camera=new THREE.PerspectiveCamera(45, W/H, 0.1, 3000);
  const renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(W,H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  container.appendChild(renderer.domElement);

  const hemi=new THREE.HemisphereLight(0x9fc7ff,0x0a0f1a,0.9); scene.add(hemi);
  const dir=new THREE.DirectionalLight(0xffffff,0.9); dir.position.set(150,220,120); scene.add(dir);
  const dir2=new THREE.DirectionalLight(0x2f6fed,0.3); dir2.position.set(-150,80,-100); scene.add(dir2);

  // ground grid
  const grid=new THREE.GridHelper(700,40,0x1c2a45,0x121b2d);
  scene.add(grid);
  const groundGeo=new THREE.PlaneGeometry(700,700);
  const groundMat=new THREE.MeshStandardMaterial({color:0x0a1220, roughness:1});
  const ground=new THREE.Mesh(groundGeo,groundMat);
  ground.rotation.x=-Math.PI/2; ground.position.y=-0.5;
  scene.add(ground);

  const buildingMeshes=[];
  const labels=[];
  BUILDINGS.forEach(b=>{
    const isAdmin = b.id==='admin-block';
    const footprint = isAdmin?26:(b.category==='academic'?18:14);
    const height = Math.max(6, b.floors*7);
    const color = isAdmin? 0x2f6fed : (b.category==='transport'?0xa26cf7 : b.category==='residential'?0xef5da8 : b.category==='facility'?0xf5a623 : b.category==='entrance'?0x8b9ab3 : 0x18d1c4);
    const geo=new THREE.BoxGeometry(footprint,height,footprint);
    const mat=new THREE.MeshStandardMaterial({color, roughness:0.4, metalness:0.15, emissive: isAdmin?0x1c4fc4:0x000000, emissiveIntensity: isAdmin?0.35:0});
    const mesh=new THREE.Mesh(geo,mat);
    mesh.position.set(b.x*0.9, height/2, b.y*0.9);
    mesh.userData.buildingId=b.id;
    scene.add(mesh);
    buildingMeshes.push(mesh);

    // roof edge highlight
    const edges=new THREE.EdgesGeometry(geo);
    const line=new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: isAdmin?0x8fb4ff:0x000000, transparent:true, opacity:isAdmin?0.6:0}));
    line.position.copy(mesh.position);
    scene.add(line);

    labels.push({mesh, height, name:b.name, isAdmin, always: isAdmin});
  });

  // Admin signboard "in front" of the building (toward main gate / -z direction)
  const signGroup = new THREE.Group();
  const adminMesh = buildingMeshes.find(m=>m.userData.buildingId==='admin-block');

  camera.position.set(0, 220, 260);
  camera.lookAt(0,20,0);

  // custom orbit controls
  let target=new THREE.Vector3(0,20,0);
  let radius=340, theta=0.6, phi=1.0;
  let dragging=false, lastX=0,lastY=0;
  function updateCamPos(){
    camera.position.x = target.x + radius*Math.sin(phi)*Math.sin(theta);
    camera.position.y = target.y + radius*Math.cos(phi);
    camera.position.z = target.z + radius*Math.sin(phi)*Math.cos(theta);
    camera.lookAt(target);
  }
  updateCamPos();
  renderer.domElement.addEventListener('mousedown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;});
  window.addEventListener('mouseup',()=>dragging=false);
  window.addEventListener('mousemove',e=>{
    if(!dragging) return;
    const dx=e.clientX-lastX, dy=e.clientY-lastY;
    theta -= dx*0.006; phi = Math.min(Math.max(phi - dy*0.006,0.25),1.5);
    lastX=e.clientX; lastY=e.clientY;
    updateCamPos();
  });
  renderer.domElement.addEventListener('wheel',e=>{
    e.preventDefault();
    radius = Math.min(Math.max(radius + e.deltaY*0.4, 80), 800);
    updateCamPos();
  },{passive:false});
  // touch support
  let touchDist=null;
  renderer.domElement.addEventListener('touchstart',e=>{
    if(e.touches.length===1){dragging=true;lastX=e.touches[0].clientX;lastY=e.touches[0].clientY;}
    else if(e.touches.length===2){dragging=false;touchDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);}
  });
  renderer.domElement.addEventListener('touchmove',e=>{
    if(e.touches.length===1 && dragging){
      const dx=e.touches[0].clientX-lastX, dy=e.touches[0].clientY-lastY;
      theta -= dx*0.006; phi=Math.min(Math.max(phi-dy*0.006,0.25),1.5);
      lastX=e.touches[0].clientX; lastY=e.touches[0].clientY;
      updateCamPos();
    } else if(e.touches.length===2 && touchDist!==null){
      e.preventDefault();
      const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
      radius=Math.min(Math.max(radius-(d-touchDist)*0.6, 80), 800);
      touchDist=d; updateCamPos();
    }
  },{passive:false});
  renderer.domElement.addEventListener('touchend',e=>{ if(e.touches.length<2) touchDist=null; if(e.touches.length===0) dragging=false; });

  // raycaster for clicks
  const raycaster=new THREE.Raycaster();
  const mouse=new THREE.Vector2();
  renderer.domElement.addEventListener('click',(e)=>{
    const rect=renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX-rect.left)/rect.width)*2-1;
    mouse.y = -((e.clientY-rect.top)/rect.height)*2+1;
    raycaster.setFromCamera(mouse,camera);
    const hits=raycaster.intersectObjects(buildingMeshes);
    if(hits.length){
      const b=byId(hits[0].object.userData.buildingId);
      const infoEl=document.getElementById('info3d');
      infoEl.style.display='block';
      infoEl.innerHTML = `<h4>${b.name}</h4><div style="color:var(--text-dim);margin-bottom:4px;">${CATEGORY_META[b.category].label} · ${b.floors} floor(s)</div><div style="color:var(--text-dim);">${b.hours}</div><div style="margin-top:6px;">${b.description}</div>`;
    } else {
      document.getElementById('info3d').style.display='none';
    }
  });

  // labels overlay
  const labelLayer=document.createElement('div');
  labelLayer.style.position='absolute'; labelLayer.style.inset='0'; labelLayer.style.pointerEvents='none';
  container.appendChild(labelLayer);
  const labelEls = labels.map(l=>{
    const d=document.createElement('div');
    d.className='label3d'+(l.isAdmin?' admin':'');
    d.textContent = l.isAdmin? 'ADMIN BLOCK' : l.name;
    d.style.display = l.always? 'block':'none';
    labelLayer.appendChild(d);
    return {...l, el:d};
  });

  three = {scene,camera,renderer,container,buildingMeshes,labelEls,labelLayer,
    setTarget:(v)=>{target.copy(v);updateCamPos();},
    setRadius:(r)=>{radius=r;updateCamPos();},
    resetView:()=>{target.set(0,20,0);radius=340;theta=0.6;phi=1.0;updateCamPos();},
    toggleAllLabels:()=>{ three.allLabelsOn=!three.allLabelsOn; labelEls.forEach(l=>{ if(!l.isAdmin) l.el.style.display = three.allLabelsOn?'block':'none'; }); }
  };

  function animate(){
    requestAnimationFrame(animate);
    labelEls.forEach(l=>{
      const pos=l.mesh.position.clone();
      pos.y += l.height/2 + (l.isAdmin?14:6);
      pos.project(camera);
      const x=(pos.x*0.5+0.5)*container.clientWidth;
      const y=(-pos.y*0.5+0.5)*container.clientHeight;
      l.el.style.left=x+'px'; l.el.style.top=y+'px';
      l.el.style.opacity = pos.z<1 ? '1':'0';
    });
    renderer.render(scene,camera);
  }
  animate();

  window.addEventListener('resize', resizeRenderer);
  function resizeRenderer(){
    if(!three) return;
    const w=container.clientWidth, h=container.clientHeight;
    three.camera.aspect=w/h; three.camera.updateProjectionMatrix();
    three.renderer.setSize(w,h);
  }
}
function flyToAdmin(){
  if(!three) return;
  const admin=byId('admin-block');
  three.setTarget(new THREE.Vector3(admin.x*0.9, 20, admin.y*0.9));
  three.setRadius(120);
  const b=admin;
  const infoEl=document.getElementById('info3d');
  infoEl.style.display='block';
  infoEl.innerHTML = `<h4>${b.name}</h4><div style="color:var(--text-dim);margin-bottom:4px;">${CATEGORY_META[b.category].label} · ${b.floors} floor(s)</div><div style="color:var(--text-dim);">${b.hours}</div><div style="margin-top:6px;">${b.description}</div>`;
}

