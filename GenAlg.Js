const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

var vertexes = [];
var size = 750;

canvas.addEventListener('click', mouseClick); // Функции для кнопок
document.getElementById("clear").onclick = clear;
document.getElementById("start").onclick = geneticAlg;


context.moveTo(0, 0); // рамка для холста
context.lineTo(size, 0);
context.moveTo(size, 0);
context.lineTo(size, size);
context.moveTo(0, 0);
context.lineTo(0, size);
context.moveTo(0, size);
context.lineTo(size, size);
context.stroke();

function clear(){
    location.reload();
}

function mouseClick(e){
    let clientX = e.pageX - e.target.offsetLeft;
    let clientY = e.pageY - e.target.offsetTop;

    context.beginPath();
    if (vertexes.length >= 1){
        for(let vert of vertexes){
            let vertX = vert[0];
            let vertY = vert[1];

            let vector = [clientX - vertX , clientY - vertY];
            let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
            context.moveTo(vertX + vector[0] * 10 / s, vertY + vector[1] * 10 / s);
        }
    }

    vertexes.push([clientX, clientY]);
}