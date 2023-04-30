let canvas = document.getElementById("canvas");
let canva = canvas.getContext("2d");
let points = [];

function clear_canvas()
{
    location.reload();
}

canvas.addEventListener('click', function(event)
{
    let x = event.pageX - canvas.offsetLeft;
    let y = event.pageY - canvas.offsetTop;
    points.push({x: x, y: y});

    let size_point = document.getElementById("size_point").value;
    canva.beginPath();
    canva.arc(points[points.length - 1].x, points[points.length - 1].y, size_point, 0, 2 * Math.PI);
    canva.fillStyle = "darkslategray";
    canva.fill();
});