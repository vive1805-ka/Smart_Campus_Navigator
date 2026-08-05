const CENTER = {lat:11.2722745, lng:77.6053375}; // verified real KEC coordinates (Perundurai, Erode)
const BUILDINGS = [
  {id:'main-gate', name:'Main Gate', category:'entrance', lat:11.2745691, lng:77.6068078, departments:[], floors:1, hours:'24 Hours', description:'Main entrance with security checkpoint and visitor registration (verified Google Maps location).'},
  {id:'admin-block', name:'Administrative Block', category:'admin', lat:11.2722745, lng:77.6053375, departments:['Principal Office','Registrar Office','Accounts','Admissions'], floors:3, hours:'9:00 AM - 5:00 PM (Mon-Sat)', description:"Central hub housing the Principal's office, registrar, accounts and admissions."},
  {id:'library', name:'Central Library', category:'academic', lat:11.2727745, lng:77.6060375, departments:['Central Library'], floors:2, hours:'8:00 AM - 8:00 PM (Mon-Sat)', description:'Extensive collection of books, journals, digital resources and reading halls.'},
  {id:'cse-block', name:'CSE Block', category:'academic', lat:11.2715745, lng:77.6063375, departments:['Computer Science and Engineering'], floors:4, hours:'8:30 AM - 4:30 PM (Mon-Sat)', description:'AI, networks and software development labs.'},
  {id:'it-block', name:'IT Block', category:'academic', lat:11.2712745, lng:77.6068375, departments:['Information Technology'], floors:3, hours:'8:30 AM - 4:30 PM (Mon-Sat)', description:'Modern computing and networking labs.'},
  {id:'ece-block', name:'ECE Block', category:'academic', lat:11.2732745, lng:77.6046375, departments:['Electronics and Communication Engineering'], floors:3, hours:'8:30 AM - 4:30 PM (Mon-Sat)', description:'VLSI and embedded systems labs.'},
  {id:'eee-block', name:'EEE Block', category:'academic', lat:11.2737745, lng:77.6051375, departments:['Electrical and Electronics Engineering'], floors:3, hours:'8:30 AM - 4:30 PM (Mon-Sat)', description:'Power systems and control labs.'},
  {id:'mech-block', name:'Mechanical Block', category:'academic', lat:11.2702745, lng:77.6048375, departments:['Mechanical Engineering'], floors:2, hours:'8:30 AM - 4:30 PM (Mon-Sat)', description:'Manufacturing, thermal and CAD/CAM labs.'},
  {id:'civil-block', name:'Civil Block', category:'academic', lat:11.2697745, lng:77.6056375, departments:['Civil Engineering'], floors:2, hours:'8:30 AM - 4:30 PM (Mon-Sat)', description:'Structural and surveying laboratories.'},
  {id:'mba-block', name:'MBA Block', category:'academic', lat:11.2719745, lng:77.6073375, departments:['Management Studies'], floors:2, hours:'9:00 AM - 4:00 PM (Mon-Sat)', description:'MBA programs with dedicated seminar halls.'},
  {id:'auditorium', name:'Auditorium', category:'facility', lat:11.2725745, lng:77.6038375, departments:[], floors:1, hours:'Event based', description:'Conferences, symposiums and cultural events.'},
  {id:'oat', name:'Open Air Theatre', category:'facility', lat:11.2692745, lng:77.6063375, departments:[], floors:1, hours:'Event based', description:'Cultural fests, gatherings and outdoor events.'},
  {id:'canteen', name:'Canteen', category:'facility', lat:11.2717745, lng:77.6043375, departments:[], floors:1, hours:'7:30 AM - 7:00 PM', description:'Breakfast, lunch, snacks and beverages.'},
  {id:'bus-stop', name:'Bus Stop', category:'transport', lat:11.2705745, lng:77.6028375, departments:[], floors:1, hours:'24 Hours', description:'Campus bus stop serving college transport routes.'},
  {id:'parking', name:'Parking', category:'transport', lat:11.2709745, lng:77.6038375, departments:[], floors:1, hours:'24 Hours', description:'Two-wheeler and four-wheeler parking.'},
  {id:'hostels', name:'Hostels', category:'residential', lat:11.2682745, lng:77.6068375, departments:["Men's Hostel","Women's Hostel"], floors:4, hours:'24 Hours', description:'Residential hostels with mess and recreation facilities.'},
  {id:'medical-center', name:'Medical Center', category:'facility', lat:11.2729745, lng:77.6033375, departments:['Health Center'], floors:1, hours:'24 Hours (Emergency), 9 AM - 5 PM (OPD)', description:'First-aid, basic treatment and emergency response.'},
  {id:'playground', name:'Play Ground', category:'facility', lat:11.2687745, lng:77.6043375, departments:[], floors:1, hours:'6:00 AM - 8:00 PM', description:'Athletics, football, cricket and other sports.'},
];
const EDGES = [
  ['main-gate','bus-stop'],['main-gate','parking'],['main-gate','medical-center'],['main-gate','admin-block'],
  ['admin-block','canteen'],['admin-block','library'],['admin-block','auditorium'],['admin-block','ece-block'],
  ['library','cse-block'],['library','it-block'],['library','mba-block'],
  ['cse-block','it-block'],['cse-block','eee-block'],['ece-block','eee-block'],
  ['eee-block','mech-block'],['mech-block','civil-block'],['civil-block','oat'],['civil-block','playground'],
  ['oat','hostels'],['playground','hostels'],['mba-block','it-block'],['canteen','parking'],['canteen','civil-block'],['bus-stop','parking']
];
const CATEGORY_META = {
  entrance:{label:'Entrance', color:'#8b9ab3'},
  admin:{label:'Administration', color:'#2f6fed'},
  academic:{label:'Academic Block', color:'#18d1c4'},
  facility:{label:'Facility', color:'#f5a623'},
  transport:{label:'Transport', color:'#a26cf7'},
  residential:{label:'Residential', color:'#ef5da8'},
};
const FACULTY = [
  {name:'Dr. Kumar', department:'Computer Science and Engineering', block_id:'cse-block', cabin:'C-204', floor:'2nd Floor', status:'available', eta:null},
  {name:'Dr. Priya Ramesh', department:'Information Technology', block_id:'it-block', cabin:'IT-105', floor:'1st Floor', status:'in_class', eta:'Available after 2:00 PM'},
  {name:'Dr. Suresh Babu', department:'Electronics and Communication Engineering', block_id:'ece-block', cabin:'E-301', floor:'3rd Floor', status:'meeting', eta:'Available after 3:30 PM'},
  {name:'Dr. Lakshmi Narayanan', department:'Electrical and Electronics Engineering', block_id:'eee-block', cabin:'EE-210', floor:'2nd Floor', status:'not_in_campus', eta:'Available tomorrow 9:00 AM'},
  {name:'Dr. Anitha Selvam', department:'Mechanical Engineering', block_id:'mech-block', cabin:'M-110', floor:'1st Floor', status:'available', eta:null},
  {name:'Dr. Vignesh Raja', department:'Civil Engineering', block_id:'civil-block', cabin:'CV-102', floor:'1st Floor', status:'in_class', eta:'Available after 1:00 PM'},
  {name:'Dr. Meena Kandasamy', department:'Management Studies', block_id:'mba-block', cabin:'MBA-201', floor:'2nd Floor', status:'available', eta:null},
  {name:'Dr. Arun Prakash', department:'Computer Science and Engineering', block_id:'cse-block', cabin:'C-310', floor:'3rd Floor', status:'meeting', eta:'Available after 4:00 PM'},
];
const STATUS_META = {
  available:{label:'Available', color:'#2ecc71'},
  in_class:{label:'In Class', color:'#f5a623'},
  meeting:{label:'In Meeting', color:'#a26cf7'},
  not_in_campus:{label:'Not in Campus', color:'#8b9ab3'},
};
const EMERGENCY_CONTACTS = [
  {label:'Medical Center', number:'0424-2260303', location_id:'medical-center'},
  {label:'Security Office', number:'0424-2260123', location_id:'main-gate'},
  {label:'Campus Emergency Helpline', number:'1800-123-4567', location_id:null},
  {label:'Fire & Rescue', number:'101', location_id:null},
  {label:'Ambulance (National)', number:'108', location_id:null},
  {label:'Police (National)', number:'100', location_id:null},
];
const BUS_ROUTES = [
  {id:'r1', name:'Route A · Erode Bus Stand', stops:['Erode Bus Stand','Perundurai Town','Punjai Puliampatti Road','Campus Main Gate'], toCampus:['07:00','07:30','08:00','08:30','09:00'], fromCampus:['16:00','16:30','17:00','17:30','18:00']},
  {id:'r2', name:'Route B · Bhavani', stops:['Bhavani','Kumarapalayam','Chithode','Campus Main Gate'], toCampus:['07:10','07:45','08:15','08:45'], fromCampus:['16:10','16:45','17:15','17:45']},
  {id:'r3', name:'Route C · Sathyamangalam', stops:['Sathyamangalam','Bhavanisagar','Perundurai','Campus Main Gate'], toCampus:['06:50','07:35','08:20'], fromCampus:['15:50','16:35','17:20']},
  {id:'r4', name:'Route D · Gobichettipalayam', stops:['Gobichettipalayam','Vellakoil Road','Perundurai','Campus Main Gate'], toCampus:['07:05','07:50','08:35'], fromCampus:['16:05','16:50','17:35']},
];

/* Admin Block interior — digitized from the uploaded AdminInteriorNavigator floor-plan
   layout. Coordinates are plan pixels (x,y = top-left corner, w/h = size; y grows
   downward). `door` marks which wall side the room's doorway opens onto, and is used
   both to leave a gap in that wall and to place the room's corridor "door node". */
const ADMIN_SCALE = 0.03; // plan px -> interior meters
const ADMIN_WALL_HEIGHT = 3;
const ADMIN_WALL_THICK = 0.15;
const ADMIN_DOOR_W = 1.1;

const ADMIN_ROOMS = [
  {id:'cc13',         name:'CC13',         desc:'Classroom / committee room 13.',              x:130, y:15,  w:150, h:160, color:'#8ecae6', door:'south'},
  {id:'cc12',         name:'CC12',         desc:'Classroom / committee room 12.',              x:295, y:20,  w:165, h:140, color:'#8ecae6', door:'south'},
  {id:'cc11',         name:'CC11',         desc:'Classroom / committee room 11.',              x:460, y:20,  w:190, h:140, color:'#8ecae6', door:'south'},
  {id:'cc10',         name:'CC10',         desc:'Classroom / committee room 10.',              x:720, y:15,  w:140, h:150, color:'#8ecae6', door:'south'},
  {id:'cc09',         name:'CC09',         desc:'Classroom / committee room 09.',              x:720, y:165, w:140, h:165, color:'#8ecae6', door:'west'},
  {id:'women-toilet', name:'Women Toilet', desc:'Restroom facility.',                          x:130, y:195, w:150, h:75,  color:'#ffb4a2', door:'east'},
  {id:'reception',    name:'Reception',    desc:'Front reception desk.',                       x:130, y:360, w:155, h:125, color:'#95d5b2', door:'east'},
  {id:'atm',          name:'ATM',          desc:'Campus ATM kiosk.',                           x:685, y:410, w:65,  h:70,  color:'#ffd166', door:'north'},
];
const ADMIN_STAIRS = [
  {id:'stairs-west', name:'Stairs (West)', desc:'Staircase access to upper floors, west wing.', x:130, y:285, w:160, h:60,  door:'east'},
  {id:'stairs-east', name:'Stairs (East)', desc:'Staircase access to upper floors, east wing.', x:765, y:365, w:95,  h:120, door:'west'},
];
const ADMIN_ENTRANCE_ROOM = {id:'entrance', name:'Entrance', desc:'Main building entrance.', x:280, y:485, w:450, h:80, door:'south'};

function adminInteriorAllRooms(){ return ADMIN_ROOMS.concat(ADMIN_STAIRS, [ADMIN_ENTRANCE_ROOM]); }

// door-side node just outside a room's doorway, in local (unscaled-to-scene) meters
function adminDoorNode(room){
  const rx=room.x*ADMIN_SCALE, rz=room.y*ADMIN_SCALE, rw=room.w*ADMIN_SCALE, rh=room.h*ADMIN_SCALE;
  if(room.door==='north') return {x:rx+rw/2, z:rz-0.7};
  if(room.door==='south') return {x:rx+rw/2, z:rz+rh+0.7};
  if(room.door==='east')  return {x:rx+rw+0.7, z:rz+rh/2};
  return {x:rx-0.7, z:rz+rh/2}; // west
}
function adminRoomCenter(room){
  const rx=room.x*ADMIN_SCALE, rz=room.y*ADMIN_SCALE, rw=room.w*ADMIN_SCALE, rh=room.h*ADMIN_SCALE;
  return {x:rx+rw/2, z:rz+rh/2};
}
// single open-corridor hub that every room's route passes through — mirrors the
// AdminInteriorNavigator layout where all rooms front onto one shared corridor
function adminCorridorHub(){
  let minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity;
  adminInteriorAllRooms().forEach(r=>{
    const rx=r.x*ADMIN_SCALE, rz=r.y*ADMIN_SCALE, rw=r.w*ADMIN_SCALE, rh=r.h*ADMIN_SCALE;
    minX=Math.min(minX,rx); maxX=Math.max(maxX,rx+rw);
    minZ=Math.min(minZ,rz); maxZ=Math.max(maxZ,rz+rh);
  });
  const ez=ADMIN_ENTRANCE_ROOM.y*ADMIN_SCALE;
  return {x:(minX+maxX)/2, z:(minZ+ez)/2, minX,maxX,minZ,maxZ};
}
// route (as a list of {x,z} waypoints, in scene meters) + total walking distance
// between any two rooms/stairs/the entrance, via: center -> door -> hub -> door -> center
function adminInteriorPath(sourceId, destId){
  const all=adminInteriorAllRooms();
  const src=all.find(r=>r.id===sourceId), dst=all.find(r=>r.id===destId);
  if(!src || !dst) return null;
  const hub=adminCorridorHub();
  const pts=[adminRoomCenter(src), adminDoorNode(src), {x:hub.x,z:hub.z}, adminDoorNode(dst), adminRoomCenter(dst)];
  let dist=0;
  for(let i=0;i<pts.length-1;i++) dist+=Math.hypot(pts[i].x-pts[i+1].x, pts[i].z-pts[i+1].z);
  return {src, dst, pts, distMeters:dist};
}
