const state = {
  tab:'overview',
  mapCategory:'all',
  userLoc:null, // {lat,lng}
  nearbyRef:null, // building id fallback
  facDeptFilter:'all',
  facAvailOnly:false,
  activePopup:null,
};

const NAV = [
  {id:'overview', label:'Overview', icon:'M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6V11h-6v9zm0-16v5h6V4h-6z'},
  {id:'map', label:'Campus Map', icon:'M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7'},
  {id:'3d', label:'3D Admin Block', icon:'M12 2l9 4.9V17L12 22l-9-5.1V6.9L12 2zm0 2.3L5 8v8l7 3.9 7-3.9V8l-7-3.7zM12 11l6.5-3.6M12 11L5.5 7.4M12 11v8.9'},
  {id:'faculty', label:'Faculty Finder', icon:'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5z'},
  {id:'bus', label:'Bus Routes', icon:'M4 16c0 .9.4 1.7 1 2.2V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.8c.6-.5 1-1.3 1-2.2V6c0-3.5-3.6-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM6 11V6h12v5H6z'},
  {id:'nearby', label:'Nearby Places', icon:'M12 22s7-7.2 7-12.5A7 7 0 0 0 5 9.5C5 14.8 12 22 12 22zm0-9.8a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4z'},
  {id:'emergency', label:'Emergency', icon:'M13 2L3 14h7l-1 8 11-13h-8l1-7z'},
  {id:'ai', label:'Ask Campus AI', icon:'M12 2a2 2 0 0 1 2 2v1.06A7 7 0 0 1 19 12v1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-.18A3 3 0 0 1 16 22H8a3 3 0 0 1-2.82-3H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2v-1a7 7 0 0 1 5-6.94V4a2 2 0 0 1 2-2zm-3 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z'},
];

const PAGE_META = {
  overview:['Overview','Live snapshot of the campus — buildings, people and transport in one view.'],
  map:['Campus Map','Search any block, pick a start and destination, and get the shortest walking route.'],
  '3d':['3D Admin Block','Rotate, zoom and click through an interactive model of the campus core.'],
  faculty:['Faculty Finder','Find a professor, see their cabin, and check if they are free right now.'],
  bus:['Bus Routes','Live-ish departure boards for every campus transport route.'],
  nearby:['Nearby Places','What is closest to you right now, ranked by walking distance.'],
  emergency:['Emergency','One tap to alert, call, or share your live location.'],
  ai:['Ask Campus AI','A campus-aware assistant that can compute real routes for you.'],
};
