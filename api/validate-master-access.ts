export default async function handler(req: any, res: any) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, honeypot } = req.body;

  // Basic honeypot check
  if (honeypot) {
    return res.status(403).json({ success: false, error: 'Acesso negado.' });
  }

  const masterPassword = process.env.MASTER_PASSWORD || 'Bruno.eng2026';

  if (password === masterPassword) {
    return res.json({ 
      success: true, 
      token: 'access_granted_be' 
    });
  }

  return res.status(401).json({ success: false, error: 'Chave de acesso inválida.' });
}
