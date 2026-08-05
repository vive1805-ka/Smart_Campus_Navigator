/* ======================= GEO HELPERS ======================= */
function toLocalXY(lat,lng){
  const x = (lng-CENTER.lng)*111320*Math.cos(CENTER.lat*Math.PI/180);
  const y = (lat-CENTER.lat)*110540;
  return {x,y};
}
BUILDINGS.forEach(b=>{ const p=toLocalXY(b.lat,b.lng); b.x=p.x; b.y=p.y; });
function haversine(lat1,lng1,lat2,lng2){
  const R=6371000, toRad=d=>d*Math.PI/180;
  const dLat=toRad(lat2-lat1), dLng=toRad(lng2-lng1);
  const a=Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
function localDist(a,b){ return Math.hypot(a.x-b.x, a.y-b.y); }
function fmtDist(m){ return m<1000 ? Math.round(m)+' m' : (m/1000).toFixed(2)+' km'; }
function fmtWalk(m){ const s=m/1.3; const min=Math.max(1,Math.round(s/60)); return min+' min walk'; }
function byId(id){ return BUILDINGS.find(b=>b.id===id); }

/* Graph + Dijkstra */
const ADJ = {};
BUILDINGS.forEach(b=>ADJ[b.id]=[]);
EDGES.forEach(([a,b])=>{
  const w = localDist(byId(a),byId(b));
  ADJ[a].push({to:b,w}); ADJ[b].push({to:a,w});
});
function shortestPath(startId,endId){
  const dist={}, prev={}, visited={};
  BUILDINGS.forEach(b=>dist[b.id]=Infinity);
  dist[startId]=0;
  const pq=[[0,startId]];
  while(pq.length){
    pq.sort((a,b)=>a[0]-b[0]);
    const [d,u]=pq.shift();
    if(visited[u]) continue;
    visited[u]=true;
    if(u===endId) break;
    (ADJ[u]||[]).forEach(edge=>{
      const nd=d+edge.w;
      if(nd<dist[edge.to]){ dist[edge.to]=nd; prev[edge.to]=u; pq.push([nd,edge.to]); }
    });
  }
  if(dist[endId]===Infinity) return null;
  const path=[endId];
  let cur=endId;
  while(cur!==startId){ cur=prev[cur]; path.unshift(cur); }
  return {path, distance:dist[endId]};
}
