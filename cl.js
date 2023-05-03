let canvas = document.getElementById("canvas");
let canva = canvas.getContext("2d");
let points = [];
let clusters = [];

function clear_canvas()
{
    location.reload();
}

function random_points()
{
    let count_points = document.getElementById("count_points").value;

    for(let i = 0; i < count_points; i++) 
    {
        points.push({x: Math.random() * canvas.width, y: Math.random() * canvas.height});

        canva.clearRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < points.length; i++) 
        {
            let size_point = document.getElementById("size_point").value;  
            canva.beginPath();
            canva.arc(points[i].x, points[i].y, size_point, 0, 2 * Math.PI);
            canva.fillStyle = "darkslategray";
            canva.fill();
        }
    }
}

canvas.addEventListener('click', function(event)
{
    let x = event.pageX - canvas.offsetLeft;
    let y = event.pageY - canvas.offsetTop;
    points.push({x: x, y: y});

    canva.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < points.length; i++) 
    {
        let size_point = document.getElementById("size_point").value;  
        canva.beginPath();
        canva.arc(points[i].x, points[i].y, size_point, 0, 2 * Math.PI);
        canva.fillStyle = "darkslategray";
        canva.fill();
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