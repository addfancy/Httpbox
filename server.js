const express = require('express');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// 处理添加网站的请求
app.post('/add-website', (req, res) => {
  const { url, title, category } = req.body;

  // 读取 HTML 文件
  const htmlPath = path.join(__dirname, 'index.html');
  fs.readFile(htmlPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: '读取文件失败' });
    }

    // 使用 cheerio 加载 HTML
    const $ = cheerio.load(data);

    // 创建新的工具卡片 HTML
    const newCard = `
                <li class="tool-item">
                    <a href="${url}" class="tool-card">
                        <div class="tool-icon">
                            <img src="${url}/favicon.ico" alt="${title}">
                        </div>
                        <div class="tool-info">
                            <h3 class="tool-title">${title}</h3>
                            <span class="tool-category">${category}</span>
                        </div>
                    </a>
                </li>`;

    // 将新卡片添加到工具列表中
    $('.tool-list').append(newCard);

    // 将修改后的 HTML 写回文件
    fs.writeFile(htmlPath, $.html(), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: '写入文件失败' });
      }
      res.json({ success: true });
    });
  });
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});