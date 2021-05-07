class Sudoku {
    constructor(initString = '000000000000000000000000000000000000000000000000000000000000000000000000000000000') {
        const startValues = initString
            .split('')
            .filter(x => '0123456789'.includes(x))
            .map(x => Number(x))

        this.body = []

        let idCounter = 1
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                this.body.push({
                    id: idCounter,
                    x,
                    y,
                    number: startValues[idCounter - 1],
                    selected: false,
                    supported: false,
                    important: false,
                    error: false,
                    started: startValues[idCounter - 1] === 0 ? false : true,
                    s: parseInt(y / 3) *3 + parseInt(x / 3),
                })
                idCounter++
            }
        }
    }


    // Функция getRow() предназначена для создания массива из ячеек строки
    // ========================================================
    // Описание переменных функции
    // ---------------------------
    // Формальные параметры функции
    // n: номер строки (int)
    // Локальные переменные
    // i: параметр цикла (for)
    // row: массив ячеек одной строки (list)
    // --------------------------
    // Результат работы функции
    // row: массив ячеек одной строки (list)
    getRow (n) {
        const row = []

        for (let i = 0; i < 9; i++) {
            row.push(this.body[9 * n + i])
        }

        return row
    }


    // Функция getColumn() предназначена для создания массива из ячеек столбца
    // ========================================================
    // Описание переменных функции
    // ---------------------------
    // Формальные параметры функции
    // n: номер колонки (int)
    // Локальные переменные
    // column: массив ячеек одной колонки (list)
    // i: параметр цикла (for)
    // --------------------------
    // Результат работы функции
    // column: массив ячеек одной колонки (list)
    getColumn (n) {
        const column = []

        for (let i = 0; i < 9; i++) {
            column.push(this.body[9 * i + n])
        }

        return column
    }


    // Функция getSegment() предназначена для создания массива из ячеек сегмента
    // ========================================================
    // Описание переменных функции
    // ---------------------------
    // Формальные параметры функции
    // n: номер сегмента (int)
    // Локальные переменные
    // segment: массив ячеек одного сегмента (list)
    // dx: параметр цикла (for)
    // dy: параметр цикла (for)
    // --------------------------
    // Результат работы функции
    // segment: массив ячеек одного сегмента (list)
    getSegment (n) {
        const segment = []

        const x = n % 3
        const y = parseInt(n / 3)

        for (let dy = 0; dy < 3; dy++) {
            for (let dx = 0; dx < 3; dx++) {
                segment.push(this.body[
                    y * 27 + dy * 9 + x * 3 + dx
                ])
            }
        }

        return segment
    }

    // Функция keydownHandler() предназначена для изменения параметров ячеек при введения значения в ячейку
    // ========================================================
    // Описание переменных функции
    // ---------------------------
    // Формальные параметры функции
    // event: событие (obj)
    // cell: ячейка судоку (obj)
    // Локальные переменные
    // item: параметр цикла (for)
    // --------------------------
    // Результат работы функции
    // изменение параметров ячеек
    keydownHandler(event, cell){
        event.preventDefault()
        if (!cell.started){
            if ('123456789'.includes(event.key)) {
                cell.number = parseInt(event.key)
                
                if (cell.error) {
                    for (const item of this.body) {
                        item.error = false
                    }
                }

                for (const item of this.getRow(cell.y)){
                    if (cell === item) {
                        continue
                    }

                    if (item.number === cell.number) {
                        item.error = true
                        cell.error = true
                    }
                }
                
                for (const item of this.getColumn(cell.x)){
                    if (cell === item) {
                        continue
                    }

                    if (item.number === cell.number) {
                        item.error = true
                        cell.error = true
                    }
                }

                for (const item of this.getSegment(cell.s)){
                    if (cell === item) {
                        continue
                    }

                    if (item.number === cell.number) {

                        item.error = true
                        cell.error = true
                    }
                }
            }
    
            else if (['Backspace', 'Delete'].includes(event.key)) {
                cell.number = 0
            }
        }

        for (const item of this.body) {
            item.important = false
        }
        
        if (cell.number) {
            for (const item of this.body) {
                if (item.number === cell.number) {
                    item.important = true
                }
            }
        }
        
        this.viewUpdate()
        this.check()
    }


    // Функция focusHandler() предназначена для обработки ячеек при фокусировке
    // ========================================================
    // Описание переменных функции
    // ---------------------------
    // Локальные переменные
    // item: параметр цикла (for)
    //Формальные параметры функции
    // event: событие (obj)
    // cell: ячейка судоку (obj)
    // --------------------------
    // Результат работы функции
    // изменение параметров ячеек 
    focusHandler(event, cell) {
        event.preventDefault()
        cell.selected = true

        for (const item of this.getRow(cell.y)){
            item.supported = true
        }

        for (const item of this.getColumn(cell.x)){
            item.supported = true
        }

        if (cell.number) {
            for (const item of this.body) {
                if (item.number === cell.number) {
                    item.important = true
                }
            }
        } 

        this.viewUpdate()
    }

    // Функция blurHandler() предназначена для обработки события после потери фокуса у элемента
    // ========================================================
    // Описание переменных функции
    // ---------------------------
    //Формальные параметры функции
    // event: событие (obj)
    // cell: ячейка судоку (obj)
    // Локальные переменные
    // item: параметр цикла (for)
    // --------------------------
    // Результат работы функции
    // изменение параметров ячеек
    blurHandler(event, cell) {
        event.preventDefault()
        cell.selected = false

        if (cell.error) {
            cell.number = 0
        }

        for (const item of this.body) {
            item.important = false
            item.supported = false
            item.error = false
        }

        this.viewUpdate()
    }

    // Функция getHTML() предназначена для построения сетки судоку
    // ========================================================
    // Описание переменных функции
    // ---------------------------
    // Формальные параметры функции
    // size: размер доски судоку (int)
    // Локальные переменные
    // cell: параметр цикла (for)
    // --------------------------
    // Результат работы функции
    // построение DOM-элементов об окончании иры
    getHTML (size) {
        for (const cell of this.body) {
            const inputElement = document.createElement('input')
            inputElement.classList.add('sudoku-cell')
            inputElement.setAttribute('type', 'text')

            // отслеживание действий пользователя
            inputElement.addEventListener('keydown', event => this.keydownHandler(event, cell))
            inputElement.addEventListener('focus', event => this.focusHandler(event, cell))
            inputElement.addEventListener('blur', event => this.blurHandler(event, cell))

            if (cell.started) {
                inputElement.classList.add('start-cell')
                inputElement.setAttribute('readonly','readonly')
            }

            cell.element = inputElement
        }


        const rootElement = document.createElement("div")
        rootElement.classList.add("sudoku-game")
        rootElement.style.width = `${size}px`
        rootElement.style.height = `${size}px`
        rootElement.style["font-size"] = `${size / 20}px`

        for (let s = 0; s < 9; s++) {
            const segmentElement = document.createElement('div')
            segmentElement.classList.add('sudoku-segment')

            for (const cell of this.getSegment(s)) {
                segmentElement.append(cell.element)
            }

            rootElement.append(segmentElement)
        }
        this.viewUpdate()

        return rootElement
    }

    // Функция cviewUpdate() предназначена для обновления содержиого экрана
    // ========================================================
    // Описание переменных функции
    // ---------------------------
    // Локальные переменные
    // cell: параметр цикла (for)
    // --------------------------
    // Результат работы функции
    // обновление стилей элементов
    viewUpdate() {
        for (const cell of this.body) {
            cell.element.classList.remove('error', 'important-cell', 'supported-cell', 'selected-cell')
            cell.element.value = cell.number ? cell.number : ''

            if (cell.supported) {
                cell.element.classList.add('supported-cell')
            }
    
            if (cell.selected) {
                cell.element.classList.add('selected-cell')
            }

            if (cell.important) {
                cell.element.classList.add('important-cell')
            }

            if (cell.error) {
                cell.element.classList.add('error')
            }
        }
    }


    // Функция check() предназначена для проверки окончания иры
    // ========================================================
    // Описание переменных функции
    // ---------------------------
    // Локальные переменные
    // count: счетчик правильно заполненных ячеек (int)
    // cell: параметр цикла (for)
    // --------------------------
    // Результат работы функции
    // построение DOM-элементов об окончании иры

    check() {
        let count = 0
        for (const cell of this.body) {
            if (cell.error === false && cell.number != 0) {
                count++
            }
        }

        if (count === 81) {
           document.querySelector('.modal-wrapper').style.display = "flex"
        }
    }
}



