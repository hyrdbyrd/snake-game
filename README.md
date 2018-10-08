# Snake-game
Игра написана на javascript, с использованием canvas.
## Поиграться можно тут 
[project/public/index.html](https://ilya777grin23.github.io/snake-game/public)
## Для управления
На клавишах:
* W, ArrowUp - вверх.
* L, ArrowLeft -  влево.
* S, ArrowDown - вниз.
* R, ArrowRight -  вправо.
На сенсоре:
* Слайд вверх - вверх.
* Слайд влево - влево.
* Слайд вниз - вниз.
* Слайд вправо - вправо. 
## Зачем сервер?
Для того чтобы можно было по локальному ip, поиграться :)
## Сущности
1. class SnakeGame - конструктор всей игры
1. Object metrika - хранит в себе данные, для задачи размеров блоков и размер холста.
1. Object snake - змейка, у которой есть информация о положении, и жива ли она. Также у неё есть метод - идти вперед.
1. Int4[\][] matrix - матрица, в которой храняться положения объектов (пустота, тело змеи, голова змеи, яблоко), размером 20 на 20.
1. Element canv, CanvasContext ctx - canvas и его контекст (в данном случае - 2d).
1. showScore undef () - сообщает конечный результат (очки).
1. appleGen Int4[\][] () - генерирует случайное положение для яблока.
1. init undef () - инициирует все действия.
1. eventsInit undef ()  - создает события нажатия клавишь.
1. update undef () - создает бесконечный фрейм (до тех пор, пока змейка жива).
1. draw undef () - отрисовывает всю матрицу.
1. drawFraction Int4 () - рисует конкретный блок (используется в методе draw).