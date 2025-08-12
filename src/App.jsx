import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Tracker from './pages/Tracker';
import StravaCallback from './pages/StravaCallback';
import Community from './pages/Community';

export default function App(){
  const host = import.meta.env.VITE_API_BASE || window.location.origin;
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${import.meta.env.VITE_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(host + '/strava-callback')}&approval_prompt=auto&scope=activity:write,activity:read_all`;
  return (
    <div>
      <header>
        <Link to="/">Home</Link>
        <Link to="/tracker">Tracker</Link>
        <Link to="/community">Comunidade</Link>
        <a href={authUrl}>Conectar Strava</a>
      </header>
      <main style={{padding:12}}>
        <Routes>
          <Route path="/" element={<div><h2>RunTeam</h2><p>Instale no Android: Menu → Adicionar à tela inicial</p></div>} />
          <Route path="/tracker" element={<Tracker/>} />
          <Route path="/strava-callback" element={<StravaCallback/>} />
          <Route path="/community" element={<Community/>} />
        </Routes>
      </main>
    </div>
  );
}
