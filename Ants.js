const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let vertexes = [];


canvas.addEventListener('click', mouseClick);
document.getElementById("clear").onclick = clear;
document.getElementById("start").onclick = antsAlgoritm;
document.getElementById("Input").onclick = drawField;



function drawField(){
    let width = document.getElementById("width").value;
    let height = document.getElementById("height").value;

    canvas.width = width;
    canvas.height = height;

    context.moveTo(0, 0); // рамка для холста
    context.lineTo(width, 0);
    context.moveTo(width, 0);
    context.lineTo(width, height);
    context.moveTo(0, 0);
    context.lineTo(0, height);
    context.moveTo(0, height);
    context.lineTo(width, height);
    context.stroke();
}

function clear(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawField();
    vertexes = [];
    document.getElementById("LengthPath").innerText = "*Запустите алгоритм*";
}

function clearNewPath(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawField();
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
    drawVertexes();
}

function drawLines(from, to){
    let a = from.slice()
    a.push(a[0].slice())

    for (let i = 0; i < a.length - 1; i++){
        context.beginPath();
        let vector = [a[i + 1][0] - a[i][0] , a[i + 1][1] - a[i][1]];
        let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);

        context.moveTo(a[i][0] + vector[0] * 10 / s, a[i][1] + vector[1] * 10 / s);
        context.lineTo(a[i + 1][0] - vector[0] * 10 / s, a[i + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = "rgb(255,255,255)";  //"rgb(255,0,0) - красный"; //"rgb(255,255,255) - белый"; 
        context.lineWidth = 3;
        context.stroke();

        context.moveTo(a[i][0] + vector[0] * 10 / s, a[i][1] + vector[1] * 10 / s);
        context.lineTo(a[i + 1][0] - vector[0] * 10 / s, a[i + 1][1] - vector[1] * 10 / s);
    }

    let bufer = to.slice();
    bufer.push(bufer[0].slice())

    for (let i = 0; i < bufer.length - 1; i++){
        context.beginPath();
        let vector = [bufer[i + 1][0] - bufer[i][0] , bufer[i + 1][1] - bufer[i][1]];
        let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
        context.moveTo(bufer[i][0] + vector[0] * 10 / s, bufer[i][1] + vector[1] * 10 / s);
        context.lineTo(bufer[i + 1][0] - vector[0] * 10 / s, bufer[i + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = "rgb(38, 38, 38)"; // 250, 142, 142 - красный 38, 38, 38 - черный (светлый) 
        context.lineWidth = 1;
        context.stroke();
    }

}

function drawFinishPath(bestPath, color){
    bestPath.push(bestPath[0].slice());

    for (let i = 0; i < bestPath.length - 1; i++){
        context.beginPath();
        let vector = [bestPath[i + 1][0] - bestPath[i][0] , bestPath[i + 1][1] - bestPath[i][1]];
        let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);

        context.moveTo(bestPath[i][0] + vector[0] * 10 / s, bestPath[i][1] + vector[1] * 10 / s);
        context.lineTo(bestPath[i + 1][0] - vector[0] * 10 / s, bestPath[i + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = "rgb(255,255,255)"; //"rgb(255,255,255) - белый"
        context.lineWidth = 3;
        context.stroke();

        context.moveTo(bestPath[i][0] + vector[0] * 10 / s, bestPath[i][1] + vector[1] * 10 / s);
        context.lineTo(bestPath[i + 1][0] - vector[0] * 10 / s, bestPath[i + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = color;
        context.lineWidth = 1;
        context.stroke()
    }
    
    let pathLength = 0;
    for (let i = 0; i < bestPath.length - 1; i++) {
        let a = bestPath[i], bufer = bestPath[i + 1];
        let dx = a[0] - bufer[0], dy = a[1] - bufer[1];
        let dist = Math.sqrt(dx * dx + dy * dy);
        pathLength += dist;
    }
    document.getElementById("LengthPath").innerText = Math.round(pathLength);

}


function drawVertexes(){
    for (let i = 0; i < vertexes.length; i++){
        context.beginPath();
        context.fillStyle = '#ff4242';      // ff4242 - красный a8a1a1 - серый
        context.fillRect(vertexes[i][0] - 10, vertexes[i][1] - 10, 20, 20);

    }
}

function wait(time) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, time);
    });
}  

function distanceBetweenTwoPoints(first, second){
    return Math.sqrt(Math.pow(first[0] - second[0], 2) + Math.pow(first[1] - second[1], 2));
}

function allDistanceForPath(pathIdx){
    let dist = 0
    for (let i = 0; i < pathIdx.length - 1; i++){
        dist += distanceBetweenTwoPoints(vertexes[pathIdx[i]].slice(), vertexes[pathIdx[i + 1]].slice());
    }
    dist += distanceBetweenTwoPoints(vertexes[pathIdx[pathIdx.length - 1]].slice(), vertexes[pathIdx[0]].slice());
    return dist;
}

let numberGenerations = 5000;
let alpha = 1; 
let beta = 1;
let Q = 250; 
let evaporation = 0.64; 

let slider1 = document.getElementById("sliderNumberGenerations"); 
let slider2 = document.getElementById("sliderQ");

slider1.addEventListener("input", function()
{
    numberGenerations = parseInt(slider1.value);
    outputTextG = document.getElementById("coutNumberGenerations");
    outputTextG.textContent = numberGenerations;
})
slider2.addEventListener("input", function()
{
    Q = parseInt(slider2.value);
    outputTextH = document.getElementById("coutQ");
    outputTextH.textContent = Q;
})

async function antsAlgoritm(){
    document.getElementById("LengthPath").innerText = "*Запустите алгоритм*";
    clearNewPath();
    drawVertexes();
    let vertexesLength = vertexes.length;
    let bestAnts = [];

    let bufer = vertexes.slice(0);

    let iPath = [];
    for (let i = 0; i < vertexes.length; i++){
        iPath.push(i);
    }

    bestAnts.push(bufer, iPath, allDistanceForPath(iPath));

    let pheromones = [];
    let distance = [];

    for (let i = 0; i < vertexesLength; i++){
        pheromones[i] = new Array(vertexesLength);
        distance[i] = new Array(vertexesLength);
    }

    for (let i = 0; i < vertexes.length - 1; i++){
        for (let j = i + 1; j < vertexes.length; ++j){
            distance[i][j] = Q / distanceBetweenTwoPoints(vertexes[i].slice(), vertexes[j].slice());
            pheromones[i][j] = 0.2;
        }
    }


    let end = vertexesLength * 2; 

    for (let i = 0; i < numberGenerations; i++){
        if (end === 0){
            drawFinishPath(bestAnts[0], "rgb(142,250,142)");
            break;
        }

        let ways = [];
        let path = [];
        let pathIdx = [];

        for (let ant = 0; ant < vertexes.length; ++ant){
            path = [];
            pathIdx = [];
            let startVertexIdx = ant;
            let startVertex = vertexes[startVertexIdx].slice();

            path.push(startVertex);
            pathIdx.push(startVertexIdx);

            while (path.length !== vertexes.length){
                let sumOfDesires = 0;

                let p = [];
                for (let j = 0; j < vertexes.length; ++j) {
                    if (pathIdx.indexOf(j) !== -1){
                        continue;
                    }
                    let min = Math.min(startVertexIdx, j);
                    let max = Math.max(startVertexIdx, j);
                    let desire = Math.pow(pheromones[min][max], alpha) * Math.pow(distance[min][max], beta);
                    p.push([j,desire]);
                    sumOfDesires += desire;
                }

                for (let i = 0; i < p.length; i++){
                    p[i][1] /= sumOfDesires;
                }

                for (let j = 1; j < p.length; ++j){
                    p[j][1] += p[j - 1][1];
                }

                let rand = Math.random()
                let choice
                for (let i = 0; i < p.length; i++){
                    if (rand < p[i][1]){
                        choice = p[i][0];
                        break;
                    }
                }
                startVertexIdx = choice;

                startVertex = vertexes[startVertexIdx].slice();
                path.push(startVertex.slice());
                pathIdx.push(startVertexIdx);
            }
            ways.push([path.slice(), pathIdx.slice(), allDistanceForPath(pathIdx)])
        }

        ways.sort((function (a, bufer) { return a[2] - bufer[2]}));

        for (let i = 0; i < vertexesLength - 1; i++){
            for (let j = i + 1; j < vertexesLength; ++j){
                pheromones[i][j] *= evaporation;
            }
        }

        for (let i = 0; i < ways.length; i++){
            let idxPath = ways[i][1].slice();
            let lenOfPath = ways[i][2]
            for (let j = 0; j < vertexesLength - 1; ++j){
                let min = Math.min(idxPath[j], idxPath[j + 1]);
                let max = Math.max(idxPath[j], idxPath[j + 1]);
                pheromones[min][max] += Q / lenOfPath;
            }
        }

        let newBestAnt = ways[0].slice();

        if (newBestAnt[2] < bestAnts[2]){
            drawLines(bestAnts[0], newBestAnt[0]);
            bestAnts = newBestAnt.slice();
            drawVertexes();
            end = vertexesLength * 2;
        }

        end -= 1;
        console.log(i)
        await wait(100);
    }

}