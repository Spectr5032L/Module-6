const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

canvas.addEventListener('click', (event) => {
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  context.beginPath();
  context.arc(x, y, 5, 0, 2 * Math.PI);
  context.fill();
});
