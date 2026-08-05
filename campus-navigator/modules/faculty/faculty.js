function initFacultyFilters(){
  const depts=['all',...new Set(FACULTY.map(f=>f.department))];
  document.getElementById('facDept').innerHTML = depts.map(d=>`<option value="${d}">${d==='all'?'All departments':d}</option>`).join('');
}
function renderFaculty(){
  const q=(document.getElementById('facSearch').value||'').toLowerCase();
  let list = FACULTY.filter(f=>{
    const matchQ = f.name.toLowerCase().includes(q) || f.department.toLowerCase().includes(q);
    const matchDept = state.facDeptFilter==='all' || f.department===state.facDeptFilter;
    const matchAvail = !state.facAvailOnly || f.status==='available';
    return matchQ && matchDept && matchAvail;
  });
  const el=document.getElementById('facultyList');
  if(!list.length){ el.innerHTML='<div class="empty">No faculty match your filters.</div>'; return; }
  el.innerHTML = list.map((f,i)=>{
    const sm=STATUS_META[f.status];
    const initials=f.name.replace('Dr. ','').split(' ').map(w=>w[0]).slice(0,2).join('');
    return `<div class="fac-card">
      <div class="fac-left">
        <div class="fac-avatar">${initials}</div>
        <div>
          <div class="fac-name">${f.name}</div>
          <div class="fac-dept">${f.department}</div>
          <div class="fac-meta">Cabin ${f.cabin} · ${f.floor} · ${byId(f.block_id).name}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <div style="text-align:right;">
          <span class="badge" style="background:${sm.color}22;color:${sm.color};border:1px solid ${sm.color}55;">${sm.label}</span>
          ${f.eta?`<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">${f.eta}</div>`:''}
        </div>
        <button class="btn" data-block="${f.block_id}">Show on map</button>
      </div>
    </div>`;
  }).join('');
  el.querySelectorAll('[data-block]').forEach(btn=>btn.addEventListener('click',()=>{
    switchTab('map');
    setTimeout(()=>{
      document.getElementById('toSelect').value=byId(btn.dataset.block).name;
      computeAndDrawRoute();
      showPopup(btn.dataset.block,'mapContainer');
    },60);
  }));
}
