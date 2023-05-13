let canvas = document.getElementById("canvas");
let cnvs = canvas.getContext("2d");
let pointsKMeans = [];
let pointsDBSCAN = [];
let clusters = [];


function line()
{
    cnvs.beginPath();
    cnvs.lineWidth = 2;
    cnvs.moveTo(700, 0);
    cnvs.lineTo(700, 700);
    cnvs.strokeStyle = "#b803f9";
    cnvs.stroke();
}
line();

function receiptSizePoint()
{
    let sizePoint = document.getElementById("sizePoint").value;  
    if(sizePoint < 3)
        sizePoint = 3;

    return sizePoint;
}

function clear_canvas()
{
    location.reload();
}

function random_points()
{
    let countPoints = document.getElementById("countPoints").value;

    for(let i = 0; i < countPoints; i++) 
    {
        let x = (Math.random() + 0.015) * 680;
        let y = Math.random() * canvas.height;

        pointsKMeans.push({x: x, y: y});
        pointsDBSCAN.push({x: x + 700, y: y});

        cnvs.clearRect(0, 0, canvas.width, canvas.height);
        line();
        
        for(let i = 0; i < pointsKMeans.length; i++) 
        {
            let sizePoint = receiptSizePoint();
            cnvs.beginPath();
            cnvs.arc(pointsKMeans[i].x, pointsKMeans[i].y, sizePoint, 0, 2 * Math.PI);
            cnvs.arc(pointsKMeans[i].x + 700, pointsKMeans[i].y, sizePoint, 0, 2 * Math.PI);
            cnvs.fillStyle = "darkslategray";
            cnvs.fill();
        }
    }
}

canvas.addEventListener('click', function(event)
{
    let x = event.pageX - canvas.offsetLeft;
    let y = event.pageY - canvas.offsetTop;

    if(x <= 700)
    {
        pointsKMeans.push({x: x, y: y});
        pointsDBSCAN.push({x: x + 700, y: y});
    }
    else
    {
        pointsKMeans.push({x: x - 700, y: y});
        pointsDBSCAN.push({x: x, y: y});
    }

    cnvs.clearRect(0, 0, canvas.width, canvas.height);
    line();
    for(let i = 0; i < pointsKMeans.length; i++) 
    {
        let sizePoint = receiptSizePoint();
        cnvs.beginPath();
        cnvs.arc(pointsKMeans[i].x, pointsKMeans[i].y, sizePoint, 0, 2 * Math.PI);
        cnvs.arc(pointsKMeans[i].x + 700, pointsKMeans[i].y, sizePoint, 0, 2 * Math.PI);
        cnvs.fillStyle = "darkslategray";
        cnvs.fill();
    }
});

function start_with_clusters()
{
    alert("Не расставляйте центры слишком близко друг к другу иначе алгоритм будет работать не корректно")

    canvas.addEventListener('click', function(event)
    {
        let x = event.pageX - canvas.offsetLeft;
        let y = event.pageY - canvas.offsetTop;
        clusters.push({x: x, y: y});
        pointsKMeans.pop();

        let clusterIndex = 0;
        let countClusters = document.getElementById("countClusters").value; 

        for(let i = 0; i < clusters.length; i++) 
        {
            cnvs.beginPath();
            cnvs.fillStyle = ["darkred", "darkgreen", "darkblue", "aqua", "purple"][clusterIndex];
            cnvs.fillRect(clusters[i].x - 15, clusters[i].y - 15, 30, 30);
            clusterIndex++;
        }

        if(clusterIndex == countClusters)
        {
            start();
            DBSCAN();
        }
    });
}

function start() 
{
    let countClusters = document.getElementById("countClusters").value;
    

    for(let iter = 0; iter < 50; iter++) 
    {
        let newClusters = [];
        
        for(let i = 0; i < countClusters; i++)
            newClusters.push({x: 0, y: 0, count: 0});

        for(let i = 0; i < pointsKMeans.length; i++) 
        {
            let minDist = Infinity;
            let clusterIndex = 0;

            for(let j = 0; j < countClusters; j++) 
            {
                let dist = Math.sqrt((pointsKMeans[i].x - clusters[j].x) ** 2 + (pointsKMeans[i].y - clusters[j].y) ** 2);

                if(dist < minDist) 
                {
                    minDist = dist;
                    clusterIndex = j;
                }
            }
            newClusters[clusterIndex].x += pointsKMeans[i].x;
            newClusters[clusterIndex].y += pointsKMeans[i].y;
            newClusters[clusterIndex].count++;
            
            let sizePoint = receiptSizePoint();
            cnvs.beginPath();
            cnvs.arc(pointsKMeans[i].x, pointsKMeans[i].y, sizePoint, 0, 2 * Math.PI);
            cnvs.fillStyle = ["red", "green", "blue", "aquamarine", "mediumpurple"][clusterIndex];
            cnvs.fill();
        }
        
        for(let i = 0; i < countClusters; i++) 
        {
            if(newClusters[i].count > 0) 
            {
                newClusters[i].x /= newClusters[i].count;
                newClusters[i].y /= newClusters[i].count;
            }
        }
        clusters = newClusters;
    }
}

function DBSCAN() 
{
	let minCountPoints = 2;
	let minDistance = 20;
	let sizePoint = receiptSizePoint();
	minDistance *= sizePoint / 5;
    let clusterInd = 0;
    let visited = new Set();
    let cluster = new Array(pointsDBSCAN.length).fill(-1);

    function cluster_expansion(main_point, clusterInd) 
    {
        cluster[main_point] = clusterInd;
        let neighbors = search_neighbors(main_point);

        for (let neigh of neighbors) 
        {
            let nextPoint = neigh;

            if (!visited.has(nextPoint)) 
            {
                visited.add(nextPoint);
                let next_Neighbors = search_neighbors(nextPoint);

                if (next_Neighbors.length >= minCountPoints) 
                    neighbors = neighbors.concat(next_Neighbors);
            }

            if (cluster[nextPoint] === -1) 
                cluster[nextPoint] = clusterInd;
        }
    }
    
    function search_neighbors(main_point) 
    {
        let neighbors = [];
        for (let i = 0; i < pointsDBSCAN.length; i++) 
			if (i !== main_point && Math.sqrt((pointsDBSCAN[i].x - pointsDBSCAN[main_point].x) ** 2 + (pointsDBSCAN[i].y - pointsDBSCAN[main_point].y) ** 2) <= minDistance)
                neighbors.push(i);
        return neighbors;
    }
  
    for (let i = 0; i < pointsDBSCAN.length; i++) 
    {
        if (!visited.has(i))
        {
            visited.add(i);
            let neighbors = search_neighbors(i);

            if (neighbors.length < minCountPoints) 
                cluster[i] = -1;
            else 
            {
                cluster[i] = clusterInd;
                cluster_expansion(i, clusterInd);
                clusterInd++;
            }
        }
    }

    for(let i = 0; i < cluster.length; i++)
    {
        let colors = [
            "#FF5733",
            "#00FFFF",
            "#FFC300",
            "#6200EA",
            "#F7DC6F",
            "#8E44AD",
            "#4CAF50",
            "#E74C3C",
            "#FFFF00",
            "#03A9F4",
            "#FF6F00",
            "#7F8C8D",
            "#9B59B6",
            "#00FF00",
            "#D35400"
        ]
        if (cluster[i] !== -1)
        {
            cnvs.beginPath();
            cnvs.arc(pointsDBSCAN[i].x, pointsDBSCAN[i].y, sizePoint, 0, 2 * Math.PI);
            cnvs.fillStyle = colors[cluster[i]];
            cnvs.fill();
        }
        else
        {
            cnvs.beginPath();
            cnvs.arc(pointsDBSCAN[i].x, pointsDBSCAN[i].y, sizePoint, 0, 2 * Math.PI);
            cnvs.fillStyle = "darkslategray";
            cnvs.fill();
        }
    }
}