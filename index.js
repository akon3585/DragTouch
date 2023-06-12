/*
 *Author: CBB
 *Date: 2023-06-12 15:00:31
 *LastEditTime: 2023-06-12 15:01:59
 *LastEditors: CBB
 *Description:
 *FilePath: \DragTouch\index.js
 */
const DragTouch = {
  mounted(el) {
    let x = 0
    let y = 0
    let isDragging = false
    let prevX = 0
    let prevY = 0

    const screenWidth = window.screen.width
    const screenHeight = window.screen.height

    const setElStyle = () => {
      el.style.left = x + 'px'
      el.style.top = y + 'px'
    }

    //触摸
    el.ontouchstart = (event) => {
      isDragging = true
      const { left, top } = el.getBoundingClientRect()
      //初始值
      x = left
      y = top
      const touch = event.touches[0]
      prevX = touch.clientX - left
      prevY = touch.clientY - top
      el.dispatchEvent(new CustomEvent('isMove', { detail: true })) // 抛出事件
    }
    //移动
    el.ontouchmove = (event) => {
      if (!isDragging) return false
      // 阻止页面滚动
      bodyScroll(false)
      // 移除过渡效果
      el.style.transition = 'none'
      const { width, height } = el.getBoundingClientRect()

      const touch = event.touches[0]
      const offsetX = touch.clientX - prevX
      const offsetY = touch.clientY - prevY

      x = Math.max(0, Math.min(offsetX, screenWidth - width))
      y = Math.max(0, Math.min(offsetY, screenHeight - height))
      setElStyle()
    }
    //松开触摸
    el.ontouchend = (event) => {
      // 重新启用页面滚动
      bodyScroll(true)
      // 添加过渡效果
      el.style.transition = 'all 0.3s ease-out'

      isDragging = false
      const { left, width } = el.getBoundingClientRect()
      const bodyWidth = document.body.getBoundingClientRect().width

      if (left + width / 2 < bodyWidth / 2) {
        // 悬浮球离左边更近，吸附到左边
        x = 0
      } else {
        // 悬浮球离右边更近或正好在中间，吸附到右边
        x = bodyWidth - width
      }
      setElStyle()
      el.dispatchEvent(new CustomEvent('isMove', { detail: false })) // 抛出事件
    }
  },
  beforeUnmount(el) {
    el.ontouchstart = null
    el.ontouchend = null
    el.ontouchmove = null
  },
}
export default DragTouch
