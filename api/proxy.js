export default async function handler(req, res) {
  const targetUrl = "https://script.google.com/macros/s/AKfycbxe7H7qHWMLJm4eKbhVTvIy2BEBhBXbTVvuux5CU8DdJ7Rs5yeNiLi9TQgsYKUic0y2-g/exec";

  try {
    // Ambil query string jika ada
    const url = new URL(targetUrl);
    for (const [key, value] of Object.entries(req.query)) {
      if (key !== 'proxy') {
        url.searchParams.append(key, value);
      }
    }

    const options = {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
      },
    };

    if (req.method === 'POST' || req.method === 'PUT') {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url.toString(), options);
    const data = await response.text();

    // Teruskan status dan header kembali ke klien secara bersih
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    return res.status(response.status).send(data);
  } catch (error) {
    return res.status(500).json({ error: 'Gagal terhubung ke Google Apps Script', details: error.message });
  }
}
