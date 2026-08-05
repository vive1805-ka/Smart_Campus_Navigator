function categoryChipsHTML(){
  const cats=[{id:'all',label:'All'},...Object.entries(CATEGORY_META).map(([id,m])=>({id,label:m.label}))];
  return cats.map(c=>`<div class="chip ${state.mapCategory===c.id?'active':''}" data-cat="${c.id}">${c.label}</div>`).join('');
}
/* ---- Leaflet-backed campus map (real OpenStreetMap tiles + true GPS coordinates) ---- */
const leafletMaps = {}; // containerId -> {map, edgesLayer, markersLayer, routeLine, markersById}

function ensureLeafletMap(containerId){
  if(leafletMaps[containerId]) return leafletMaps[containerId];
  const map = L.map(containerId, {zoomControl:true, attributionControl:true, scrollWheelZoom:true})
    .setView([CENTER.lat, CENTER.lng], 17);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom:20,
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
  }).addTo(map);
  const edgesLayer = L.layerGroup().addTo(map);
  const markersLayer = L.layerGroup().addTo(map);
  const entry = {map, edgesLayer, markersLayer, routeLine:null, markersById:{}};
  map.on('popupopen', (e)=>{
    const node = e.popup.getElement();
    const btn = node && node.querySelector('[data-dest]');
    if(btn){
      btn.onclick = ()=>{
        document.getElementById('toSelect').value = byId(btn.getAttribute('data-dest')).name;
        map.closePopup();
        computeAndDrawRoute();
      };
    }
  });
  leafletMaps[containerId] = entry;
  return entry;
}

function popupHTML(b){
  return `
    <h4>${b.name}</h4>
    <div class="cat">${CATEGORY_META[b.category].label} · ${b.floors} floor(s)</div>
    <div class="row"><span>Hours</span><span>${b.hours}</span></div>
    ${b.departments.length?`<div class="row"><span>Dept.</span><span style="text-align:right">${b.departments.join(', ')}</span></div>`:''}
    <div style="color:var(--text-dim);margin-top:6px;">${b.description}</div>
    <div class="actions">
      <button class="btn primary" style="flex:1;font-size:11.5px;padding:7px" data-dest="${b.id}">Set as destination</button>
    </div>`;
}

function renderMap(containerId, interactive){
  const containerEl = document.getElementById(containerId);
  if(!containerEl || containerEl.clientWidth===0 || containerEl.clientHeight===0){
    // Container is hidden (e.g. its tab isn't active yet). Leaflet cannot size itself
    // correctly if created here — bail out; switchTab() re-calls renderMap once visible.
    return;
  }
  const entry = ensureLeafletMap(containerId);
  const {map, edgesLayer, markersLayer} = entry;
  edgesLayer.clearLayers();
  markersLayer.clearLayers();
  entry.markersById = {};
  if(entry.routeLine){ map.removeLayer(entry.routeLine); entry.routeLine=null; }

  EDGES.forEach(([a,b])=>{
    const A=byId(a), B=byId(b);
    L.polyline([[A.lat,A.lng],[B.lat,B.lng]], {color:'#8b9ab3', weight:1.5, opacity:0.25}).addTo(edgesLayer);
  });

  const hasRoute = state.currentRoute && state.currentRoute.container===containerId && state.currentRoute.path.length>1;
  const routeIds = hasRoute ? state.currentRoute.path : [];
  const sourceId = hasRoute ? routeIds[0] : null;
  const destId = hasRoute ? routeIds[routeIds.length-1] : null;

  const visibleBuildings = BUILDINGS.filter(b=> state.mapCategory==='all' || b.category===state.mapCategory);
  visibleBuildings.forEach(b=>{
    const meta=CATEGORY_META[b.category];
    const isAdmin = b.id==='admin-block';
    const isSource = b.id===sourceId;
    const isDest = b.id===destId;
    const onRoute = routeIds.includes(b.id);
    const dimmed = hasRoute && !onRoute;
    const dotColor = isSource ? '#2ecc71' : isDest ? '#f0455a' : meta.color;
    const dotR = (isSource||isDest) ? 10 : (isAdmin?9:7);
    const marker = L.circleMarker([b.lat,b.lng], {
      radius:dotR, color:'#070c17', weight:2, fillColor:dotColor, fillOpacity:dimmed?0.3:1, opacity:dimmed?0.3:1
    }).addTo(markersLayer);
    const label = isSource?'START':isDest?'DESTINATION':b.name;
    marker.bindTooltip(label, {permanent:false, direction:'top', offset:[0,-8], className:'kec-tooltip'});
    marker.bindPopup(popupHTML(b), {className:'kec-popup', closeButton:true});
    entry.markersById[b.id]=marker;
    if(interactive){
      marker.on('click', ()=>{ marker.openPopup(); });
    }
  });

  if(hasRoute){
    const latlngs = routeIds.map(id=>{const b=byId(id); return [b.lat,b.lng];});
    // Glow/outline pass underneath so the path reads clearly against the tiles
    L.polyline(latlngs, {color:'#04141c', weight:9, opacity:0.55, lineCap:'round', lineJoin:'round'}).addTo(markersLayer);
    entry.routeLine = L.polyline(latlngs, {
      color:'#18d1c4', weight:5, opacity:1, lineCap:'round', lineJoin:'round',
      dashArray:'10 8', className:'route-line'
    }).addTo(map);
    entry.routeLine.bringToFront();
    map.fitBounds(entry.routeLine.getBounds(), {padding:[50,50], maxZoom:18});
  }
  setTimeout(()=>map.invalidateSize(), 0);
}
function showPopup(id, containerId){
  const entry = ensureLeafletMap(containerId);
  const marker = entry.markersById[id];
  if(marker){ entry.map.panTo(marker.getLatLng()); marker.openPopup(); }
}
function closePopup(){ Object.values(leafletMaps).forEach(e=>e.map.closePopup()); }

function populateSelectors(){
  let saved={};
  try{ saved=JSON.parse(localStorage.getItem('campusNav_lastRoute')||'{}'); }catch(e){}
  document.getElementById('fromSelect').value = saved.from || 'Main Gate';
  document.getElementById('toSelect').value = saved.to || 'Central Library';
}
function saveLastRoute(){
  try{
    localStorage.setItem('campusNav_lastRoute', JSON.stringify({
      from: document.getElementById('fromSelect').value,
      to: document.getElementById('toSelect').value
    }));
  }catch(e){}
}
function comboOptions(includeMyLocation){
  const opts = BUILDINGS.map(b=>({id:b.id, name:b.name, category:b.category}));
  return includeMyLocation ? [{id:'__me', name:'📍 My Location', category:null}, ...opts] : opts;
}
function setupCombo(inputId, listId, includeMyLocation){
  const input=document.getElementById(inputId), list=document.getElementById(listId);
  let items=[], activeIdx=-1;

  function render(showAll){
    const q = showAll ? '' : input.value.trim().toLowerCase();
    const all=comboOptions(includeMyLocation);
    items = q ? all.filter(o=>o.name.toLowerCase().includes(q)) : all;
    activeIdx = -1;
    if(!items.length){
      list.innerHTML = `<div class="combo-empty">No building matches "${input.value}"</div>`;
    } else {
      list.innerHTML = items.map((o,i)=>{
        const meta = o.category ? CATEGORY_META[o.category] : null;
        return `<div class="combo-item" data-idx="${i}">
          <span class="dot" style="background:${meta?meta.color:'#8b9ab3'}"></span>
          <span>${o.name}</span>
          ${meta?`<span class="meta">${meta.label}</span>`:''}
        </div>`;
      }).join('');
    }
  }
  function open(showAll){ render(showAll); list.classList.add('open'); }
  function close(){ list.classList.remove('open'); }
  function choose(o){
    input.value = o.name;
    close();
    computeAndDrawRoute();
  }
  function setActive(i){
    activeIdx=i;
    list.querySelectorAll('.combo-item').forEach(el=>el.classList.toggle('hi', +el.dataset.idx===i));
    const el=list.querySelector(`.combo-item[data-idx="${i}"]`);
    if(el) el.scrollIntoView({block:'nearest'});
  }

  input.addEventListener('focus', ()=>{ input.select(); open(true); });
  input.addEventListener('input', ()=> open(false));
  input.addEventListener('click', ()=> open(list.classList.contains('open') ? false : true));
  list.addEventListener('mousedown', e=>{
    const item=e.target.closest('.combo-item');
    if(!item) return;
    e.preventDefault();
    choose(items[+item.dataset.idx]);
  });
  input.addEventListener('keydown', e=>{
    if(!list.classList.contains('open') && (e.key==='ArrowDown'||e.key==='ArrowUp')){ open(); return; }
    if(e.key==='ArrowDown'){ e.preventDefault(); setActive(Math.min(activeIdx+1, items.length-1)); }
    else if(e.key==='ArrowUp'){ e.preventDefault(); setActive(Math.max(activeIdx-1, 0)); }
    else if(e.key==='Enter'){
      e.preventDefault();
      if(activeIdx>=0 && items[activeIdx]) choose(items[activeIdx]);
      else { close(); computeAndDrawRoute(); }
    } else if(e.key==='Escape'){ close(); }
  });
  input.addEventListener('blur', ()=> setTimeout(close, 150));
}
function nearestBuildingToUser(){
  if(!state.userLoc) return 'main-gate';
  let best=null,bd=Infinity;
  BUILDINGS.forEach(b=>{ const d=haversine(state.userLoc.lat,state.userLoc.lng,b.lat,b.lng); if(d<bd){bd=d;best=b.id;} });
  return best;
}
// Resolves whatever text the person typed/selected — as-is, case-insensitive —
// to a building id. Tries exact name match first, then "contains" in both directions.
function resolveBuildingId(raw){
  if(!raw) return null;
  const t = raw.trim().toLowerCase();
  if(t==='📍 my location' || t==='my location' || t==='__me') return '__me';
  let hit = BUILDINGS.find(b=>b.name.toLowerCase()===t);
  if(hit) return hit.id;
  hit = BUILDINGS.find(b=>b.name.toLowerCase().includes(t));
  if(hit) return hit.id;
  hit = BUILDINGS.find(b=>t.includes(b.name.toLowerCase()));
  return hit ? hit.id : null;
}
function computeAndDrawRoute(){
  const fromRaw=document.getElementById('fromSelect').value;
  const toRaw=document.getElementById('toSelect').value;
  saveLastRoute();
  const infoEl=document.getElementById('routeInfo');

  let fromId = resolveBuildingId(fromRaw);
  const toId = resolveBuildingId(toRaw);
  if(fromId==='__me') fromId = nearestBuildingToUser();

  if(!fromId || !toId){
    const which = !fromId && !toId ? 'Both building names' : !fromId ? `"${fromRaw}"` : `"${toRaw}"`;
    infoEl.innerHTML = `<div class="empty">${which} didn't match a known building. Try the exact name, e.g. "Central Library" or "CSE Block".</div>`;
    return;
  }
  const result = shortestPath(fromId, toId);
  if(!result){ infoEl.innerHTML='<div class="empty">No walking path found between these locations.</div>'; return; }
  state.currentRoute = {path:result.path, container:'mapContainer'};
  renderMap('mapContainer', true);
  const steps = result.path.map(id=>byId(id).name);
  infoEl.innerHTML = `
    <div class="panel" style="background:var(--panel-2);">
      <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:10px;">
        <div><div class="lbl" style="color:var(--text-dim);font-size:11px;">DISTANCE</div><div style="font-family:'Space Grotesk';font-size:18px;font-weight:700;color:var(--teal);">${fmtDist(result.distance)}</div></div>
        <div><div class="lbl" style="color:var(--text-dim);font-size:11px;">EST. WALK TIME</div><div style="font-family:'Space Grotesk';font-size:18px;font-weight:700;">${fmtWalk(result.distance)}</div></div>
        <div><div class="lbl" style="color:var(--text-dim);font-size:11px;">STOPS</div><div style="font-family:'Space Grotesk';font-size:18px;font-weight:700;">${steps.length}</div></div>
      </div>
      <div style="font-size:12.5px;color:var(--text-dim);">${steps.map((s,i)=>`<span style="color:${i===0||i===steps.length-1?'var(--text)':'var(--text-dim)'}">${s}</span>`).join(' <span style="color:var(--teal)">→</span> ')}</div>
    </div>`;
}
