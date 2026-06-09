export default async function handler(req, res) {
  // Kasih izin CORS biar bisa dipanggil dari Pi Browser
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'paymentId required' });
    }

    const PI_API_KEY = process.env.PI_API_KEY;
    const headers = {
      'Authorization': `Key ${PI_API_KEY}`,
      'Content-Type': 'application/json'
    };

    // 1. APPROVE PEMBAYARAN - WAJIB
    await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: headers
    });

    // 2. COMPLETE PEMBAYARAN - WAJIB JUGA
    await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ txid: 'dummy_txid' })
    });

    res.status(200).json({ success: true, message: 'Payment completed' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}