function renderEmergency(){
  document.getElementById('contactsList').innerHTML = EMERGENCY_CONTACTS.map(c=>`
    <div class="contact-row">
      <div><div style="font-weight:600;font-size:13px;">${c.label}</div>${c.location_id?`<div style="font-size:11px;color:var(--text-dim);">${byId(c.location_id).name}</div>`:''}</div>
      <a class="btn primary" href="tel:${c.number.replace(/[^0-9]/g,'')}" style="text-decoration:none;">📞 ${c.number}</a>
    </div>`).join('');
  const med=byId('medical-center');
  document.getElementById('emergencyNear').innerHTML = `
    <div class="fac-card" style="margin-bottom:10px;">
      <div class="fac-left"><div class="fac-avatar" style="background:${CATEGORY_META.facility.color}33;color:${CATEGORY_META.facility.color}">🏥</div>
      <div><div class="fac-name">Medical Center</div><div class="fac-dept">${med.hours}</div></div></div>
      <button class="btn" id="routeToMed">Get directions</button>
    </div>
    <div class="page-sub">If this is a life-threatening emergency, call ${EMERGENCY_CONTACTS[4].number} (Ambulance) or ${EMERGENCY_CONTACTS[5].number} (Police) directly.</div>`;
  document.getElementById('routeToMed').addEventListener('click',()=>{
    switchTab('map');
    setTimeout(()=>{ document.getElementById('toSelect').value=byId('medical-center').name; computeAndDrawRoute(); },60);
  });
}
function doSOS(){
  const resEl=document.getElementById('sosResult');
  resEl.innerHTML = '<div class="page-sub">Getting your location…</div>';
  if(!navigator.geolocation){
    resEl.innerHTML = '<div class="page-sub">Location unavailable on this device. Call Security Office directly at 0424-2260123.</div>';
    return;
  }
  navigator.geolocation.getCurrentPosition(pos=>{
    const {latitude,longitude}=pos.coords;
    state.userLoc={lat:latitude,lng:longitude};
    const link=`https://www.google.com/maps?q=${latitude},${longitude}`;
    resEl.innerHTML = `
      <div class="panel" style="background:rgba(240,69,90,.08);border-color:var(--red);">
        <div style="font-weight:700;color:var(--red);margin-bottom:6px;">SOS location captured</div>
        <div style="font-size:12.5px;color:var(--text-dim);word-break:break-all;">${link}</div>
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
          <button class="btn" id="copyLocBtn">Copy link</button>
          <a class="btn danger" href="tel:0424-2260123" style="text-decoration:none;">Call Security now</a>
          <button class="btn primary" id="sosRouteMedBtn">🏥 Route to Medical Center</button>
        </div>
      </div>`;
    document.getElementById('copyLocBtn').addEventListener('click',()=>{
      navigator.clipboard.writeText(link).then(()=>{
        document.getElementById('copyLocBtn').textContent='Copied ✓';
      });
    });
    document.getElementById('sosRouteMedBtn').addEventListener('click',()=>{
      switchTab('map');
      setTimeout(()=>{
        document.getElementById('fromSelect').value='📍 My Location';
        document.getElementById('toSelect').value=byId('medical-center').name;
        computeAndDrawRoute();
      },60);
    });
  }, err=>{
    resEl.innerHTML = '<div class="page-sub">Location permission denied. Call Security Office directly at 0424-2260123, or Campus Helpline 1800-123-4567.</div>';
  });
}
