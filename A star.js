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
  lengthToStart = 0;
  lengthToFinish = 0;
  summaryLengths = 0;
}
class coordinates {
  x = null;
  y = null;
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}
let start = new Node;
let finish = new Node;
let startSetted = false;
function setTable() {
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
}
setTable();
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
// Функция для очищения ячеек старта или финиша
function clearStartFinishCells() {
  // Извлекаем размер
  let size = document.getElementById('tableSize').value;
  for(let i = 0; i < size; i++) {
    for(let j = 0; j < size; j++) {
      let cell = document.getElementById('table').rows[i].cells[j];
      // Проверяем, установлена ли модификация start или finish, если да, делаем ячейку пустой
      if(cell.dataset.mode === 'start' || cell.dataset.mode === 'finish') {
        cell.dataset.mode = 'empty';
      }
    }
  }
}
// Функция установки стартовой и финишной клеток
function createStartFinishCells(event) {
  let cell = event.target;
  // Если флаг startSetted = false и она пуста, то нажатая ячейка отмечается стартовой, ее координаты записываются в start, флаг меняется
  if(!startSetted && cell.dataset.mode === 'empty') {
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
    table.addEventListener('click', setWallCell);
    // Врубаем кнопочки
    on();
  }
}
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
document.getElementById('tableSize').onclick = function(){setTable()};
// Оцениваем расстояние между данной ячейкой и конечной ячейкой
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
let c = 0;
async function aStar(message) {
  let count = 0;
  // Выключаем кнопочки
  off()
  // Извлекаем размер
  let size = document.getElementById('tableSize').value;
  let startNode = new Node();
  startNode.x = Number(start.x);
  startNode.y = Number(start.y);
  // Непроверенные клетки
  let empty = [];
  empty.push(startNode);
  // Проверенные клетки
  let checkedCells = [];
  let currentCell = new Node();
  count++;
  // Пока не проверены все доступные клетки
  while (empty.length > 0) {
    empty.sort(compare);
    // Установка текущей клетки
    currentCell = empty[0];
    empty.splice(empty.indexOf(currentCell), 1);
    checkedCells.push(currentCell);
    if (count >= Math.floor(size / 10)) {
      await new Promise(r => setTimeout(r, 100));
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
    let squareCoordinates = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    for (let coordinate of squareCoordinates) {
      let updatedNeighbours = new Node();
      updatedNeighbours.x = currentCell.x + coordinate[0];
      updatedNeighbours.y = currentCell.y + coordinate[1];
      // Проверка соседей
      let checked = checkedCells.find(node => (node.x === updatedNeighbours.x && node.y === updatedNeighbours.y));
      let neighbour = empty.find(node => (node.x === updatedNeighbours.x && node.y === updatedNeighbours.y));
      if ((updatedNeighbours.x >= 0 && updatedNeighbours.x < size && updatedNeighbours.y >= 0 && updatedNeighbours.y < size) && matrix[updatedNeighbours.y][updatedNeighbours.x] === 0 && checked == null) {
        if (neighbour == null) {
          if (!(updatedNeighbours.x === finish.x && updatedNeighbours.y === finish.y)) {
            table.rows[updatedNeighbours.y].cells[updatedNeighbours.x].dataset.mode = 'checking';
          }
          updatedNeighbours.lengthToStart = currentCell.lengthToStart + 1;
          updatedNeighbours.lengthToFinish = heuristic(updatedNeighbours, finish);
          updatedNeighbours.summaryLengths = updatedNeighbours.lengthToStart + updatedNeighbours.lengthToFinish;
          updatedNeighbours.parent = currentCell;
          empty.push(updatedNeighbours);
        }
        else {
          if (neighbour.lengthToStart >= currentCell.lengthToStart + 1) {
            empty[empty.indexOf(neighbour)].lengthToStart = currentCell.lengthToStart + 1;
            empty[empty.indexOf(neighbour)].parent = currentCell;
          }
        }
      }
    }
  }
  // Отрисовка пути
  if (!(currentCell.x === finish.x && currentCell.y === finish.y)){
    alert("Не могу найти путь");
  }
  if (currentCell.x === finish.x && currentCell.y === finish.y) {
    for(;currentCell.parent != null; currentCell = currentCell.parent) {
      if(count >= Math.floor(size / 10)){
        await new Promise(r => setTimeout(r, 100));
        count = 0;
      }
      count++;
      if (!(currentCell.x === finish.x && currentCell.y === finish.y)) {
        document.getElementById('table').rows[currentCell.y].cells[currentCell.x].dataset.mode = 'path';
        c++;
      }
    }
  }
  alert("Длина пути: " + c);
  on();
}
document.getElementById('aStar').onclick = function (){aStar().then(r => (r))};

function setStartFinishCells() {
  clear();
  off();
  let table = document.getElementById('table');
  table.removeEventListener('click', setWallCell);
  clearStartFinishCells();
  startSetted = false;
  table.addEventListener('click', createStartFinishCells);
}
document.getElementById('createStartFinish').onclick = function() {setStartFinishCells()};
// Очистка
function clear() {
  let size = document.getElementById('tableSize').value;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let cell = document.getElementById('table').rows[j].cells[i];
      cell.dataset.mode = (cell.dataset.mode === 'path' || cell.dataset.mode === 'checked' || cell.dataset.mode === 'checking') ? 'empty' : cell.dataset.mode;
    }
  }
}
// Алгоритм создания лабиринта с помощью алгоритма поиска в глубину.
function maze() {
  off();
  // Извлекаем размер
  const size = document.getElementById('tableSize').value;
  // Запоплняем лабиринт стенами
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      createWallCell(i, j);
    }
  }
  // Рандомно выбираем начальную клетку в диапазоне четных чисел 0 - size - 1
  const cell = new coordinates(Math.floor((Math.random() * (size / 2))) * 2, Math.floor((Math.random() * (size / 2))) * 2);
  // Удаляем стены, чтобы сохдать вход в лабиринт
  deleteCell(cell.x, cell.y);
  const entered = Array.from({ length: size }, () => Array.from({ length: size }, () => false));
  entered[cell.x][cell.y] = true;
  const checked = [];
  if (cell.y - 2 >= 0) {
    checked.push(new coordinates(cell.x, cell.y - 2));
    entered[cell.x][cell.y - 2] = true;
  }
  if (cell.y + 2 < size) {
    checked.push(new coordinates(cell.x, cell.y + 2));
    entered[cell.x][cell.y + 2] = true;
  }
  if (cell.x - 2 >= 0) {
    checked.push(new coordinates(cell.x - 2, cell.y));
    entered[cell.x - 2][cell.y] = true;
  }
  if (cell.x + 2 < size) {
    checked.push(new coordinates(cell.x + 2, cell.y));
    entered[cell.x + 2][cell.y] = true;
  }
  while (checked.length > 0) {
    const index = Math.floor(Math.random() * checked.length);
    const x = checked[index].x;
    const y = checked[index].y;
    deleteCell(x, y);
    checked.splice(index, 1);
    let directions = ["up", "down", "left", "right"];
    let b = false;
    // Если возможно удалить стену в одном из четырех направлений, убираем
    while (directions.length > 0 && !b) {
      const directionIndex = Math.floor(Math.random() * directions.length);
      const direction = directions[directionIndex];
      switch (direction) {
        case "up":
          if (y - 2 >= 0 && matrix[x][y - 2] === 0) {
            deleteCell(x, y - 1);
            b = true;
          }
          break;
        case "down":
          if (y + 2 < size && matrix[x][y + 2] === 0) {
            deleteCell(x, y + 1);
            b = true;
          }
          break;
        case "left":
          if (x - 2 >= 0 && matrix[x - 2][y] === 0) {
            deleteCell(x - 1, y);
            b = true;
          }
          break;
        case "right":
          if (x + 2 < size && matrix[x + 2][y] === 0) {
            deleteCell(x + 1, y);
            b = true;
          }
          break;
      }
      directions.splice(directionIndex, 1);
    }
    if (y - 2 >= 0 && matrix[x][y - 2] !== 0 && !entered[x][y - 2]) {
      checked.push(new coordinates(x, y - 2));
      entered[x][y - 2] = true;
    }
    if (y + 2 < size && matrix[x][y + 2] !== 0 && !entered[x][y + 2]) {
      checked.push(new coordinates(x, y + 2));
      entered[x][y + 2] = true;
    }
    if (x - 2 >= 0 && matrix[x - 2][y] !== 0 && !entered[x - 2][y]) {
      checked.push(new coordinates(x - 2, y));
      entered[x - 2][y] = true;
    }
    if (x + 2 < size && matrix[x + 2][y] !== 0 && !entered[x + 2][y]) {
      checked.push(new coordinates(x + 2, y));
      entered[x + 2][y] = true;
    }
  }
  on();
}
function off(){
  mazeButton.disabled = true;
  algorithmButton.disabled = true;
  changeSize.disabled = true;
  setStartFinish.disabled = true;
}
function on(){
  mazeButton.disabled  = false;
  algorithmButton.disabled = false;
  changeSize.disabled = false;
  setStartFinish.disabled = false;
}
document.getElementById('reload').onclick = function(){location.reload()};
document.getElementById('mazeButton').onclick = function(){maze()};


