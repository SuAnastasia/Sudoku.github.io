document.addEventListener("DOMContentLoaded", () => {
    let button = document.querySelector('.dif-level_button')
    let select = document.querySelector('.dif-level_select')
    let modalButton = document.querySelector('.modal-box_button')

    let w = Sudoku.generate(select.value)
    let app = document.querySelector('#app')
    app.append(w.getHTML(550))
    
    button.addEventListener('click', (event) => {
        event.preventDefault()
        w = Sudoku.generate(select.value)
        
        app.innerHTML = ''
        app.append(w.getHTML(550))
    })
    
    modalButton.addEventListener('click', () => {
        document.querySelector('.modal-wrapper').style.display = "none"

        w = Sudoku.generate(select.value)

        app.innerHTML = ''
        app.append(w.getHTML(550))
    })
})










