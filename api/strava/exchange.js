export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { code } = req.body || {};
  if (!code) return res.status(400).json({ error: 'missing code' });
  try {
    const r = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code'
      })
    });
    const data = await r.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'exchange failed' });
  }
}
