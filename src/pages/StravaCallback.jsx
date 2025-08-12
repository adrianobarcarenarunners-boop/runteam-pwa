import React, {useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function StravaCallback(){
  const nav = useNavigate();
  useEffect(()=>{
    const p = new URLSearchParams(window.location.search);
    const code = p.get('code');
    if (!code) { nav('/'); return; }
    (async ()=>{
      try{
        const res = await axios.post('/api/strava/exchange', { code });
        localStorage.setItem('strava', JSON.stringify(res.data));
        alert('Strava conectado');
        nav('/');
      }catch(e){ console.error(e); alert('Erro ao conectar Strava'); nav('/'); }
    })();
  },[]);
  return <div>Conectando Strava...</div>;
}
