function renderNearby(){
  const ref = state.userLoc ? null : (state.nearbyRef||'main-gate');
  document.getElementById('nearbyRefText').textContent = state.userLoc
    ? 'Using your live location.'
    : `Using ${byId(ref).name} as reference — tap "Use my location" for personalized results.`;
  const chipsEl=document.getElementById('nearbyChips');
  chipsEl.innerHTML = categoryChipsHTMLFor('nearby');
  chipsEl.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{ state.mapCategory=c.dataset.cat; renderNearby(); }));

  let list = BUILDINGS.filter(b=> state.mapCategory==='all' || b.category===state.mapCategory).map(b=>{
    let d;
    if(state.userLoc) d=haversine(state.userLoc.lat,state.userLoc.lng,b.lat,b.lng);
    else d=localDist(byId(ref),b);
    return {...b, d};
  }).sort((a,b)=>a.d-b.d);
  const el=document.getElementById('nearbyList');
  el.innerHTML = list.map(b=>`
    <div class="fac-card">
      <div class="fac-left">
        <div class="fac-avatar" style="background:${CATEGORY_META[b.category].color}33;color:${CATEGORY_META[b.category].color};">${b.name[0]}</div>
        <div>
          <div class="fac-name">${b.name}</div>
          <div class="fac-dept">${CATEGORY_META[b.category].label} · ${b.hours}</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:'Space Grotesk';font-weight:700;color:var(--teal);">${fmtDist(b.d)}</div>
        <div style="font-size:11px;color:var(--text-dim);">${fmtWalk(b.d)}</div>
      </div>
    </div>`).join('');
}
function categoryChipsHTMLFor(){
  const cats=[{id:'all',label:'All'},...Object.entries(CATEGORY_META).map(([id,m])=>({id,label:m.label}))];
  return cats.map(c=>`<div class="chip ${state.mapCategory===c.id?'active':''}" data-cat="${c.id}">${c.label}</div>`).join('');
}
