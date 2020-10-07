const form = document.querySelector('#task-form');
const taskInput = document.querySelector('#task');
const taskList = document.querySelector('.collection');
const filter = document.querySelector('#filter');
const clearBtn = document.querySelector('.clear-tasks');
// const remove = document.querySelectorAll('a');

loadAllEventListener();

function loadAllEventListener(){
    //DOM load event
    document.addEventListener('DOMContentLoaded', getTasks);
    //add task
    form.addEventListener('submit', addTask);
    //remove task
    taskList.addEventListener('click',removeTask);
    //clear all task
    clearBtn.addEventListener('click', clearTasks);
    //filter event
    filter.addEventListener('keyup', filterTask);
}

function getTasks(){
    let tasks;

    if(localStorage.getItem('tasks') === null){
        tasks = [];
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function(task){
        const li = document.createElement('li');

    li.className = 'collection-item';

    li.appendChild(document.createTextNode(task));

    const link = document.createElement('a');

    link.className = 'delete-item secondary-content';

    link.id = 'delete-item';

    link.innerHTML = "<i class='fa fa-remove'></i>";

    li.appendChild(link);

    taskList.appendChild(li);
    })    
}

function addTask(e){

    if(taskInput.value === '')
    {
        alert('Add a Task');
    }

    const li = document.createElement('li');

    li.className = 'collection-item';

    li.appendChild(document.createTextNode(taskInput.value));

    const link = document.createElement('a');

    link.className = 'delete-item secondary-content';

    link.id = 'delete-item';

    link.innerHTML = "<i class='fa fa-remove'></i>";

    li.appendChild(link);

    taskList.appendChild(li);

    storeTaskInLocalStorage(taskInput.value);

    taskInput.value = '';

    e.preventDefault();
}

function storeTaskInLocalStorage(task){
    let tasks;

    if(localStorage.getItem('tasks') === null){
        tasks = [];
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearTasks(e){

    // taskList.innerHTML = '';  method 1 (average)

    // taskList.remove();   method 2 (worst)

    // window.location.reload();

    while(taskList.firstChild){        //method 3 (best**)
        taskList.removeChild(taskList.firstChild);  
    }   

    localStorage.clear();

    e.preventDefault();
}

function removeTask(e){

    if(e.target.parentElement.classList.contains('delete-item'))
    {
        e.target.parentElement.parentElement.remove();
    }

    remaoveTaskFromLocalStorage(e.target.parentElement.parentElement);

    e.preventDefault();
}

function remaoveTaskFromLocalStorage(taskItem){
    let tasks;

    if(localStorage.getItem('tasks') === null){
        tasks = [];
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function(task, index){
        if(taskItem.textContent === task){
            tasks.splice(index,1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function filterTask(e){

    const text = e.target.value.toLowerCase();

    document.querySelectorAll('.collection-item').forEach(function(task){
        const item = task.firstChild.textContent;
        if(item.toLowerCase().indexOf(text) != -1){
            task.style.display = 'block';
        }else{
            task.style.display = 'none';
        }
    })   

    e.preventDefault();
}