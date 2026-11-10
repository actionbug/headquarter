export default async function handler(req, res) {
  // Gti dengan URL deployment Web App GAS Anda yang berakhiran /exec
  const targetBaseUrl = "https://script.google.com/macros/s/AKfycbxe7H7qHWMLJm4eKbhVTvIy2BEBhBXbTVvuux5CU8DdJ7Rs5yeNiLi9TQgsYKUic0y2-g/exec";

  try {
    const url = new URL(targetBaseUrl);
    
    // Teruskan semua parameter query (GET)
    for (const [key, value] of Object.entries(req.query)) {
      if (key !== 'proxy') {
        url.searchParams.append(key, value);
      }
    }

    const options = {
      method: req.method,
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
      },
      redirect: 'follow', // Penting: Ikuti redirect 302 dari Google Apps Script
    };

    // Jika ada payload data untuk POST/PUT
    if (req.method === 'POST' || req.method === 'PUT') {
      options.headers['Content-Type'] = req.headers['content-type'] || 'application/json';
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(url.toString(), options);
    
    // Ambil tipe konten asli dari GAS (bisa text/html, application/json, dll)
    const contentType = response.headers.get('content-type') || 'text/html';
    const buffer = await response.arrayBuffer();

    // Teruskan header dan tipe konten asli ke browser
    res.setHeader('Content-Type', contentType);
    return res.status(response.status).send(Buffer.from(buffer));
    
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'Gagal terhubung ke GAS', details: error.message });
  }
}
