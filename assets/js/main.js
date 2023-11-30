const todos = [] //data-data Todo user.
// Custom Event dengan nama 'render-todo'. sebagai patokan perubahan data todos
const RENDER_EVENT = 'render-todo'

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('form')
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault()
        addTodo()
    })
})

function addTodo() {
    const textTodo = document.getElementById('title').value
    const timestamp = document.getElementById('date').value

    const generateID = generateId()
    const todoObject = generateTodoObject(generateID, textTodo, timestamp, false)
    todos.push(todoObject)

    document.dispatchEvent(new Event(RENDER_EVENT)) //untuk me-render data yang telah disimpan pada array todos.
}

function generateId() {
    return +new Date()
}

// membuat object baru dari data yang sudah disediakan dari inputan
function generateTodoObject(id, task, timeStamp,isCompleted) {
    return {
        id, task, timeStamp, isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function() {
    // console.log(todos)
    const uncompletedTODOList = document.getElementById('todos')
    uncompletedTODOList.innerHTML = ''

    const completedTODOList = document.getElementById('completed-todos')
    completedTODOList.innerHTML = ''

    for(const todoItem of todos) {
        const todoElement = makeTodo(todoItem) 
        if (!todoItem.isCompleted)
            uncompletedTODOList.append(todoElement)
        else 
            completedTODOList.append(todoElement)
    }

    console.log(uncompletedTODOList)
})

function makeTodo(todoObject) {
    const textTitle = document.createElement('h2')
    textTitle.innerText = todoObject.task

    const textTimestamp = document.createElement('p')
    textTimestamp.innerText = todoObject.timeStamp

    const textContainer = document.createElement('div')
    textContainer.classList.add('inner') //nambah class inner
    textContainer.append(textTitle, textTimestamp)

    const container = document.createElement('div')
    container.classList.add('item', 'shadow')
    container.append(textContainer)
    container.setAttribute('id', `todo-${todoObject.id}`)
    
    if(todoObject.isCompleted){
        const undoButton = document.createElement('button')
        undoButton.classList.add('undo-button')

        undoButton.addEventListener('click', function() {
            undoTaskFromComplated(todoObject.id)
        })

        const trashButton = document.createElement('button')
        trashButton.classList.add('trash-button')
        trashButton.addEventListener('click', function() {
            removeTaskFromComplated(todoObject.id)
        })

        container.append(undoButton, trashButton)
    } else {
        const checkButton = document.createElement('button')
        checkButton.classList.add('check-button')
        checkButton.addEventListener('click', function(){
            addTaskToCompleted(todoObject.id)
        })
        container.append(checkButton)
    }

    return container
}

function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId)

    if(todoTarget == null) return

    todoTarget.isCompleted = true
    document.dispatchEvent(new Event(RENDER_EVENT))
}

function findTodo(todoId) { //untuk mencari todo dengan ID yang sesuai pada array todos
    for(const todoItem of todos){
        if(todoItem.id == todoId){
            return todoItem
        }
    }
    return null
}

// hepus list, hapus dngn fungsi splice()
function removeTaskFromComplated(todoId){
    const todoTarget = findTodoIndex(todoId)
    if(todoTarget === -1) return

    todos.splice(todoTarget, 1)
    document.dispatchEvent(new Event(RENDER_EVENT))
}

// ubah ke belum selesai
function undoTaskFromComplated(todoId){
    // ini gk jaln, kode dicoding
    // const todoTarget = findTodoIndex(todoId)
    // if(todoTarget === null) return

    const todoTargetIndex = findTodoIndex(todoId);
    if (todoTargetIndex === -1) return;
    // Mengakses elemen pada array menggunakan indeks
    const todoTarget = todos[todoTargetIndex];

    todoTarget.isCompleted = false
    document.dispatchEvent(new Event(RENDER_EVENT))
}

function findTodoIndex(todoId) {
    for(const index in todos) {
        if (todos[index].id == todoId) {
            return index
        }
    }
    return -1;
}