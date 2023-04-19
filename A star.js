const n = 5; // Задаем размер квадратной карты

for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        const square = document.createElement('div'); // Создаем элемент-квадрат
        square.classList.add('square'); // Добавляем класс "square" для применения стилей
        document.body.appendChild(square); // Добавляем квадрат на страницу
    }

}