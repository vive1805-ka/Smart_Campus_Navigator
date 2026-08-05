function renderNav(){
  const el=document.getElementById('navlist');
  el.innerHTML = NAV.map(n=>`
    <div class="navitem ${state.tab===n.id?'active':''}" data-tab="${n.id}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="${n.icon}"/></svg>
      <span>${n.label}</span>
    </div>`).join('');
  el.querySelectorAll('.navitem').forEach(elm=>elm.addEventListener('click',()=>switchTab(elm.dataset.tab)));
}

function switchTab(id){
  state.tab=id;
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('tab-'+id).classList.add('active');
  document.getElementById('pageTitle').textContent=PAGE_META[id][0];
  document.getElementById('pageSub').textContent=PAGE_META[id][1];
  renderNav();
  if(id==='3d') setTimeout(init3D,30);
  if(id==='map') setTimeout(()=>{ renderMap('mapContainer',true); if(leafletMaps.mapContainer) leafletMaps.mapContainer.map.invalidateSize(); },30);
}

/* ======================= CLOCK ======================= */
function tickClock(){
  const d=new Date();
  document.getElementById('clockTime').textContent=d.toLocaleTimeString('en-IN',{hour12:false});
  document.getElementById('clockDate').textContent=d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'});
}
setInterval(tickClock,1000); tickClock();

function initAll(){
  renderNav();
  renderOverview();
  populateSelectors();
  initFacultyFilters();
  renderFaculty();
  renderBus();
  renderNearby();
  renderEmergency();
  renderSuggestions();
  pushMsg('ai', "Hi! I'm Campus AI. Ask me for a route, a faculty member's availability, the next bus, or emergency numbers — I compute real answers from the live campus database.");

  const catChipsEl = document.getElementById('categoryChips');
  catChipsEl.innerHTML = categoryChipsHTML();
  catChipsEl.addEventListener('click', (e)=>{
    const chip = e.target.closest('.chip');
    if(!chip) return;
    state.mapCategory = chip.dataset.cat;
    catChipsEl.innerHTML = categoryChipsHTML();
    renderMap('mapContainer', true);
  });

  document.getElementById('routeBtn').addEventListener('click', computeAndDrawRoute);
  setupCombo('fromSelect','fromComboList', true);
  setupCombo('toSelect','toComboList', false);
  document.getElementById('useLocBtn').addEventListener('click',()=>{
    if(!navigator.geolocation){ alert('Geolocation not supported on this device.'); return; }
    navigator.geolocation.getCurrentPosition(pos=>{
      state.userLoc={lat:pos.coords.latitude,lng:pos.coords.longitude};
      document.getElementById('fromSelect').value='📍 My Location';
      computeAndDrawRoute();
    }, ()=>alert('Location permission denied.'));
  });

  document.getElementById('facSearch').addEventListener('input', renderFaculty);
  document.getElementById('facDept').addEventListener('change', e=>{ state.facDeptFilter=e.target.value; renderFaculty(); });
  document.getElementById('availOnlyChip').addEventListener('click', e=>{
    state.facAvailOnly=!state.facAvailOnly;
    e.target.classList.toggle('active', state.facAvailOnly);
    renderFaculty();
  });

  document.getElementById('nearbyLocBtn').addEventListener('click',()=>{
    if(!navigator.geolocation){ alert('Geolocation not supported.'); return; }
    navigator.geolocation.getCurrentPosition(pos=>{
      state.userLoc={lat:pos.coords.latitude,lng:pos.coords.longitude};
      renderNearby();
    }, ()=>alert('Location permission denied.'));
  });

  document.getElementById('sosBtn').addEventListener('click', doSOS);
  document.getElementById('chatSend').addEventListener('click', sendChat);
  document.getElementById('chatInput').addEventListener('keydown', e=>{ if(e.key==='Enter') sendChat(); });

  document.getElementById('flyAdminBtn').addEventListener('click', flyToAdmin);
  document.getElementById('resetViewBtn').addEventListener('click', ()=>three&&three.resetView());
  document.getElementById('toggleLabelsBtn').addEventListener('click', ()=>three&&three.toggleAllLabels());
  document.getElementById('view3dCampusChip').addEventListener('click', ()=>switch3DView('campus'));
  document.getElementById('view3dInteriorChip').addEventListener('click', ()=>switch3DView('interior'));
  document.getElementById('interiorResetBtn').addEventListener('click', ()=>interiorThree&&interiorThree.resetView());
  document.getElementById('interiorTopBtn').addEventListener('click', ()=>interiorThree&&interiorThree.topView());
  document.getElementById('interiorRouteBtn').addEventListener('click', ()=>{
    const src=document.getElementById('interiorSourceSelect').value;
    const dst=document.getElementById('interiorDestSelect').value;
    if(!interiorThree){ setTimeout(initAdminInterior, 30); }
    if(src===dst){ alert('Choose two different rooms for source and destination.'); return; }
    setTimeout(()=>interiorThree && interiorThree.drawRoute(src,dst), 60);
  });
  document.getElementById('interiorClearRouteBtn').addEventListener('click', ()=>interiorThree&&interiorThree.clearRoute());

  computeAndDrawRoute();
  setInterval(renderBus, 30000);
}
initAll();

/* ======================= SPLASH ======================= */
(function(){
  const splash=document.getElementById('splash');
  const fill=document.getElementById('splashBarFill');
  const loadingText=document.getElementById('splashLoading');
  requestAnimationFrame(()=>{ fill.style.width='100%'; });
  setTimeout(()=>{ loadingText.textContent='Ready.'; },1500);
  let dismissed=false;
  function dismiss(){
    if(dismissed) return; dismissed=true;
    splash.classList.add('hide');
    setTimeout(()=>{ splash.style.display='none'; },650);
  }
  setTimeout(dismiss,2200);
  splash.addEventListener('click',dismiss);
})();
