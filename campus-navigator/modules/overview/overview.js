function renderOverview(){
  const availableNow = FACULTY.filter(f=>f.status==='available').length;
  const nb = nextBusOverall();
  const cards = [
    {label:'Buildings tracked', val:BUILDINGS.length, icon:'🏛', color:'var(--blue)', go:'map'},
    {label:'Faculty available now', val:availableNow+' / '+FACULTY.length, icon:'🧑‍🏫', color:'var(--green)', go:'faculty'},
    {label:'Next bus departure', val:nb, icon:'🚌', color:'var(--purple)', go:'bus'},
    {label:'Emergency contacts', val:EMERGENCY_CONTACTS.length+' ready', icon:'🆘', color:'var(--red)', go:'emergency'},
  ];
  document.getElementById('statCards').innerHTML = cards.map(c=>`
    <div class="stat-card" data-go="${c.go}">
      <div class="glow" style="background:${c.color}"></div>
      <div class="icon" style="background:${c.color}22;">${c.icon}</div>
      <div class="val">${c.val}</div>
      <div class="lbl">${c.label}</div>
    </div>`).join('');
  document.querySelectorAll('.stat-card').forEach(el=>el.addEventListener('click',()=>switchTab(el.dataset.go)));

  const alerts = [
    {t:'Medical Center', d:'24-hour emergency desk active. OPD open 9 AM – 5 PM.', c:'var(--green)'},
    {t:'CSE Block', d:'Dr. Arun Prakash in meeting — free after 4:00 PM.', c:'var(--amber)'},
    {t:'Bus Route A', d:'Next departure to campus at '+nextDeparture(BUS_ROUTES[0].toCampus)+'.', c:'var(--purple)'},
  ];
  document.getElementById('alertsList').innerHTML = alerts.map(a=>`
    <div style="display:flex;gap:10px;align-items:flex-start;">
      <div style="width:8px;height:8px;border-radius:50%;background:${a.c};margin-top:6px;flex-shrink:0;"></div>
      <div><div style="font-weight:600;font-size:13px;">${a.t}</div><div style="color:var(--text-dim);font-size:12px;">${a.d}</div></div>
    </div>`).join('');
  renderMap('overviewMapMini', false);
}
function nextDeparture(times){
  const now=new Date(); const cur=now.getHours()*60+now.getMinutes();
  for(const t of times){ const [h,m]=t.split(':').map(Number); if(h*60+m>=cur) return t; }
  return times[0]+' (tomorrow)';
}
function minutesUntil(timeStr){
  if(!timeStr || timeStr.includes('tomorrow')) return null;
  const now=new Date(); const cur=now.getHours()*60+now.getMinutes();
  const [h,m]=timeStr.split(':').map(Number);
  return Math.max(0, h*60+m-cur);
}
function nextBusOverall(){
  let best=null;
  BUS_ROUTES.forEach(r=>{ const nd=nextDeparture(r.toCampus); if(!best) best=nd+' · '+r.name.split('·')[1].trim(); });
  return best;
}
