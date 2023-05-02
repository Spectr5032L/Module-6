let canvas = document.getElementById("canvas");
let canva = canvas.getContext("2d");
let points = [];
let clusters = [];
let cluster_Index = 0;

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

function start_with_clusters()
{
    canvas.addEventListener('click', function(event)
    {
        let x = event.pageX - canvas.offsetLeft;
        let y = event.pageY - canvas.offsetTop;
        clusters.push({x: x, y: y});

        canva.beginPath();
        canva.fillStyle = ["darkred", "darkgreen", "darkblue"][cluster_Index];
        canva.fillRect(clusters[clusters.length - 1].x - 15, clusters[clusters.length - 1].y - 15, 30, 30);
        
        cluster_Index++;
        if(cluster_Index == 3)
        {
            start();
        }
    });
}

function start_without_clusters()
{
    let k = 3;

    for(let i = 0; i < k; i++)
    {
        clusters.push({x: Math.random() * canvas.width, y: Math.random() * canvas.height});
        canva.beginPath();
        canva.fillStyle = ["darkred", "darkgreen", "darkblue"][cluster_Index];
        canva.fillRect(clusters[clusters.length - 1].x - 15, clusters[clusters.length - 1].y - 15, 30, 30);
        cluster_Index++; 
    }
    start();
}

function start() 
{
    let k = 3;
    let size_point = document.getElementById("size_point").value;

    for(let iter = 0; iter < 50; iter++) 
    {
        let newClusters = [];
        
        for(let i = 0; i < k; i++)
            newClusters.push({x: 0, y: 0, count: 0});

        for(let i = 0; i < points.length; i++) 
        {
            let minDist = Infinity;
            let clusterIndex = 0;

            for(let j = 0; j < k; j++) 
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
            canva.fillStyle = ["red", "green", "blue"][clusterIndex];
            canva.fill();
        }
        
        for(let i = 0; i < k; i++) 
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
