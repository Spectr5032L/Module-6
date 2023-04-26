const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

let vertexes = [];
let size = 750;
document.getElementById("clear").onclick = clearFunc;


context.moveTo(0, 0); // рамка для холста
context.lineTo(size, 0);
context.moveTo(size, 0);
context.lineTo(size, size);
context.moveTo(0, 0);
context.lineTo(0, size);
context.moveTo(0, size);
context.lineTo(size, size);
context.stroke();

function clearFunc(){
    location.reload();
}