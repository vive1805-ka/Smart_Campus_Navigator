function renderBus(){
  document.getElementById('busGrid').innerHTML = BUS_ROUTES.map(r=>{
    const next = nextDeparture(r.toCampus);
    const mins = minutesUntil(next);
    const countdown = mins===null ? '' : mins===0 ? ' · arriving now' : ` · in ${mins} min`;
    return `<div class="bus-card">
      <h4>${r.name}</h4>
      <div style="color:var(--text-dim);font-size:11.5px;margin-bottom:10px;">${r.stops.join(' → ')}</div>
      <div style="font-size:11px;color:var(--text-dimmer);margin-bottom:5px;">TO CAMPUS${countdown?`<span style="color:var(--teal);font-weight:700;">${countdown}</span>`:''}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
        ${r.toCampus.map(t=>`<span class="time-pill ${t===next?'next':''}">${t}${t===next?' · next':''}</span>`).join('')}
      </div>
      <div style="font-size:11px;color:var(--text-dimmer);margin-bottom:5px;">FROM CAMPUS</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${r.fromCampus.map(t=>`<span class="time-pill">${t}</span>`).join('')}
      </div>
    </div>`;
  }).join('');
}
