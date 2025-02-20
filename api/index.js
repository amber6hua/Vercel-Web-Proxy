const axios = require("axios");

module.exports = async (req, res) => {
  try {
    const { url } = req.query; // 从查询参数获取目标 URL

    if (!url) {
      return res.status(400).json({ error: "Missing target URL" });
    }

    // 处理 URL，确保包含 http/https
    const targetUrl = /^https?:\/\//.test(url) ? url : `https://${url}`;

    // 代理请求
    const response = await axios.get(targetUrl, {
      headers: {
        "User-Agent": "Vercel-Proxy",
      },
    });

    // 返回目标站点的内容
    res.status(200).send(response.data);
  } catch (error) {
    console.error("请求出错:", error);
    res.status(500).json({ error: "请求失败", details: error.message });
  }
};
