function pushMsg(role,text){
  const win=document.getElementById('chatWindow');
  const div=document.createElement('div');
  div.className='msg '+role;
  div.textContent=text;
  win.appendChild(div);
  win.scrollTop=win.scrollHeight;
  return div;
}
function findAdminRoomMention(text){
  const t=text.toLowerCase();
  const found=[];
  adminInteriorAllRooms().forEach(r=>{
    const aliases=[r.name.toLowerCase(), r.id.replace(/-/g,' ')];
    if(aliases.some(a=>t.includes(a))) found.push(r.id);
  });
  return [...new Set(found)];
}
function describeInteriorRoute(sourceId, destId){
  const route=adminInteriorPath(sourceId, destId);
  if(!route) return null;
  const walkMin = Math.max(1, Math.round(route.distMeters/1.1/60));
  return `Inside the Admin Block: ${route.src.name} → ${route.dst.name}, about ${route.distMeters.toFixed(0)} m (~${walkMin} min walk) through the corridor.`;
}
function findBuildingMention(text){
  const t=text.toLowerCase();
  let found=[];
  BUILDINGS.forEach(b=>{
    const aliases=[b.name.toLowerCase(), b.id.replace(/-/g,' ')];
    b.departments.forEach(d=>aliases.push(d.toLowerCase()));
    if(aliases.some(a=>t.includes(a))) found.push(b.id);
  });
  return [...new Set(found)];
}
function buildContextComputation(text){
  const mentioned = findBuildingMention(text);
  const adminMentioned = findAdminRoomMention(text);
  let context='';
  if(adminMentioned.length>=2){
    const desc=describeInteriorRoute(adminMentioned[0], adminMentioned[1]);
    if(desc) context += desc+'\n';
  } else if(mentioned.length>=2){
    const r = shortestPath(mentioned[0], mentioned[1]);
    if(r) context += `Computed route: ${r.path.map(id=>byId(id).name).join(' -> ')}. Distance ${fmtDist(r.distance)}, ${fmtWalk(r.distance)}.\n`;
  } else if(mentioned.length===1 && /near|nearest|closest/i.test(text)){
    const ref = mentioned[0];
    const sorted = BUILDINGS.filter(b=>b.id!==ref).map(b=>({b,d:localDist(byId(ref),b)})).sort((a,b)=>a.d-b.d).slice(0,3);
    context += `Nearest places to ${byId(ref).name}: `+sorted.map(s=>`${s.b.name} (${fmtDist(s.d)})`).join(', ')+'.\n';
  }
  if(/faculty|professor|dr\.|available/i.test(text)){
    const hits = FACULTY.filter(f=> text.toLowerCase().includes(f.name.toLowerCase().replace('dr. ','')) || (mentioned.length && mentioned.includes(f.block_id)));
    if(hits.length) context += 'Faculty data: '+hits.map(f=>`${f.name} (${f.department}) is ${STATUS_META[f.status].label}${f.eta?', '+f.eta:''}, cabin ${f.cabin} in ${byId(f.block_id).name}.`).join(' ')+'\n';
  }
  if(/bus/i.test(text)){
    context += 'Bus routes: '+BUS_ROUTES.map(r=>`${r.name}: next departure to campus ${nextDeparture(r.toCampus)}.`).join(' ')+'\n';
  }
  if(/emergency|sos|help|hurt|accident/i.test(text)){
    context += 'Emergency contacts: '+EMERGENCY_CONTACTS.map(c=>`${c.label} ${c.number}`).join(', ')+'.\n';
  }
  return context;
}
async function askCampusAI(userText){
  const thinkingEl=pushMsg('ai thinking','Thinking…');
  const computed = buildContextComputation(userText);
  const systemPrompt = `You are Campus AI for Kongu Engineering College, Perundurai, Tamil Nadu. Answer briefly (2-5 sentences), practically, and warmly, like a helpful campus guide. You have this live campus database:
Buildings: ${BUILDINGS.map(b=>`${b.name} [${b.category}, ${b.hours}${b.departments.length? ', depts: '+b.departments.join('/'):''}]`).join('; ')}.
Faculty: ${FACULTY.map(f=>`${f.name} (${f.department}) - ${f.status}${f.eta?', '+f.eta:''}, cabin ${f.cabin}, ${byId(f.block_id).name}`).join('; ')}.
Bus routes: ${BUS_ROUTES.map(r=>r.name+': '+r.stops.join('->')).join('; ')}.
Emergency contacts: ${EMERGENCY_CONTACTS.map(c=>c.label+' '+c.number).join(', ')}.
${computed ? 'Use this precomputed data verbatim where relevant (do not invent different numbers):\n'+computed : ''}
If asked for a route/distance/time and it is not precomputed above, say you need both a clear start and destination building name.`;
  try{
    const response = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        model:'claude-sonnet-4-6',
        max_tokens:400,
        system: systemPrompt,
        messages:[{role:'user', content:userText}]
      })
    });
    const data = await response.json();
    const textOut = (data.content||[]).map(c=>c.text||'').join('\n').trim();
    thinkingEl.remove();
    pushMsg('ai', textOut || "I couldn't quite process that — try asking about a route, faculty member, bus, or emergency contact.");
  }catch(err){
    thinkingEl.remove();
    // graceful offline fallback using only computed context
    if(computed){
      pushMsg('ai', computed.trim());
    } else {
      pushMsg('ai', "I'm offline right now, but you can still ask things like \"route from main gate to library\" or \"is Dr. Kumar available\" and I'll compute it directly from the campus database.");
    }
  }
}
const SUGGESTIONS = [
  'Route from main gate to library',
  'Is Dr. Suresh Babu available?',
  'Next bus to campus',
  'Nearest canteen to admin block',
  'Route from Principal to Entrances inside Admin Block',
  'Emergency contact numbers',
];
function renderSuggestions(){
  document.getElementById('suggestions').innerHTML = SUGGESTIONS.map(s=>`<div class="suggestion">${s}</div>`).join('');
  document.querySelectorAll('.suggestion').forEach(el=>el.addEventListener('click',()=>{
    document.getElementById('chatInput').value=el.textContent;
    sendChat();
  }));
}
function sendChat(){
  const input=document.getElementById('chatInput');
  const text=input.value.trim();
  if(!text) return;
  pushMsg('user', text);
  input.value='';
  askCampusAI(text);
  const adminMentioned = findAdminRoomMention(text);
  if(adminMentioned.length>=2 && /route|way|navigate|direction|go from|go to/i.test(text)){
    switchTab('3d');
    setTimeout(()=>{
      switch3DView('interior');
      setTimeout(()=>{
        document.getElementById('interiorSourceSelect').value=adminMentioned[0];
        document.getElementById('interiorDestSelect').value=adminMentioned[1];
        interiorThree && interiorThree.drawRoute(adminMentioned[0], adminMentioned[1]);
      },200);
    },60);
  }
}
