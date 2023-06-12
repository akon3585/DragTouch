/*
 *Author: CBB
 *Date: 2023-06-12 15:00:31
 *LastEditTime: 2023-06-12 15:38:34
 *LastEditors: CBB
 *Description:
 *FilePath: \DragTouch\index.js
 */
const DragTouch = {
  mounted(el) {
    let x = 0;
    let y = 0;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const { width: screenWidth, height: screenHeight } =
      document.body.getBoundingClientRect();

    const setElStyle = () => {
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    };

    const onTouchStart = (event) => {
      if (isDragging) return;
      isDragging = true;
      const { left, top } = el.getBoundingClientRect();
      x = left;
      y = top;
      const touch = event.touches[0];
      prevX = touch.clientX - left;
      prevY = touch.clientY - top;
      el.dispatchEvent(new CustomEvent('isMove', { detail: true }));
    };

    const onTouchMove = (event) => {
      if (!isDragging) return;
      event.preventDefault();
      el.style.transition = 'none';
      const { width, height } = el.getBoundingClientRect();

      const touch = event.touches[0];
      const offsetX = touch.clientX - prevX;
      const offsetY = touch.clientY - prevY;

      x = Math.max(0, Math.min(offsetX, screenWidth - width));
      y = Math.max(0, Math.min(offsetY, screenHeight - height));
      setElStyle();
    };

    const onTouchEnd = (event) => {
      if (!isDragging) return;
      isDragging = false;
      el.style.transition = 'all 0.3s ease-out';
      const { left, width } = el.getBoundingClientRect();
      const bodyWidth = document.body.getBoundingClientRect().width;
      const targetX = left + width / 2 < bodyWidth / 2 ? 0 : bodyWidth - width;
      x = targetX;
      setElStyle();
      el.dispatchEvent(new CustomEvent('isMove', { detail: false }));
    };

    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchmove', onTouchMove, {
      passive: false,
    });
    el.addEventListener('touchend', onTouchEnd);

    el._onTouchStart = onTouchStart;
    el._onTouchMove = onTouchMove;
    el._onTouchEnd = onTouchEnd;
  },

  beforeUnmount(el) {
    el.removeEventListener('touchstart', el._onTouchStart);
    el.removeEventListener('touchmove', el._onTouchMove);
    el.removeEventListener('touchend', el._onTouchEnd);
  },
}
export default DragTouch
