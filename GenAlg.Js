const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

var vertexes = [];
var size = 750;

canvas.addEventListener('click', mouseClick);
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
    drawVertexes();
}

function drawVertexes(){
    for (let i = 0; i < vertexes.length; ++i){
        context.beginPath();
        context.fillStyle = '#ff4242';
        context.fillRect(vertexes[i][0] - 10, vertexes[i][1] - 10, 20, 20);
    }
}

function drawLines(from, to){
    from.splice(from.length - 1, 0, from[0].slice())
    for (let i = 0; i < from.length - 1; ++i){
        context.beginPath();
        let vector = [from[i + 1][0] - from[i][0] , from[i + 1][1] - from[i][1]];
        let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);

        context.moveTo(from[i][0] + vector[0] * 10 / s, from[i][1] + vector[1] * 10 / s);
        context.lineTo(from[i + 1][0] - vector[0] * 10 / s, from[i + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = "rgb(255,255,255)";  //"rgb(255,0,0) - красный"; //"rgb(255,255,255) - белый"; 
        context.lineWidth = 3;
        context.stroke();

        context.moveTo(from[i][0] + vector[0] * 10 / s, from[i][1] + vector[1] * 10 / s);
        context.lineTo(from[i + 1][0] - vector[0] * 10 / s, from[i + 1][1] - vector[1] * 10 / s);
    }

    to.splice(to.length - 1, 0, to[0].slice())
    for (let q = 0; q < to.length - 1; ++q){
        context.beginPath();
        let vector = [to[q + 1][0] - to[q][0] , to[q + 1][1] - to[q][1]];
        let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
        context.moveTo(to[q][0] + vector[0] * 10 / s, to[q][1] + vector[1] * 10 / s);
        context.lineTo(to[q + 1][0] - vector[0] * 10 / s, to[q + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = "rgb(38, 38, 38)"; // 250, 142, 142 - красный 38, 38, 38 - черный (светлый) 
        context.lineWidth = 1;
        context.stroke();
    }

}

function drawFinishPath(bestPath, color){
    bestPath.splice(bestPath.length - 1, 0, bestPath[0].slice())
    for (let i = 0; i < bestPath.length - 2; ++i){
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
}

function startPopulation(firstGeneration){
    let res = [];
    let buf = firstGeneration.slice();
    buf.push(distance(buf));
    res.push(buf.slice());

    for (let i = 0; i < vertexes.length * vertexes.length; ++i){
        buf = firstGeneration.slice();
        buf = permutation(buf)
        buf.push(distance(buf));
        res.push(buf.slice())
    }
    return res;
}

function permutation(array) {
    let a = array.slice()
    for (let i = 0; i < vertexes.length - 1; ++i) {
        let r1 = randomNumber(1, vertexes.length - 1);
        let r2 = randomNumber(1, vertexes.length - 1);
        [a[r1], a[r2]] = [a[r2], a[r1]];
    }
    return a.slice();
}

function crossingParents(firstParent, secondParent){
    let firstChild = cross(firstParent, secondParent);
    let secondChild = cross(firstParent, secondParent);

    firstChild.push(distance(firstChild.slice()))
    secondChild.push(distance(secondChild.slice()))
    return [firstChild, secondChild];
}

function distance(chromosome){
    let ans = 0;
    for (let i = 0; i < chromosome.length - 1; ++i){
        ans += Math.sqrt(Math.pow(chromosome[i][0] - chromosome[i + 1][0], 2) + Math.pow(chromosome[i][1] - chromosome[i + 1][1], 2));
    }
    ans += Math.sqrt(Math.pow(chromosome[chromosome.length - 1][0] - chromosome[0][0], 2) + Math.pow(chromosome[chromosome.length - 1][1] - chromosome[0][1], 2));
    return ans;
}

function cross(firstParent, secondParent){
    let child = [];
    let index1 = randomNumber(0, firstParent.length);
    let index2 = randomNumber(index1 + 1, firstParent.length);
    child = firstParent.slice(index1, index2 + 1);

    for (let num of secondParent) {
        if (!child.includes(num)) {
            child.push(num);
        }
    }

    if (Math.random() * 100 < chanceOfMutation){ // Вероятность мутировать
        let rand = twoRandomNumbers(1, lengthChromosom);
        let i = rand[0], j = rand[1];
        [child[i], child[j]] = [child[j], child[i]];
    }

    return child;
}

function randomNumber(min, max){
    return  Math.floor(Math.random() * (max - min) + min);
}

function twoRandomNumbers(min, max){
    let a = Math.floor(Math.random() * (max - min) + min);
    let b = Math.floor(Math.random() * (max - min) + min);
    while (a === b){
        a = Math.floor(Math.random() * (max - min) + min);
    }
    return [a, b];
}

var lengthChromosom; // исключая начальную и конечную
var numberGenerations = 0;
var chanceOfMutation = 0;

var slider1 = document.getElementById("slider_numberGenerations");
var slider2 = document.getElementById("slider_chanceOfMutation"); 
slider1.addEventListener("input", function()
{
    numberGenerations = parseInt(slider1.value);
})
slider2.addEventListener("input", function()
{
    chanceOfMutation = parseInt(slider2.value);
})

async function geneticAlg(){
    let firstGeneration = [];
    let end = 500;

    for (let i = 0; i < vertexes.length; ++i){
        firstGeneration.push(vertexes[i]);
    }
    lengthChromosom = firstGeneration.length;

    let population = startPopulation(firstGeneration);
    population.sort((function (a, b) { return a[a.length - 1] - b[b.length - 1]}));

    let bestChromosome = population[0].slice();
    drawFinishPath(bestChromosome, "rgb(38, 38, 38)"); // 250, 142, 142 - красный 38, 38, 38 - черный (светлый)

    for(let i = 0; i < numberGenerations; ++i){
        if (end === 0){
            fl = 1;
            drawFinishPath(bestChromosome, "rgb(142,250,142)") // 142,250,142 - зеленый
            break;
        }

        population = population.slice(0, vertexes.length * vertexes.length);

        for (let j = 0; j < vertexes.length * vertexes.length; ++j){
            let index1 = randomNumber(0, population.length);
            let index2 = randomNumber(0, population.length);
            let firstParent = population[index1].slice(0, population[index1].length - 1);
            let secondParent = population[index2].slice(0, population[index2].length - 1);

            let child = crossingParents(firstParent, secondParent);
            population.push(child[0].slice())
            population.push(child[1].slice())
        }

        population.sort((function (a, b) { return a[a.length - 1] - b[b.length - 1]}));

        // Отслеживание лучшей хромосомы и отрисовка линий на ее основе
        if (JSON.stringify(bestChromosome) !== JSON.stringify(population[0])){
            drawLines(bestChromosome, population[0])
            bestChromosome = population[0].slice();
            end = 500;
        }

        if (i % 100 === 0){
            console.log(i);
            end -= 100;
        }

        drawVertexes();
        await wait(0);
    }
    
}

function wait(time) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, time);
    });
}  