Компонент MatchGame

Главный компонент игры на сопоставление свойств и опций.

Пример использования:

import MatchGame from "./components/MatchGame";

function App() {
return <MatchGame />;
}

Props:

MatchGame не принимает props. Все данные хранятся в состоянии внутри компонента.

Компонент Column

Колонка элементов (properties или options).

Props:

type – "properties" | "options".

connections – массив существующих соединений.

selected – текущий выбранный элемент.

isConnected – функция проверки, соединён ли элемент.

itemRefs – ref всех элементов для вычисления позиции.

onClickItem – обработчик клика.

onTouchItem – обработчик touch.

Компонент Lines

Отрисовывает соединительные линии между элементами.

Props:

linePositions – массив координат линий.

tempLine – временная линия для drag&drop.

onRemove – удаляет соединение.

Хуки

useConnections(containerRef, itemRefs) – управление соединениями и их позициями.

useSelection({...}) – обработка клика/тача и создание соединений.

useTempLine(selected, setSelected, connections, setConnections, containerRef) – управление временной линией drag&drop.

Сохранение в localStorage

saveConnections(connections) – сохраняет текущее состояние.

restoreConnections() – восстанавливает сохранённые соединения.

clearConnections() – очищает все соединения.
