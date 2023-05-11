// A*
let matrix = [];
let mazeButton = document.getElementById('mazeButton');
let algorithmButton = document.getElementById('aStar');
let changeSize = document.getElementById('tableSize');
let setStartFinish = document.getElementById('createStartFinish');
class Node {
  parent = null;
  x = null;
  y = null;
}
let start = new Node;
let finish = new Node;
let startSetted = false;
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
  let size = parseInt(document.getElementById('tableSize').value);
  document.getElementById('tableSize').value = size;
  // Очищаем массив состояний ячейки
  matrix = [];
  // Создаем новую таблицу с указанным размером
  for (let column = 0; column < size; column++) {
    let rowElement = table.insertRow(column);
    matrix[column] = [];
    for (let row = 0; row < size; row++) {
      let cell = rowElement.insertCell(row);
      cell.dataset.mode = 'empty';
      cell.dataset.x = column;
      cell.dataset.y = row;
      matrix[column][row] = 0;
    }
  }
  // Добавляем браузерные события
  table.addEventListener('click', createWallCell);
  document.getElementById('tableBlock').appendChild(table);
  defaultStartFinishCells();
}
// Ставим старт и финиш в дефолтные места (в левом верхнем - старт, в правом нижнем - финиш)
function defaultStartFinishCells() {
  let size = document.getElementById('tableSize').value;
  start.x = 0;
  start.y = 0;
  finish.x = size - 1;
  finish.y = size - 1;
  document.getElementById('table').rows[start.y].cells[start.x].dataset.mode = 'start';
  document.getElementById('table').rows[finish.y].cells[finish.x].dataset.mode = 'finish';
}
// Функция для создания ячейки 'стена'
function createWallCell(x, y) {
  matrix[x][y] = 1;
  document.getElementById('table').rows[x].cells[y].dataset.mode = 'wall';
}
// Функция для создания пустой ячейки
function deleteCell(x, y) {
  matrix[x][y] = 0;
  document.getElementById('table').rows[x].cells[y].dataset.mode = 'empty';
}
// Функция установки стартовой и финишной клеток
function createStartFinishCells(event) {
  let cell = event.target;
  // Если флаг startSetted = false и она пуста, то нажатая ячейка отмечается стартовой, ее координаты записываются в start, флаг меняется
  if(!start_setted && cell.dataset.mode === 'empty') {
    cell.dataset.mode = 'start';
    start.x = parseInt(cell.dataset.y);
    start.y = parseInt(cell.dataset.x);
    startSetted = true;
  }
  // Если флаг startSetted = true после установки старта и она пуста, то нажатая ячейка отмечается финишной, ее координаты записываются в start, флаг меняется
  else if (startSetted && cell.dataset.mode === 'empty') {
    cell.dataset.mode = 'finish';
    finish.x = parseInt(cell.dataset.y);
    finish.y = parseInt(cell.dataset.x);
    table.removeEventListener('click', createStartFinishCells);
    table.addEventListener('click', set_wall_cell);
    // Врубаем кнопочки
    mazeButton.disabled  = false;
    algorithmButton.disabled = false;
    changeSize.disabled = false;
    setStartFinish.disabled = false;
  }
}
// Функция создания стены
function setWallCell(event) {
  const cell = event.target;
  const x = cell.dataset.x;
  const y = cell.dataset.y;
  const currentMode = cell.dataset.mode;
  // Если ни старт, ни финиш
  if (currentMode !== 'start' && currentMode !== 'finish') {
    // Если не стена - стена, если стена - не стена
    cell.dataset.mode = currentMode === 'wall' ? 'empty' : "wall";
    // Если значение 1, то стена, если ноль, то не стена
    matrix[x][y] = matrix[x][y] === 1 ? 0 : 1;
  }
}
async function aStar() {
  let count = 0;
  // Выключаем кнопочки
  mazeButton.disabled = true;
  algorithmButton.disabled = true;
  changeSize.disabled = true;
  setStartFinish.disabled = true;
  // Извлекаем размер
  let size = document.getElementById('tableSize').value;
  // Устанавливаем начальный и конечный узлы, если они еще не установлены
  if(start.x == null || start.y == null){
    start.x = 0;
    start.y = 0;
    table.rows[0].cells[0].dataset.mode = 'start';
  }
  if(finish.x == null || finish.y == null){
    finish.x = size - 1;
    finish.y = size - 1;
    table.rows[size - 1].cells[size - 1].dataset.mode = 'finish';
  }
  clear();
  let startNode = new Node();
  startNode.x = Number(start.x);
  startNode.y = Number(start.y);
  // Непроверенные клетки
  let empty = [];
  empty.push(startNode);
  // Проверенные клетки
  let checkedCells = [];
  if(count >= Math.floor(size / 10)){
    await new Promise(r => setTimeout(r, 100));
    count = 0;
  }
  count++;
  // Пока не проверены все доступные клетки
  while (empty.length > 0) {
    empty.sort(compare);
    const currentCell = empty.shift();
    checkedCells.push(currentCell);
    if (count >= Math.floor(size / 10)) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      count = 0;
    }
    count++;
    if (!(currentCell.x === start.x && currentCell.y === start.y) && !(currentCell.x === finish.x && currentCell.y === finish.y)) {
      document.getElementById('table').rows[currentCell.y].cells[currentCell.x].dataset.mode = 'checked';
    }
    // Если текущая клетка конечная
    if (currentCell.x === finish.x && currentCell.y === finish.y) {
      break;
    }
    // Если нет, то просматриваем соседей, вычисляем длину до начальной клетки, до конечной клетки
    const squareCoordinates = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    for (const [dx, dy] of squareCoordinates) {
      const updatedNeighbours = new Node();
      updatedNeighbours.x = currentCell.x + dx;
      updatedNeighbours.y = currentCell.y + dy;
      const checked = checkedCells.find((node) => node.x === updatedNeighbours.x && node.y === updatedNeighbours.y);
      const neighbour = empty.find((node) => node.x === updatedNeighbours.x && node.y === updatedNeighbours.y);
      if (updatedNeighbours.x >= 0 && updatedNeighbours.x < size && updatedNeighbours.y >= 0 && updatedNeighbours.y < size && matrix[updatedNeighbours.y][updatedNeighbours.x] === 0 && checked == null) {
        if (!(updatedNeighbours.x === finish.x && updatedNeighbours.y === finish.y)) {
          document.getElementById('table').rows[updatedNeighbours.y].cells[updatedNeighbours.x].dataset.mode = 'checking';
        }
        updatedNeighbours.lengthToStart = currentCell.lengthToStart + 1;
        updatedNeighbours.lengthToFinish = heuristic(updatedNeighbours, finish);
        updatedNeighbours.summaryLengths = updatedNeighbours.lengthToStart + updatedNeighbours.lengthToFinish;
        updatedNeighbours.parent = currentCell;
        if (neighbour == null) {
          empty.push(updatedNeighbours);
        }
        else if (neighbour.lengthToStart >= currentCell.lengthToStart + 1) {
          empty.splice(empty.indexOf(neighbour), 1, updatedNeighbours);
        }
      }
    }
  }
  mazeButton.disabled  = false;
  algorithmButton.disabled = false;
  changeSize.disabled = false;
  setStartFinish.disabled = false;
}
function heuristic(v, end) {
  return Math.abs(v.x - end.x) + Math.abs(v.y - end.y);
}
// Функция сравнения для сортировки списка непроверенных ячеек
function compare(a, b) {
  if (a.summaryLengths > b.summaryLengths) {
    return 1;
  }
  if (a.summaryLengths < b.summaryLengths) {
    return -1;
  }
  else {
    return 0;
  }
}