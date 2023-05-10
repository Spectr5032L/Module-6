let canvas = document.getElementById("canvas");
let canva = canvas.getContext("2d");
let points = [];
let points2 = [];
let clusters = [];
line();

function line()
{
    canva.beginPath();
    canva.lineWidth = 2;
    canva.moveTo(700, 0);
    canva.lineTo(700, 700);
    canva.strokeStyle = "#b803f9";
    canva.stroke();
}

function clear_canvas()
{
    location.reload();
}

function random_points()
{
    let count_points = document.getElementById("count_points").value;

    for(let i = 0; i < count_points; i++) 
    {
        let x = (Math.random() + 0.015) * 680;
        let y = Math.random() * canvas.height;

        points.push({x: x, y: y});
        points2.push({x: x + 700, y: y});

        canva.clearRect(0, 0, canvas.width, canvas.height);
        line();
        for(let i = 0; i < points.length; i++) 
        {
            let size_point = document.getElementById("size_point").value;  
            canva.beginPath();
            canva.arc(points[i].x, points[i].y, size_point, 0, 2 * Math.PI);
            canva.fillStyle = "darkslategray";
            canva.fill();

            canva.beginPath();
            canva.arc(points[i].x + 700, points[i].y, size_point, 0, 2 * Math.PI);
            canva.fillStyle = "darkslategray";
            canva.fill();
        }
    }
}

canvas.addEventListener('click', function(event)
{
    let x = event.pageX - canvas.offsetLeft;
    let y = event.pageY - canvas.offsetTop;

    if(x <= 700)
    {
        points.push({x: x, y: y});
        points2.push({x: x + 700, y: y});
    }
    else
    {
        points.push({x: x - 700, y: y});
        points2.push({x: x, y: y});
    }

    canva.clearRect(0, 0, canvas.width, canvas.height);
    line();
    for(let i = 0; i < points.length; i++) 
    {
        let size_point = document.getElementById("size_point").value;  
        canva.beginPath();
        canva.arc(points[i].x, points[i].y, size_point, 0, 2 * Math.PI);
        canva.fillStyle = "darkslategray";
        canva.fill();

        canva.beginPath();
        canva.arc(points[i].x + 700, points[i].y, size_point, 0, 2 * Math.PI);
        canva.fillStyle = "darkslategray";
        canva.fill();
    }
});

function start_with_clusters()
{
    //alert("Не расставляйте центры слишком близко друг к другу иначе алгоритм будет работать не корректно")

    canvas.addEventListener('click', function(event)
    {
        let x = event.pageX - canvas.offsetLeft;
        let y = event.pageY - canvas.offsetTop;
        clusters.push({x: x, y: y});
        points.pop();

        let cluster_Index = 0;
        let count_clusters = document.getElementById("count_clusters").value; 

        for(let i = 0; i < clusters.length; i++) 
        {
            canva.beginPath();
            canva.fillStyle = ["darkred", "darkgreen", "darkblue", "aqua", "purple"][cluster_Index];
            canva.fillRect(clusters[i].x - 15, clusters[i].y - 15, 30, 30);
            cluster_Index++;
        }

        if(cluster_Index == count_clusters)
        {
            start();
            DBSCAN(points2);
        }
    });
}

function start() 
{
    let count_clusters = document.getElementById("count_clusters").value;
    let size_point = document.getElementById("size_point").value;

    for(let iter = 0; iter < 50; iter++) 
    {
        let newClusters = [];
        
        for(let i = 0; i < count_clusters; i++)
            newClusters.push({x: 0, y: 0, count: 0});

        for(let i = 0; i < points.length; i++) 
        {
            let minDist = Infinity;
            let clusterIndex = 0;

            for(let j = 0; j < count_clusters; j++) 
            {
                let dist = Math.sqrt((points[i].x - clusters[j].x) ** 2 + (points[i].y - clusters[j].y) ** 2);

                if(dist < minDist) 
                {
                    minDist = dist;
                    clusterIndex = j;
                }
            }
            newClusters[clusterIndex].x += points[i].x;
            newClusters[clusterIndex].y += points[i].y;
            newClusters[clusterIndex].count++;

            canva.beginPath();
            canva.arc(points[i].x, points[i].y, size_point, 0, 2 * Math.PI);
            canva.fillStyle = ["red", "green", "blue", "aquamarine", "mediumpurple"][clusterIndex];
            canva.fill();
        }
        
        for(let i = 0; i < count_clusters; i++) 
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

let colors = [
    "#370042",
    "#000000",
    "#d180c5",
    "#9e5493",
    "#540048",
    "#483d8b",
    "#0f129c",
    "#8A2BE2",
    "#c71585",
    "#a658e2",
    "#d4ace2",
    "#a497e2",
    "#7a6ae2",
    "#e23bcc",
    "#e200e2"
]

function DBSCAN(points) 
{
	let min_count_points = 2;
	let min_Distance = 20;
	let size_point = document.getElementById("size_point").value;
	min_Distance *= size_point / 5;
    let cluster_ind = 0;
    let visited = new Set();
    let cluster = new Array(points.length).fill(-1);

    function cluster_expansion(main_point, cluster_ind) 
    {
        cluster[main_point] = cluster_ind;
        let neighbors = search_neighbors(main_point);

        for (let i = 0; i < neighbors.length; i++) 
        {
            let next_point = neighbors[i];

            if (!visited.has(next_point)) 
            {
                visited.add(next_point);
                let next_Neighbors = search_neighbors(next_point);

                if (next_Neighbors.length >= min_count_points) 
                    neighbors = neighbors.concat(next_Neighbors);
            }

            if (cluster[next_point] === -1) 
                cluster[next_point] = cluster_ind;
        }
    }
    
    function search_neighbors(main_point) 
    {
        let neighbors = [];
        for (let i = 0; i < points.length; i++) 
			if (i !== main_point && Math.sqrt((points[i].x - points[main_point].x) ** 2 + (points[i].y - points[main_point].y) ** 2) <= min_Distance)
                neighbors.push(i);
        return neighbors;
    }
  
    for (let i = 0; i < points.length; i++) 
    {
        if (!visited.has(i))
        {
            visited.add(i);
            let neighbors = search_neighbors(i);

            if (neighbors.length < min_count_points) 
                cluster[i] = -1;
            else 
            {
                cluster[i] = cluster_ind;
                cluster_expansion(i, cluster_ind);
                cluster_ind++;
            }
        }
    }

    for(let i = 0; i < cluster.length; i++)
    {
        if (cluster[i] !== -1)
        {
            canva.beginPath();
            canva.arc(points[i].x, points[i].y, size_point, 0, 2 * Math.PI);
            canva.fillStyle = colors[cluster[i]];
            canva.fill();
        }
        else
        {
            canva.beginPath();
            canva.arc(points[i].x, points[i].y, size_point, 0, 2 * Math.PI);
            canva.fillStyle = "darkslategray";
            canva.fill();
        }
    }
}