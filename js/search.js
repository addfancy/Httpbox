document.addEventListener('DOMContentLoaded', function () {
  // 获取搜索框和工具列表元素
  const searchBox = document.querySelector('.search-box');
  const toolList = document.querySelector('.tool-list');
  const toolItems = document.querySelectorAll('.tool-item');
  const filterButtons = document.querySelectorAll('.filter-button');
  const mainButton = document.querySelector('.filter-button.main');

  // 搜索功能实现
  function searchTools(keyword) {
    keyword = keyword.toLowerCase().trim();

    toolItems.forEach(item => {
      const title = item.querySelector('.tool-title').textContent.toLowerCase();
      const category = item.querySelector('.tool-category').textContent.toLowerCase();

      // 如果标题或类别包含搜索关键词，显示该项
      if (title.includes(keyword) || category.includes(keyword)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // 分类筛选功能
  function filterTools(category, isMainCategory) {
    // 如果是主分类（全部工具），显示所有项目
    if (isMainCategory) {
      toolItems.forEach(item => {
        item.style.display = '';
      });
      return;
    }

    // 对于其他分类，只显示匹配的项目，但保持布局
    toolItems.forEach(item => {
      const itemCategory = item.querySelector('.tool-category').textContent;
      if (itemCategory === category) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // 监听分类按钮点击事件
  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      // 移除其他按钮的激活状态
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // 添加当前按钮的激活状态
      this.classList.add('active');

      // 判断是否是主分类（全部工具）
      const isMainCategory = this.classList.contains('main');

      // 执行分类筛选
      filterTools(this.textContent, isMainCategory);

      // 清空搜索框
      searchBox.value = '';
    });
  });

  // 监听搜索框输入事件
  searchBox.addEventListener('input', function (e) {
    searchTools(e.target.value);

    // 当用户开始搜索时，移除所有分类按钮的激活状态，只保留"全部工具"的激活状态
    filterButtons.forEach(btn => {
      if (btn.classList.contains('main')) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  });

  // 监听搜索框获得焦点事件
  searchBox.addEventListener('focus', function () {
    this.classList.add('focused');
  });

  // 监听搜索框失去焦点事件
  searchBox.addEventListener('blur', function () {
    this.classList.remove('focused');
  });

  // 监听按键事件，实现"按任意键直接开始搜索"的功能
  document.addEventListener('keydown', function (e) {
    if (document.activeElement !== searchBox &&
      !e.ctrlKey && !e.altKey && !e.metaKey &&
      e.key.length === 1) {
      searchBox.focus();
    }
  });
});