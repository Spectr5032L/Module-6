// A*
let matrix = [];
let start = new Node;
let finish = new Node;
function set_table() {
  // Delete the table
  let table = document.getElementById('table');
  if (table) table.remove();
  // Create a new table
  table = document.createElement('table');
  table.id = 'table';
  table.style.border = '1px solid red';
  // Set the table size
  let size = parseInt(document.getElementById('table_size').value);
  document.getElementById('table_size').value = size;
  // Clear the matrix
  matrix = [];
  // Create cells
  for (let column = 0; column < size; column++) {
    let row_element = table.insertRow(column);
    matrix[column] = [];
    for (let row = 0; row < size; row++) {
      let cell = row_element.insertCell(row);
      cell.dataset.mode = 'empty';
      cell.dataset.x = column;
      cell.dataset.y = row;
      matrix[column][row] = 0;
    }
  }
  // Add event listeners
  table.addEventListener('click', create_wall_cell);
  document.getElementById('table_block').appendChild(table);
  default_start_finish_cells();
}
// Set start at the start, finish at the finish
function default_start_finish_cells() {
  let size = document.getElementById('table_size').value;
  start.x = 0;
  start.y = 0;
  finish.x = size - 1;
  finish.y = size - 1;
  document.getElementById('table').rows[start.y].cells[start.x].dataset.mode = 'start';
  document.getElementById('table').rows[finish.y].cells[finish.x].dataset.mode = 'finish';
}
