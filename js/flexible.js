// 定义一个立即执行函数，参数为window和document
// 自执行的匿名函数，用于创建一个独立的作用域，避免污染全局命名空间
// 参数 window 和 document 分别代表浏览器的全局对象和文档对象
(function flexible (window, document) {
  // 获取html元素
  let docEl = document.documentElement
  // 获取设备像素比
  let dpr = window.devicePixelRatio || 1

  // 调整body字体大小的函数
  // 此函数根据设备像素比调整body的字体大小，以确保在不同设备上的视觉一致性
  function setBodyFontSize () {
    if (document.body) {
      document.body.style.fontSize = (12 * dpr) + 'px'
    }
    else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  // 执行设置body字体大小的函数
  setBodyFontSize();

  // 设置rem单位的函数
  // 此函数将1rem设置为视口宽度的1/10，以实现响应式布局
  function setRemUnit () {
    let rem = docEl.clientWidth / 10
    docEl.style.fontSize = rem + 'px'
  }

  // 执行设置rem单位的函数
  setRemUnit()

  // 在页面调整大小和恢复显示时重置rem单位
  // 这样可以确保在窗口大小改变或页面从缓存中恢复显示时，布局仍然保持响应式
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // 检测是否支持0.5px的边框
  // 此检测旨在确定设备是否能够正确渲染小于1px的边框，这对于高像素比设备上的视觉效果尤为重要
  if (dpr >= 2) {
    let fakeBody = document.createElement('body')
    let testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}(window, document))
