import React, {useState, useRef, useEffect} from 'react';
import Map from '../components/Map';

function haversine(a,b){
  const R=6371e3, toRad=d=>d*Math.PI/180;
  const φ1=toRad(a.lat), φ2=toRad(b.lat), Δφ=toRad(b.lat-a.lat), Δλ=toRad(b.lng-a.lng);
  const sa=Math.sin(Δφ/2), sb=Math.sin(Δλ/2);
  const c=2*Math.atan2(Math.sqrt(sa*sa + Math.cos(φ1)*Math.cos(φ2)*sb*sb), Math.sqrt(1 - (sa*sa + Math.cos(φ1)*Math.cos(φ2)*sb*sb)));
  return R*c;
}

export default function Tracker(){
  const [tracking,setTracking] = useState(false);
  const [positions,setPositions] = useState([]);
  const watchRef = useRef(null);
  const startRef = useRef(null);

  useEffect(()=>()=>{ if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current); },[]);

  function start(){
    if (!navigator.geolocation) return alert('GPS não suportado');
    startRef.current = Date.now();
    watchRef.current = navigator.geolocation.watchPosition(p=>{
      setPositions(prev => [...prev, {lat: p.coords.latitude, lng: p.coords.longitude, ts: p.timestamp}]);
    }, err=>console.error(err), {enableHighAccuracy:true, maximumAge:1000});
    setTracking(true);
  }

  function stop(){
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = null;
    setTracking(false);
  }

  function distanceMeters(){
    let d=0;
    for(let i=1;i<positions.length;i++) d += haversine(positions[i-1], positions[i]);
    return d;
  }

  function exportGPX(){
    if (!positions.length) return alert('Sem pontos');
    const header = '<?xml version="1.0"?>\n<gpx version="1.1" creator="RunTeam">\n<trk><name>Run</name><trkseg>\n';
    const pts = positions.map(p=>`<trkpt lat="${p.lat}" lon="${p.lng}"><time>${new Date(p.ts).toISOString()}</time></trkpt>`).join('\n');
    const footer = '\n</trkseg></trk>\n</gpx>';
    const blob = new Blob([header + pts + footer], {type:'application/gpx+xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'run.gpx'; a.click(); a.remove();
  }

  const meters = distanceMeters();
  const km = (meters/1000).toFixed(2);
  const elapsed = startRef.current ? Math.round((Date.now() - startRef.current)/1000) : 0;
  const paceSec = meters>0 ? Math.round(elapsed / (meters/1000)) : 0;
  const pace = paceSec ? `${Math.floor(paceSec/60)}:${String(paceSec%60).padStart(2,'0')}/km` : '--';

  return (
    <div>
      <h3>Tracker</h3>
      <div style={{display:'flex',gap:8}}>
        {!tracking ? <button onClick={start}>Iniciar</button> : <button onClick={stop}>Parar</button>}
        <button onClick={exportGPX}>Exportar GPX</button>
      </div>
      <div style={{marginTop:8}}>
        <div>Distância: {km} km</div>
        <div>Tempo: {elapsed}s</div>
        <div>Pace: {pace}</div>
      </div>
      <div style={{height:400, marginTop:10}}><Map positions={positions} /></div>
    </div>
  );
}
