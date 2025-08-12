import React, {useEffect, useRef} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({positions}) {
  const mapRef = useRef();
  const polyRef = useRef();
  useEffect(()=>{
    if (!mapRef.current) {
      mapRef.current = L.map('map', {center: [0,0], zoom: 2});
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
    }
    if (positions.length) {
      const latlngs = positions.map(p => [p.lat, p.lng]);
      if (!polyRef.current) polyRef.current = L.polyline(latlngs).addTo(mapRef.current);
      else polyRef.current.setLatLngs(latlngs);
      try { mapRef.current.fitBounds(polyRef.current.getBounds(), {maxZoom:16}); } catch(e){}
    }
  }, [positions]);
  return <div id="map" style={{height:'100%'}} />;
}
