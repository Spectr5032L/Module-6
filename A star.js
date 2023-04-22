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
    container.innerHTML = "";
    container.appendChild(table);
  }

  function clearAll() {
    location.reload();
    
  }