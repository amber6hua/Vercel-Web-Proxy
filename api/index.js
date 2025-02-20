module.exports = async (req, res) => {
  if (req.url === '/') {
    return res.send(getRootHtml());
  }

  // 代理逻辑
  try {
    const targetUrl = req.query.url;

    if (!targetUrl) {
      return res.status(400).json({ error: 'Missing target URL' });
    }

    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      followRedirects: true,
      headers: {
        'User-Agent': 'Vercel Proxy',
      },
      onProxyRes: (proxyRes) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
        proxyRes.headers['Access-Control-Allow-Headers'] = '*';
      },
    });

    proxy(req, res);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

function getRootHtml() {
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <title>Vercel Proxy</title>
    </head>
    <body>
      <h1>Vercel Proxy</h1>
      <form action="/" method="GET">
        <input type="text" name="url" placeholder="输入目标 URL" required>
        <button type="submit">代理</button>
      </form>
    </body>
    </html>
  `;
}
