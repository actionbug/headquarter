export default async function handler(req, res) {
  const targetBaseUrl = "https://script.google.com/macros/s/AKfycbxe7H7qHWMLJm4eKbhVTvIy2BEBhBXbTVvuux5CU8DdJ7Rs5yeNiLi9TQgsYKUic0y2-g/exec";

  try {
    const url = new URL(targetBaseUrl);
    
    // Teruskan parameter query string
    for (const [key, value] of Object.entries(req.query)) {
      if (key !== 'proxy') {
        url.searchParams.append(key, value);
      }
    }

    const options = {
      method: req.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      redirect: 'follow',
    };

    if (req.method === 'POST' || req.method === 'PUT') {
      options.headers['Content-Type'] = req.headers['content-type'] || 'application/json';
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(url.toString(), options);
    let htmlContent = await response.text();

    // Paksa browser membaca sebagai dokumen HTML utuh agar tidak ter-render dalam kotak kecil/iframe
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    return res.status(response.status).send(htmlContent);

  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'Gagal merender dashboard GAS', details: error.message });
  }
}
