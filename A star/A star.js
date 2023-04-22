function createTable() {
  let n = document.getElementById("input").value;
  let container = document.getElementById("tablecontainer");
  let table = document.createElement("table");

  for (let i = 0; i < n; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < n; j++) {
      let cell = document.createElement("td");
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  // Появление кнопок
  var buttons = document.querySelectorAll(".Show");
  buttons.forEach(function(button) {
    button.style.display = "inline-block";
  });

  container.innerHTML = "";
  container.appendChild(table);
}


function clearAll() {
  location.reload();
}


let fl_start = false;
function createStart() {
  {
    let cells = document.getElementsByTagName("td");
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", function() {
      if(fl_start === false) this.style.backgroundColor = "aqua";
      fl_start = true;
    });
    }
  }
  
}


let fl_finish = false;
function createFinish() {
  {
    let cells = document.getElementsByTagName("td");
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", function() {
      if(fl_finish === false) this.style.backgroundColor = "purple";
      fl_finish = true;
    });
    }
  }
  
}


function createObstacle() {
  {
    let cells = document.getElementsByTagName("td");
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", function() {
        this.style.backgroundColor = "black";
    });
    }
  }
  
}