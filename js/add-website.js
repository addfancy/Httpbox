document.addEventListener('DOMContentLoaded', function () {
  const addWebsiteBtn = document.querySelector('.add_website');
  const toolList = document.querySelector('.tool-list');

  // 处理所有现有图标
  function processExistingIcons() {
    const allIcons = document.querySelectorAll('.tool-icon img');
    allIcons.forEach(img => {
      img.style.width = '64px';
      img.style.height = '64px';
      img.style.objectFit = 'contain';

      // 添加错误处理，如果图标加载失败则使用默认图标
      img.onerror = function () {
        this.src = 'images/default-icon.png';
      };
    });
  }

  // 创建弹窗HTML
  function createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
                <div class="modal-content">
                    <h2>添加网站</h2>
                    <form id="addWebsiteForm">
                        <div class="form-group">
                            <label for="websiteUrl">网站地址：</label>
                            <input type="url" id="websiteUrl" required placeholder="请输入网站地址（例如：https://www.example.com）">
                        </div>
                        <div class="form-group">
                            <label for="websiteTitle">网站名称：</label>
                            <input type="text" id="websiteTitle" required placeholder="请输入网站名称">
                        </div>
                        <div class="form-group">
                            <label for="websiteCategory">网站分类：</label>
                            <select id="websiteCategory" required>
                                <option value="">请选择分类</option>
                                <option value="常用网站">常用网站</option>
                                <option value="在线工具">在线工具</option>
                                <option value="文档">文档</option>
                                <option value="开发工具">开发工具</option>
                                <option value="AI网站">AI网站</option>
                                <option value="其他">其他</option>
                            </select>
                        </div>
                        <div class="modal-buttons">
                            <button type="submit" class="submit-btn">添加</button>
                            <button type="button" class="cancel-btn">取消</button>
                        </div>
                    </form>
                </div>
            `;
    document.body.appendChild(modal);
    return modal;
  }

  // 创建新的工具卡片
  // 创建新的工具卡片
  function createToolCard(url, title, category) {
    const li = document.createElement('li');
    li.className = 'tool-item';

    // 解析URL获取主域名
    let faviconUrl = '';
    try {
      const urlObj = new URL(url);

      // 首先尝试直接从网站根目录获取favicon
      faviconUrl = `${urlObj.origin}/favicon.ico`;

      // 创建一个图片元素来预加载favicon
      const img = document.createElement('img');
      img.style.display = 'none';

      li.innerHTML = `
        <a href="${url}" class="tool-card" target="_blank">
          <div class="tool-icon">
            <img src="${faviconUrl}" alt="${title}" onerror="
              // 如果直接获取失败，尝试使用DuckDuckGo的服务
              this.onerror = null;
              this.src = 'https://icons.duckduckgo.com/ip3/${urlObj.hostname}.ico';
              
              // 如果DuckDuckGo也失败，尝试使用Yandex的服务
              this.onerror = function() {
                this.onerror = null;
                this.src = 'https://favicon.yandex.net/favicon/${urlObj.hostname}';
                
                // 如果所有方法都失败，使用默认图标
                this.onerror = function() {
                  this.src = 'images/default-icon.png';
                };
              };
            ">
          </div>
          <div class="tool-info">
            <h3 class="tool-title">${title}</h3>
            <span class="tool-category">${category}</span>
          </div>
        </a>
      `;
    } catch (e) {
      // 如果URL解析失败，使用默认方式
      li.innerHTML = `
        <a href="${url}" class="tool-card" target="_blank">
          <div class="tool-icon">
            <img src="images/default-icon.png" alt="${title}">
          </div>
          <div class="tool-info">
            <h3 class="tool-title">${title}</h3>
            <span class="tool-category">${category}</span>
          </div>
        </a>
      `;
    }

    return li;
  }

  // 处理添加网站按钮点击事件
  addWebsiteBtn.addEventListener('click', function () {
    const modal = createModal();
    const form = modal.querySelector('#addWebsiteForm');
    const cancelBtn = modal.querySelector('.cancel-btn');

    // 处理表单提交
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const url = document.getElementById('websiteUrl').value;
      const title = document.getElementById('websiteTitle').value;
      const category = document.getElementById('websiteCategory').value;

      try {
        const response = await fetch('/add-website', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url, title, category })
        });

        if (!response.ok) {
          throw new Error('添加失败');
        }

        // 刷新页面以显示新添加的网站
        window.location.reload();
      } catch (error) {
        alert('添加网站失败：' + error.message);
      }

      modal.remove();
    });

    // 处理取消按钮
    cancelBtn.addEventListener('click', function () {
      modal.remove();
    });

    // 点击模态框外部关闭
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
  });

  // 页面加载时处理现有图标
  processExistingIcons();
});