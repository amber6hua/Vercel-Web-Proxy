const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = async (req, res) => {
  try {
    const targetUrl = req.query.url; // 从查询参数中获取目标 URL

    if (!targetUrl) {
      return res.status(400).json({ error: 'Missing target URL' });
    }

    // 创建代理中间件
    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      followRedirects: true,
      headers: {
        'User-Agent': 'Vercel Proxy',
      },
      onProxyRes: (proxyRes) => {
        // 添加 CORS 头部
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
        proxyRes.headers['Access-Control-Allow-Headers'] = '*';
      },
    });

    // 处理请求
    proxy(req, res);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
