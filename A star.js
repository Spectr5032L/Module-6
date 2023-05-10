// A*
let matrix = [];
let maze_button = document.getElementById('maze_button');
let algorithm_button = document.getElementById('a_star');
let change_size = document.getElementById('table_size');
let set_start_finish = document.getElementById('create_start_finish');
class Node {
  parent = null;
  x = null;
  y = null;
}
let start = new Node;
let finish = new Node;
let start_setted = false;
function set_table() {
  // Удаляем таблицу с идентификатором 'table', если она существует
  let table = document.getElementById('table');
  if (table) {
    table.remove();
  }
  // Создаем новую таблицу с идентификатором 'table' и красной рамкой
  table = document.createElement('table');
  table.id = 'table';
  table.style.border = '1px solid red';
  // Извлекаем размер таблицы
  let size = parseInt(document.getElementById('table_size').value);
  document.getElementById('table_size').value = size;
  // Очищаем массив состояний ячейки
  matrix = [];
  // Создаем новую таблицу с указанным размером
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
  // Добавляем браузерные события
  table.addEventListener('click', create_wall_cell);
  document.getElementById('table_block').appendChild(table);
  default_start_finish_cells();
}
// Ставим старт и финиш в дефолтные места (в левом верхнем - старт, в правом нижнем - финиш)
function default_start_finish_cells() {
  let size = document.getElementById('table_size').value;
  start.x = 0;
  start.y = 0;
  finish.x = size - 1;
  finish.y = size - 1;
  document.getElementById('table').rows[start.y].cells[start.x].dataset.mode = 'start';
  document.getElementById('table').rows[finish.y].cells[finish.x].dataset.mode = 'finish';
}
// Функция для создания ячейки 'стена'
function create_wall_cell(x, y) {
  matrix[x][y] = 1;
  document.getElementById('table').rows[x].cells[y].dataset.mode = 'wall';
}
// Функция для создания пустой ячейки
function delete_cell(x, y) {
  matrix[x][y] = 0;
  document.getElementById('table').rows[x].cells[y].dataset.mode = 'empty';
}
// Функция установки стартовой и финишной клеток
function create_start_finish_cells(event) {
  let cell = event.target;
  // Если флаг start_setted = false и она пуста, то нажатая ячейка отмечается стартовой, ее координаты записываются в start, флаг меняется
  if(!start_setted && cell.dataset.mode === 'empty') {
    cell.dataset.mode = 'start';
    start.x = parseInt(cell.dataset.y);
    start.y = parseInt(cell.dataset.x);
    start_setted = true;
  }
  // Если флаг start_setted = true после установки старта и она пуста, то нажатая ячейка отмечается финишной, ее координаты записываются в start, флаг меняется
  else if (start_setted && cell.dataset.mode === 'empty') {
    cell.dataset.mode = 'finish';
    finish.x = parseInt(cell.dataset.y);
    finish.y = parseInt(cell.dataset.x);
    table.removeEventListener('click', create_start_finish_cells);
    table.addEventListener('click', set_wall_cell);
    // Врубаем кнопочки
    maze_button.disabled  = false;
    algorithm_button.disabled = false;
    change_size.disabled = false;
    set_start_finish.disabled = false;
  }
}
// Функция создания стены
function set_wall_cell(event) {
  const cell = event.target;
  const x = cell.dataset.x;
  const y = cell.dataset.y;
  const current_mode = cell.dataset.mode;
  // Если ни старт, ни финиш
  if (current_mode !== 'start' && current_mode !== 'finish') {
    // Если не стена - стена, если стена - не стена
    cell.dataset.mode = current_mode === 'wall' ? 'empty' : "wall";
    // Если значение 1, то стена, если ноль, то не стена
    matrix[x][y] = matrix[x][y] === 1 ? 0 : 1;
  }
}