
let currentDraggedElement ;
let todosTasksNumber =0;
let doneTasksNumber =0;
let feedbackTasksNumber =0;
let progressTasksNumber =0;
let urgentTasksNumber =0;
let priority_selected = "empty";
let loggedUserName = [];
let filteredTasks = [];
let isSelectOpen =false;
let selectedNames=[];
let selectedNamesTasks =[];
let selectNamesWithoutSpaceTasks =[];
let wasMenuOpen_board = false;
let wasMenuOpen_task = false;
let wasCategoryOpen_board = false;
let prioTask = '';

async function init_board() {
    setURL('https://join.russell-tchamba.de/smallest_backend_ever');
    await downloadFromServer();
    await loadUser();
    await loadTask(); 
    await loadContacts();
    await loadCategory();
    filteredTasks = tasks;
    updateHTML();
}

async function init_summary() {
    setURL('https://join.russell-tchamba.de/smallest_backend_ever');
    await downloadFromServer();
    await loadUser();
    await loadTask(); 
    loadUserName();
    dashboard();
}

async function loadUser(){
    users = await JSON.parse(backend.getItem('users')) || [];
    guests = await JSON.parse(backend.getItem('guests')) || [];    
}

async function loadContacts() {
    contacts = await JSON.parse(backend.getItem('contacts')) || [];
}

async function loadCategory() {
    categories = await backend.getItem('categories') || [];
}

async function saveCategory() {
    await backend.setItem('categories', categories);    
}
/**
 * This function delete a tasks from the server
 */
function deleteTasks(id) {
    for (let i = 0; i < tasks.length; i++) {
        const element = tasks[i];
        if(element['id']== id){
            tasks.splice(i,1);
        }     
    } 
    
    saveTask();
    updateHTML();
}

function openNav() { 
    if(document.body.clientWidth < 950){
        document.getElementById('board-body').classList.add('d-none');
        document.getElementById('footerBoard').classList.add('d-none');
        document.getElementById("myNav").style.width = "100%";
    }
    else if(document.body.clientWidth >= 950 && document.body.clientWidth < 1200){
        document.getElementById("myNav").style.width = "50%";
    }else{document.getElementById("myNav").style.width = "45%";

    }
    document.getElementById("board-body").style.opacity = "0.5";
    document.getElementById("board-body").style.pointerEvents = 'none';  
           
}
  
function closeNav() {
    document.getElementById('board-body').classList.remove('d-none');
    document.getElementById('footerBoard').classList.remove('d-none');
    document.getElementById("myNav").style.width = "0%";
    document.getElementById("board-body").style.opacity = "1";
    document.getElementById("board-body").style.pointerEvents = 'auto';
    resetAssignedUsers();
}

async function loadTask() {
    tasks = await backend.getItem('tasks') || [];
}

function allowDrop(ev) {
    ev.preventDefault();    
}

function moveTo(state){
    tasks[currentDraggedElement]['state'] = state;
    saveTask();
    updateHTML();
}

  function highlight(id){
    document.getElementById(id).classList.add('hightlight-drag-area');

  }

  function removehighlight(){
    document.getElementById('alltasks_todo').classList.remove('hightlight-drag-area');
    document.getElementById('alltasks_progress').classList.remove('hightlight-drag-area');
    document.getElementById('alltasks_feedback').classList.remove('hightlight-drag-area');
    document.getElementById('alltasks_done').classList.remove('hightlight-drag-area');
  }

   function updateHTML(){
    /* deleteTasks(); */
    updateTodoHTML();
    updateProgressHTML();
    updateFeedbackHTML();
    updateDoneHTML();   
  }

  function handlerFilteredTasks(){
    let search = document.getElementById('inputTask').value;
    search = search.toLowerCase();
    if(search.length == 0){
        filteredTasks = tasks;
    }        
    else{
        filteredTasks = tasks.filter( t => String(t.title).toLowerCase().startsWith(search) || String(t.description).toLowerCase().startsWith(search));
    }
    updateHTML();        
  }

  function updateTodoHTML(){
    let status = 'todo';
    let todos = filteredTasks.filter(t => t['state'] == 'todo');
    document.getElementById('alltasks_todo').innerHTML = '';
    for (let index = 0; index < todos.length; index++) {
        const element = todos[index];
        document.getElementById('alltasks_todo').innerHTML += generateTasksHTML(element, status);
        progressBarHTML(element);           
    }
    assignedUserHTML(todos);      
}

  function updateProgressHTML(){
    let status = 'progress';
    let progresses = filteredTasks.filter(t => t['state'] == 'progress');
    document.getElementById('alltasks_progress').innerHTML = '';
    for (let index = 0; index < progresses.length; index++) {
        const element = progresses[index];
        document.getElementById('alltasks_progress').innerHTML += generateTasksHTML(element, status);        
    }
    assignedUserHTML(progresses);    
}

function updateFeedbackHTML(){
    let status = 'feedback';
    let feedbacks = filteredTasks.filter(t => t['state'] == 'feedback');
    document.getElementById('alltasks_feedback').innerHTML = '';
    for (let index = 0; index < feedbacks.length; index++) {
        const element = feedbacks[index];
        document.getElementById('alltasks_feedback').innerHTML += generateTasksHTML(element, status);              
    }
    assignedUserHTML(feedbacks);    
}

function updateDoneHTML(){
    let status = 'done';
    let dones = filteredTasks.filter(t => t['state'] == 'done');
    document.getElementById('alltasks_done').innerHTML = '';
    for (let index = 0; index < dones.length; index++) {
        const element = dones[index];
        document.getElementById('alltasks_done').innerHTML += generateTasksHTML(element, status );
        progressBarHTML(element);       
    }
    assignedUserHTML(dones);   
}

function startDragging(id){
    for (let i = 0; i < tasks.length; i++) {
        const element = tasks[i];
        if(element['id'] == id){
            currentDraggedElement = i;
            break;
        }     
    }      
}

function generateTasksHTML(element, status ){
    let urlImg;
    let className;
    if(element['priority']=='low'){
        urlImg = "./assets/img/green_arrow.png";
    }
    if(element['priority']=='high'){
        urlImg = "./assets/img/red_arrow.png";
    }
    if(element['priority']=='middle'){
        urlImg = "./assets/img/medium.png";
    }
    if (status == 'feedback'){
        className = "feedbackTaskCard-name";
    }
    if (status == 'done'){
        className = "doneTaskCard-name";
    }
    if (status == 'todo'){
        className = "todosTaskCard-name";
    }
    if (status == 'progress'){
        className = "inProgressTaskCard-name";
    }

    return /*html*/ `
    <div class="doneTask_1" >
                <div class="doneTaskCard-child" >
                    <div class="doneTaskCard" onclick="popCardOver(${element['id']})" draggable="true" ondragstart="startDragging(${element['id']})">
                        <div class=${className}><span class="doneTaskCard-text">${element['category']}</span></div>
                        <div class="taskCard-title">
                            <div class="taskCard-description">
                                <span class="taskCard-description-title">${element['title']}</span>
                                <span class="taskCard-description-text">${element['description']}</span>
                            </div>
                            <div id="progressBar_${element['id']}" class= "progressBar">
                                <!-- <img src="./assets/img/progressbar.png" alt="">
                                <span id="doneNumber">3/3 Done</span> -->
                
                            </div>

                            <div class="user-priority">
                                <div id="user-id_${element['id']}" class="abbreviations">                               

                                </div>
                                <div class="taskPriority">                                   
                                     <img id="taskPriority-img" src=${urlImg} alt=""> 
                                </div>

                            </div>
                            
                        </div>
    
                    </div>
                    <div id="deleteTrash" class="trash-style" onclick="deleteTasks(${element['id']})">
                            <img src="/assets/img/biggarbagebin_121980.png" alt="">
                    </div> 
                </div>
                
                
            </div>


    `;
}

function assignedUserHTML(element){  
   for (let index = 0; index < element.length; index++) {
    const names = element[index]['selectContacts'];
    const id = element[index]['id'];     
        let assignedUser = names;
        let ShortName ;
        for (let j = 0; j < assignedUser.length; j++) {
            const userFullName = assignedUser[j];
            const indexSpace = userFullName.indexOf(' ') ; 
            if (indexSpace == -1) {
                 ShortName = userFullName.charAt(0) + userFullName.slice(-1);               
            }else {
                 ShortName = userFullName.charAt(0) + userFullName.charAt(indexSpace+1); 
            }                   
            document.getElementById('user-id_'+ id).innerHTML += /*html*/`
            <div class="user-id-child_1" > <span class="userName" >${ShortName.toUpperCase()}</span> </div>       
            `;           
        }       
    }
}

function progressBarHTML(element){
    const id = element['id'];
    document.getElementById('progressBar_'+ id).innerHTML = /*html*/`
    <img src="./assets/img/progressbar.png" alt="">
    <span id="doneNumber">3/3 Done</span>       
    `;
}

function generateTasksStatusHTML(element){
    let urlImg;
    if(element['priority']=='low'){
        urlImg = "./assets/img/green_arrow.png";
    }
    if(element['priority']=='high'){
        urlImg = "./assets/img/red_arrow.png";
    }
    if(element['priority']=='middle'){
        urlImg = "./assets/img/medium.png";
    }

    return /*html*/ `
    <div class="feedbackTask_1" draggable="true" ondragstart="startDragging(${element['id']})">
        <div id="feedbackTaskCard">
        <div id="feedbackTaskCard-name"><span id="feedbackTaskCard-text">${element['category']}</span></div>
        <div class="taskCard-title">
            <div class="taskCard-description">
                <span class="taskCard-description-title">${element['title']}</span>
                <span class="taskCard-description-text">${element['description']}</span>
            </div>
            <div id="user-priority">
                <div id="user-id-pf__${element['id']}">

                </div>
                <div class="taskPriority"> <img id="taskPriority-img" src= ${urlImg} alt=""> </div>
            </div>
        </div>
                
    </div>


    `;
}

function dashboard(){   
    if(loggedUserName[0]=='guest'){
        document.getElementById('greeting-child').innerHTML =`Good morning`;
    }else{
        document.getElementById('greeting-child').innerHTML =`Good morning <b id="greet"> ${loggedUserName} </b> `;
    }    
    document.getElementById('dashboard').innerHTML =generateDashboardHTML() ;
}

function openBoard(){
    window.open('board.html', "_self");
}

function generateDashboardHTML(){
    progressTasksNumber=tasks.filter(t => t['state'] == 'progress');
    todosTasksNumber=tasks.filter(t => t['state'] == 'todo');
    feedbackTasksNumber=tasks.filter(t => t['state'] == 'feedback');
    doneTasksNumber=tasks.filter(t => t['state'] == 'done');
    urgentTasksNumber=tasks.filter(t => t['priority'] == 'high');

    return /*html*/ `
     <div id="dashboard-child1">
            <div id="dashboard-child11" onclick="openBoard()">
                <div id="urgent-dashboard">
                   <div id="urgent-dashboard-child">
                        <img id="urgent-img" src="./assets/img/urgent.png" alt="">
                        <span id="urgentTasksNumber">${urgentTasksNumber.length}</span>
                   </div>                    
                    <span class="urgent-text">Tasks Urgent</span>
                </div>
                <div id="urgent-dashboard-child2">
                    <span id="urgent-date">October 16, 2022</span>
                    <span id="date-text">Upcoming Deadline</span> 
                </div>
            </div>
            <div id="dashboard-child12" onclick="openBoard()">
                <div id="todos-dashboard">
                    <div id="todos-dashboard-child">
                         <img id="todos-img" src="./assets/img/board.png" alt="">
                         <span id="todosTasksNumber">${todosTasksNumber.length}</span>
                    </div>                     
                     <span id="todos-text">Tasks To-do</span>
                </div>
            </div>
        </div>
        <div id="dashboard-child2">
            <div id="dashboard-child21" onclick="openBoard()">
                <div class="dashboard-child2-all">
                     <div id="board-dashboard-child" class="dashboard-child2x">
                        <img id="board-img" src="./assets/img/board.png" alt="">
                        <span id="boardTasksNumber" class="tasksNumber">${tasks.length}</span>
                    </div> 
                
                    <span id="board-text">Tasks in Board</span>
                </div>
            </div>
            <div id="dashboard-child22" onclick="openBoard()">
                <div class="dashboard-child2-all">
                    <div id="progress-dashboard-child" class="dashboard-child2x">
                        <img id="progress-img" src="./assets/img/progress.png" alt="">
                        <span id="progressTasksNumber" class="tasksNumber">${progressTasksNumber.length}</span>
                    </div> 
                    
                    <span id="progress-text">Tasks in Progress</span>
                </div>

            </div>

            <div id="dashboard-child23" onclick="openBoard()">
                <div class="dashboard-child2-all">
                    <div id="feedback-dashboard-child" class="dashboard-child2x">
                        <img id="feedback-img" src="./assets/img/feedback.png" alt="">
                        <span id="feedbackTasksNumber" class="tasksNumber">${feedbackTasksNumber.length}</span>
                    </div> 
                    
                    <span id="feedback-text">Awaiting Feedback</span>
                </div>
            </div>
            <div id="dashboard-child24" onclick="openBoard()">
                <div class="dashboard-child2-all">
                    <div id="done-dashboard-child" class="dashboard-child2x">
                        
                        <img id="done-img" src="./assets/img/done.png" alt="">
                        <span id="doneTasksNumber" class="tasksNumber">${doneTasksNumber.length}</span>
                    </div>                     
                    <span id="done-text">Tasks Done</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * This function load the user name from the local storage
 */
 function loadUserName(){
    let loggedUserNameAsText = localStorage.getItem('Name');
    /* let test=localStorage.getItem('Mail'); */
    if(loggedUserNameAsText){
        loggedUserName = JSON.parse(loggedUserNameAsText);
    }else{
        loggedUserName[0] = 'guest';
    }
}

async function saveTask() {
    await backend.setItem('tasks', tasks);    
}

window.onscroll = function() {
    if(document.body.clientWidth < 738){
        document.getElementById('board-body').classList.add('d-none');
        document.getElementById('footerBoard').classList.add('d-none');
    }else{
        document.getElementById('board-body').classList.remove('d-none');
        document.getElementById('footerBoard').classList.remove('d-none');
    }
};

async function generateOverlay(state){
    
    document.getElementById("myNav").innerHTML =/*html*/ `
    <img class="closebtn" onclick="closeNav()" src="./assets/img/closeX.png" alt="">
    <div id="createTask-overlay">
       <span class="addTask-text-overlay">Add Task</span>        
    </div>
    <div class="overlay-content">
        <div class="addTask-board">
        <form id="form_board"  onsubmit="addTask_board('${state}'); taskAddedToBord_board(); resetTask_board(); return false;">
            <div class="left-box">
                <!--Title-->
    
                    <input class="title-board" id="title" type="text" required placeholder="Enter a title">
    
    
                <!--Select Contacts-->
                  
                <div class="selectContacts">
                    <!-- <div class="input_select_contacts">
                        <input id="selectContacts"  type="text" readonly="readonly" required placeholder="Select contacts to assign" >
                        <img src="assets/img/dropdown_arrow.png" onclick="showContact_task()">
                    </div> -->

                    <div id="userNewParentT" class="input_select_contacts">
                        <input id="userNewT" name="userNameT" type="text" readonly="true" required placeholder="Select contacts to assign" >
                        <img id="userNewImg0T" src="assets/img/dropdown_arrow.png" onclick="showContact_task()">
                        <img id="userNewImg1T" class="d-none styleImg" src="assets/img/cancelBlue.png" onclick="cancelAddNewUser_task()">
                        <img id="userNewImg2T" class="d-none styleImg" src="assets/img/separation.png">
                        <img id="userNewImg3T" class="d-none styleImg" src="assets/img/checkBlue.png" onclick="checkAddNewUser_task()">
                    </div>
            
                    <div id="selectAll2" class="selectAll" style="display: none"> </div> 
                                      
                </div>   
    
                <!--Due Date-->
    
                    <span>Due date</span>
                    <div class="dueDate" onclick="showDate()"  >
                    <input id="dueDate" minlength="10" maxlength="10" type="date" required >
                    
                </div>
    
                <!--Category-->
                
                    <span>Category</span>
                    <div class="selectContacts"   >
                        
                        <div id="categoryNewParent" class="input_select_contacts">
                            <input id="categoryNew" name="categoryName" type="text" readonly="true" required placeholder="Select Task category" >
                            <img id="categoryNewImg0" src="assets/img/dropdown_arrow.png" onclick="showCategory()">
                            <img id="categoryNewImg1" class="d-none styleImg" src="assets/img/cancelBlue.png" onclick="cancelAddNewCategory()">
                            <img id="categoryNewImg2" class="d-none styleImg" src="assets/img/separation.png">
                            <img id="categoryNewImg3" class="d-none styleImg" src="assets/img/checkBlue.png" onclick="checkAddNewCategory()">
                        </div>
                
                        <div id="categoryAll" class="selectAll"> </div> 
                
                        
                    </div>
                
                <!--Priority-->
    
                <div class="priority">
    
                    <button id="button_prio_high" onclick="clickPriority ('high')" value="high" type="button"  class="b1">Urgent <img id="imgPrioHigh" src="assets/img/red_arrow.png"></button> 
    
                    <button id="button_prio_middle" onclick="clickPriority ('middle')" value="middle" type="button" class="b2">Medium <img id="imgPrioMiddle" src="assets/img/medium.png"></button>
    
                    <button id="button_prio_low" onclick="clickPriority ('low') " value="low" type="button"  class="b3">Low <img id="imgPrioLow" src="assets/img/green_arrow.png"></button>
    
                </div>   
                 
    
                <!--Description-->
                    
                    <span>Description</span>
    
                    <input required class="description" 
                    
                    id="description" placeholder="Enter a description..">

                    <button class="createTask-btn" type="submit" value="Submit"> <span class="createTask-btn-text">Create task</span>  <img class="createTask-btn-img" src="./assets/img/checkOK.png" alt="">

                    </button>
    
            </div>
                <!--Add Task Button Confirm-->
            
    
            </div>
            
            
            </form>
    
            <div class="showCreateTask d-none" id="showCreateTask">Task added to board</div>
    </div>
  </div>
    
    `;
    updateHTML();

}

function resetTask_board(){
    document.getElementById('description').value =''; 
}

window.onscroll = function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        document.getElementById('alltasks_todo').classList.add('scroll-class');
        document.getElementById('alltasks_progress').classList.add('scroll-class');
        document.getElementById('alltasks_feedback').classList.add('scroll-class');
        document.getElementById('alltasks_done').classList.add('scroll-class');
    
    }else{
        document.getElementById('alltasks_todo').classList.remove('scroll-class');
        document.getElementById('alltasks_progress').classList.remove('scroll-class');
        document.getElementById('alltasks_feedback').classList.remove('scroll-class');
        document.getElementById('alltasks_done').classList.remove('scroll-class');
    }
};



function taskAddedToBord_board() {
    closeNav();
    document.getElementById('showCreateTask').classList.remove('d-none');

    setTimeout(() => {
        document.getElementById('showCreateTask').classList.add('downShowCreateTask');
    }, 2000)

    setTimeout(() => {
        document.getElementById('showCreateTask').classList.add('d-none');
        document.getElementById('showCreateTask').classList.remove('downShowCreateTask');
    }, 2300)
}

async function addTask_board(status) {
    let idNew = idlogic();
    let title = document.getElementById('title');
    let dateValue = document.getElementById("dueDate"); 
    let selectContacts = [];    
    for (let i=0;i<selectedNames.length;i++){
        
        if (document.getElementById(selectNamesWithoutSpace[i] + "_").checked == true) {
            selectContacts.push(document.getElementById(selectNamesWithoutSpace[i] + "_").value);           
        }
    }
    let uniqueSelected = [...new Set(selectContacts)];  
    let category = document.getElementById('categoryNew');
    let description = document.getElementById('description');

    tasks.push(
        {
            'title': title.value,
            'selectContacts': uniqueSelected,
            'date': dateValue.value,
            'category': category.value,
            'priority': priority_button,
            'description': description.value,
            'id': idNew,
            'state': status

        });

    await saveTask();
    taskAddedToBord_board();
    updateHTML();
    resetAssignedUsers();
    
}

function resetAssignedUsers(){ 
    if(wasMenuOpen_board){
        document.getElementById('selectAll2').innerHTML ='';
        wasMenuOpen_board = false;
    }
    if(wasMenuOpen_task){
        document.getElementById('selectAll1').innerHTML ='';
        wasMenuOpen_task = false;
    }
    wasCategoryOpen_board = false;
    wasCategoryOpen = false;
}

function idlogic(){
    ids = tasks.map((number) => {
        return number.id
    })

    let onlyNumbers = ids.filter(
        element => typeof element === 'number'
    );

    let id = Math.max(...onlyNumbers) + 1;
    if (!id || id == -Infinity) {
        id = 1;
        return id;
    }
    return id;
}


function popCardOver(id){
    if(document.body.clientWidth < 738 ){
        document.getElementById('board-body').classList.add('d-none');
        document.getElementById('footerBoard').style.cssText ='display:none !important';
    }
    if( document.body.clientWidth > 1380 ){
        document.getElementById('footerBoard').style.cssText ='display:none !important';
    }
    let names 
    for (let index = 0; index < tasks.length; index++) {
        const element = tasks[index]['id'];
        if (id == element) {
            selectedTaskCard = tasks[index];
            names = tasks[index]['selectContacts'];
            break;           
        }        
    }
    let modal = document.getElementById("task-content");     
    document.getElementById('taskCardName-child').innerHTML = `${selectedTaskCard['category']}`;
    document.getElementById('taskCardDescription').innerHTML = `${selectedTaskCard['title']}`;
    document.getElementById('taskCardText').innerHTML = `${selectedTaskCard['description']}`;
    if (selectedTaskCard['priority']=='low') {
        document.getElementById('taskPrioritycontent-child').innerHTML = `
        <button id="button_prio_low" type="button"  class="b3 low-color">Low <img class="img-prio" src="assets/img/lowGreen.png"></button>
        `;
    }
    if (selectedTaskCard['priority']=='middle') {
        document.getElementById('taskPrioritycontent-child').innerHTML = `
        <button id="button_prio_middle" type="button" class="b2 middle-color">Medium <img class="img-prio" src="assets/img/medOrange.png"></button>
        `;
    }
    if (selectedTaskCard['priority']=='high') {
        document.getElementById('taskPrioritycontent-child').innerHTML = `
        <button id="button_prio_high" type="button"  class="b1 high-color">Urgent <img class="img-prio" src="assets/img/urgentRed.png"></button>
        `;
    }
    document.getElementById('taskDatecontent-child').innerHTML = `${selectedTaskCard['date']}`;   
    document.getElementById('editCardBtn').innerHTML = `
        <div class="edit-img" onclick="cardEdit(${id})">
        <img class="edit-btn" src="/assets/img/edit_button.png" alt="">
        </div>
    `;   
    assignedUserPopUpCard(names);
    modal.style.display = "flex";   
    document.getElementById("board-body").style.opacity = "0.5";
    document.getElementById("board-body").style.pointerEvents = 'none';
}

function assignedUserPopUpCard(names){
    let assignedUser = names;
    let ShortName;
    for (let i = 0; i < assignedUser.length; i++) {
        document.getElementById('assignedUser').innerHTML +=`
        <div id="assignedUser_${i}" class="assignedUser-child"></div>
        `;        
    }        
         for (let j = 0; j < assignedUser.length; j++) {
             const userFullName = assignedUser[j];
             const indexSpace = userFullName.indexOf(' ') ; 
             if (indexSpace == -1) {
                  ShortName = userFullName.charAt(0) + userFullName.slice(-1);
                 
             }else {
                  ShortName = userFullName.charAt(0) + userFullName.charAt(indexSpace+1); 
             }                   
             document.getElementById('assignedUser_'+ j).innerHTML += /*html*/`
             <div class="assignedUserName"> 
                <span class="assignedUserName-child" >${ShortName.toUpperCase()}</span>
             </div>
              <span class="assignedUserNameText"> ${userFullName}<br><br></span>                        
             `;            
         }       
}


function popCardOverClose(){
    let modal = document.getElementById("task-content");
    document.getElementById('taskCardDescription').contentEditable = false;
    document.getElementById('taskCardText').contentEditable = false;
    document.getElementById('taskDatecontent-child').contentEditable = false;
    document.getElementById('taskCardName-child').contentEditable = false;
    document.getElementById('taskCardDescription').style.cssText ='border:unset';
    document.getElementById('taskCardText').style.cssText ='border:unset';
    document.getElementById('taskDatecontent-child').style.cssText ='border:unset';
    document.getElementById('assignedUser').innerHTML=``;
    modal.style.display = "none";
    document.getElementById("board-body").style.opacity = "1";
    document.getElementById("board-body").style.pointerEvents = 'auto';
    document.getElementById("board-body").classList.remove('d-none');
    document.getElementById("stateEdit").classList.add('d-none');
    document.getElementById('footerBoard').style.cssText ='display:block !important';
    if( document.body.clientWidth > 1380 ){
        document.getElementById('footerBoard').style.cssText ='display:none !important';
    }

}

function cardEdit(id){ 
    document.getElementById('taskCardDescription').contentEditable = true;
    document.getElementById('taskCardDescription').style.cssText ='border:solid 1px';
    document.getElementById('taskCardText').contentEditable = true;
    document.getElementById('taskCardText').style.cssText ='border:solid 1px';
    /* document.getElementById('taskDatecontent-child').contentEditable = true; */
    /* document.getElementById('taskDatecontent-child').style.cssText ='border:solid 1px'; */
    document.getElementById('taskDatecontent-child').innerHTML =`
    <input id="dueDate" minlength="10" maxlength="10" pattern="[0-9]{2}.[0-9]{2}.[0-9]{4}" type="date" required >
    `;
    document.getElementById('taskCardName-child').contentEditable = true;
    document.getElementById('taskPrioritycontent-child').innerHTML = `
    <button id="button_prio_high1" onclick="clickPriority_board ('high')" value="high" type="button"  class="b1">Urgent <img id="imgPrioHigh1" src="assets/img/red_arrow.png"></button>    
    <button id="button_prio_middle1" onclick="clickPriority_board ('middle')" value="middle" type="button" class="b2">Medium <img id="imgPrioMiddle1" src="assets/img/medium.png"></button>
    <button id="button_prio_low1" onclick="clickPriority_board ('low') " value="low" type="button"  class="b3">Low <img id="imgPrioLow1" src="assets/img/green_arrow.png"></button>   
    `;
    setPriorPrio(id);
    clickPriority_board(prioTask);
    
    document.getElementById('assignedUser').innerHTML = `

        <div id="userNewParentB" class="input_select_contacts">
            <input id="selectContacts1" name="userNameB" type="text" readonly="true" required placeholder="Select contacts to assign" >
            <img id="userNewImg0B" src="assets/img/dropdown_arrow.png" onclick="showContact_board()">
            <img id="userNewImg1B" class="d-none styleImg" src="assets/img/cancelBlue.png" onclick="cancelAddNewUser_board()">
            <img id="userNewImg2B" class="d-none styleImg" src="assets/img/separation.png">
            <img id="userNewImg3B" class="d-none styleImg" src="assets/img/checkBlue.png" onclick="checkAddNewUser_board()">
        </div>

        <div id="selectAll1" class="selectAll" style="display: none"> </div> 
        <span id="catBoard">Category</span>
        <div class="selectContacts"   >

            <div id="categoryNewParent2" class="input_select_contacts">
                <input id="categoryNew1" name="categoryName2" type="text" readonly="true" required placeholder="Select Task category" >
                <img id="categoryNewImg0B" src="assets/img/dropdown_arrow.png" onclick="showCategory_board()">
                <img id="categoryNewImg1B" class="d-none styleImg" src="assets/img/cancelBlue.png" onclick="cancelAddNewCategory_board()">
                <img id="categoryNewImg2B" class="d-none styleImg" src="assets/img/separation.png">
                <img id="categoryNewImg3B" class="d-none styleImg" src="assets/img/checkBlue.png" onclick="checkAddNewCategory_board()">
            </div>
            <div id="categoryAll1" class="selectAll" style="display: none"> </div>                        
        </div>
    `;
    document.getElementById('editCardBtn').innerHTML = `
    <button class="saveEdit-btn" onclick="saveCard(${id})" > <span class="addTask-btn-text">Save</span>  </button>
`;
document.getElementById('stateEdit').classList.remove('d-none');
    for (let index = 0; index < tasks.length; index++) {
        const element = tasks[index];
        if (element['id'] == id) {
            document.getElementById('stateEdit').value = element['state'];
            break
        }    
    }

}

function setPriorPrio(id){

    for (let index = 0; index < tasks.length; index++) {
        const element = tasks[index];
        if (element['id'] == id) {
            if (element['priority']=='low') {
                prioTask = 'low';
            }
            if (element['priority']=='middle') {
                prioTask = 'middle';
            }
            if (element['priority']=='high') {
                prioTask = 'high';
            }
        }    
    }   
}

function showContact_board() {
    let x = document.getElementById("selectAll1");
        if (x.style.display === "none") {
            /* x.innerHTML ='';  */
            x.style.display = "block";
            if(!wasMenuOpen_task){
                for (let i = 0; i < contacts.length; i++) {                
                x.innerHTML += allContacts_board(i);
            }
            x.innerHTML += ` <div id="newContactB" class="selectName" onclick="addNewUser_board()"> <a id="newUserNameB" href="#"   placeholder="Invite new Contact">Invite new Contact</a>
            <img class="styleImgContact" src="assets/img/contactImg.png">  </div>         
            `;
            wasMenuOpen_task = true;
        }
            
        } else {
            x.style.display = "none";
        }      
}

function showCategory_board(){
    let x = document.getElementById("categoryAll1");
    if (x.style.display === "none"){
        /* x.innerHTML ='';  */
        x.style.display = "block";
        if(!wasCategoryOpen_board){
            for (let i = 0; i < categories.length; i++) {           
                x.innerHTML += eachCategoryshowed_board(i);
            }
            x.innerHTML += `<a id="newCatName2" href="#" class="selectName" onclick="addNewCategory_board()" placeholder="New Category name">New Category name</a>           
            `;
            wasCategoryOpen_board = true;
        }        
    }
    else {
        x.style.display = "none";
    }
}

function addNewCategory_board(){
    document.getElementById('categoryNew1').value = '';
    document.getElementsByName('categoryName2')[0].placeholder = 'New Category name';
    document.getElementById('categoryNew1').readOnly = false;
    document.getElementById('categoryNewImg0B').classList.add('d-none');
    document.getElementById('categoryNewImg1B').classList.remove('d-none');
    document.getElementById('categoryNewImg2B').classList.remove('d-none');
    document.getElementById('categoryNewImg3B').classList.remove('d-none');
    document.getElementById('categoryAll1').innerHTML = '';
    wasCategoryOpen_board = false;
}

function cancelAddNewCategory_board(){
    document.getElementById('categoryNewParent2').innerHTML =
    `
    <input id="categoryNew1" class="inputContact" name="categoryName" type="text" readonly="true" required placeholder="Select Task category" >
    <img id="categoryNewImg0B" src="assets/img/dropdown_arrow.png" onclick="showCategory_board()">
    <img id="categoryNewImg1B" class="d-none styleImg" src="assets/img/cancelBlue.png" onclick="cancelAddNewCategory_board()">
    <img id="categoryNewImg2B" class="d-none styleImg" src="assets/img/separation.png">
    <img id="categoryNewImg3B" class="d-none styleImg" src="assets/img/checkBlue.png" onclick="checkAddNewCategory_board()">
    `;
}

async function checkAddNewCategory_board(){
    let NewCategory = document.getElementById('categoryNew1').value;
    categories.push(NewCategory);
    await saveCategory();
    cancelAddNewCategory_board();
    document.getElementById('categoryNew1').value = categories.slice(-1);  
    wasCategoryOpen_board = false;

}

function eachCategoryshowed_board(i){
    return `
    <a href="#" class="selectName" onclick="catchCategory_board('${categories[i]}')">${categories[i]}</a>   
    `;
}

function eachCategoryHardCoded_board() {
    return `     
    <a href="#" class="selectName" onclick="catchCategory_board('Backoffice')">Backoffice</a>
    <a href="#" class="selectName" onclick="catchCategory_board('Design')">Design</a>
    <a href="#" class="selectName" onclick="catchCategory_board('Software')">Software</a>
    <a href="#" class="selectName" onclick="catchCategory_board('Hardware')">Hardware</a>
    `;
}


function catchCategory_board(selectedCat){
    document.getElementById('categoryNew1').value=selectedCat;
    document.getElementById('categoryAll1').innerHTML = '';
    wasCategoryOpen_board = false;
}

function showContact_task() {    
   let y = document.getElementById("selectAll2"); 
        if (y.style.display === "none") {
            /* y.innerHTML ='';  */
            y.style.display = "block";
            if(!wasMenuOpen_board){
                for (let i = 0; i < contacts.length; i++) {                
                    y.innerHTML += allContacts_task(i);
                }
                y.innerHTML += ` <div id="newContactT" class="selectName" onclick="addNewUser_task()"> <a id="newUserNameT" href="#"   placeholder="Invite new Contact">Invite new Contact</a>
            <img class="styleImgContact" src="assets/img/contactImg.png">  </div>         
            `;
                wasMenuOpen_board = true;
            }
        } else {           
            y.style.display = "none";
        }
}


function allContacts_board(i) {    
    let name = contacts[i].fullname;
    let nameWithoutSpace=name.replace(/\s/g,'');
    selectedNames.push(name);
    selectNamesWithoutSpace.push(nameWithoutSpace);
    return `   
                <a href="#" class="selectName">
                 <label for="${nameWithoutSpace}">${name}</label>
                    <div>
                <input   type="checkbox" id="${nameWithoutSpace}" name="${nameWithoutSpace}" value="${name}">
                    </div>
                </a>

            `;
}

function allContacts_task(i) { 
    let name = contacts[i].fullname;
    let nameWithoutSpace=name.replace(/\s/g,'');
    selectedNames.push(name);
    selectNamesWithoutSpace.push(nameWithoutSpace);
    return `
                <a href="#" class="selectName">
                 <label for="${nameWithoutSpace}">${name}</label>
                    <div>
                <input   type="checkbox" id="${nameWithoutSpace}_" name="${nameWithoutSpace}" value="${name}">
                    </div>
                </a>

            `;
}

function addNewUser_task(){
    document.getElementById('userNewT').value = '';
    document.getElementsByName('userNameT')[0].placeholder = 'Contact email';
    document.getElementById('userNewT').readOnly = false;
    document.getElementById('userNewImg0T').classList.add('d-none');
    document.getElementById('userNewImg1T').classList.remove('d-none');
    document.getElementById('userNewImg2T').classList.remove('d-none');
    document.getElementById('userNewImg3T').classList.remove('d-none');
    document.getElementById('selectAll2').innerHTML = '';
    wasMenuOpen_board = false;
}

function cancelAddNewUser_task(){
    document.getElementById('userNewParentT').innerHTML =
    `
    <input id="userNewT" class="inputContact" name="userNameT" type="text" readonly="true" required placeholder="Select contacts to assign" >
    <img id="userNewImg0T" src="assets/img/dropdown_arrow.png" onclick="showContact_task()">
    <img id="userNewImg1T" class="d-none styleImg" src="assets/img/cancelBlue.png" onclick="cancelAddNewUser_task()">
    <img id="userNewImg2T" class="d-none styleImg" src="assets/img/separation.png">
    <img id="userNewImg3T" class="d-none styleImg" src="assets/img/checkBlue.png" onclick="checkAddNewUser_task()">
    `;
}

async function checkAddNewUser_task(){
    let color = Math.floor(Math.random()*16777215).toString(16);
    let email = document.getElementById('userNewT').value;
    let name = 'New Contact';
    let phone = '000000' ;
    let contact = { fullname: name, mail: email, phone: phone, color: color };
    contacts.push(contact);
    await backend.setItem('contacts', JSON.stringify(contacts));
    cancelAddNewUser_task();
    /* document.getElementById('userNew').value = name; */  
    wasMenuOpen_board = false;
}

function addNewUser_board(){
    document.getElementById('selectContacts1').value = '';
    document.getElementsByName('userNameB')[0].placeholder = 'Contact email';
    document.getElementById('selectContacts1').readOnly = false;
    document.getElementById('userNewImg0B').classList.add('d-none');
    document.getElementById('userNewImg1B').classList.remove('d-none');
    document.getElementById('userNewImg2B').classList.remove('d-none');
    document.getElementById('userNewImg3B').classList.remove('d-none');
    document.getElementById('selectAll1').innerHTML = '';
    wasMenuOpen_task = false;
}

function cancelAddNewUser_board(){
    document.getElementById('userNewParentB').innerHTML =
    `
    <input id="selectContacts1" class="inputContact" name="userNameB" type="text" readonly="true" required placeholder="Select contacts to assign" >
    <img id="userNewImg0B" src="assets/img/dropdown_arrow.png" onclick="showContact_board()">
    <img id="userNewImg1B" class="d-none styleImg" src="assets/img/cancelBlue.png" onclick="cancelAddNewUser_board()">
    <img id="userNewImg2B" class="d-none styleImg" src="assets/img/separation.png">
    <img id="userNewImg3B" class="d-none styleImg" src="assets/img/checkBlue.png" onclick="checkAddNewUser_board()">
    `;
}

async function checkAddNewUser_board(){
    let color = Math.floor(Math.random()*16777215).toString(16);
    let email = document.getElementById('selectContacts1').value;
    let name = 'New Contact';
    let phone = '000000' ;
    let contact = { fullname: name, mail: email, phone: phone, color: color };
    contacts.push(contact);
    await backend.setItem('contacts', JSON.stringify(contacts));
    cancelAddNewUser_board();
    /* document.getElementById('userNew').value = name; */  
    wasMenuOpen_task = false;
}


function clickPriority_board(priority) {
    let button_prio_high = document.getElementById('button_prio_high1');
    let button_prio_middle = document.getElementById('button_prio_middle1');
    let button_prio_low = document.getElementById('button_prio_low1');
    let prioImgHigh = document.getElementById('imgPrioHigh1');
    let prioImgMedium = document.getElementById('imgPrioMiddle1');
    let prioImgLow = document.getElementById('imgPrioLow1');
    if (priority == "high") {
        setPrioHigh(button_prio_high, button_prio_middle, button_prio_low, prioImgHigh, prioImgMedium, prioImgLow);    
    }
    if (priority == "middle") {
        setPrioMiddle(button_prio_high, button_prio_middle, button_prio_low,prioImgHigh, prioImgMedium, prioImgLow);        
    }
    if (priority == "low") {
        setPrioLow(button_prio_high, button_prio_middle, button_prio_low,prioImgHigh, prioImgMedium, prioImgLow);        
    }
}

function setPrioHigh(button_prio_high, button_prio_middle, button_prio_low,prioImgHigh,prioImgMedium,prioImgLow){
    button_prio_high.style.background = '#FF3D00';
    button_prio_middle.style.background = '#FFFFFF';
    button_prio_low.style.background = '#FFFFFF';
    button_prio_high.style.color = 'white';
    button_prio_middle.style.color = 'black';
    button_prio_low.style.color = 'black';
    priority_selected = "high";
    prioImgHigh.src = "assets/img/arrowUpWhite.png";
    prioImgHigh.style.height="32px";
    prioImgHigh.style.width="32px";
    prioImgLow.src = "assets/img/green_arrow.png";
    prioImgMedium.src = "assets/img/medium.png";
}

function setPrioMiddle(button_prio_high, button_prio_middle, button_prio_low,prioImgHigh,prioImgMedium,prioImgLow){
    priority_selected = "middle";
    button_prio_middle.style.background = '#FFA800';
    button_prio_low.style.background = '#FFFFFF';
    button_prio_high.style.background = '#FFFFFF';
    button_prio_middle.style.color = 'white';
    button_prio_high.style.color = 'black';
    button_prio_low.style.color = 'black';
    prioImgMedium.src = "assets/img/medium_white.png";
    prioImgMedium.style.height="32px";
    prioImgMedium.style.width="32px";
    prioImgLow.src = "assets/img/green_arrow.png";
    prioImgHigh.src = "assets/img/red_arrow.png";    
}

function setPrioLow(button_prio_high, button_prio_middle, button_prio_low,prioImgHigh,prioImgMedium,prioImgLow){
    priority_selected = "low";
    button_prio_low.style.background = '#7AE229';
    button_prio_high.style.background = '#FFFFFF';
    button_prio_middle.style.background = '#FFFFFF';
    button_prio_low.style.color = 'white';
    button_prio_high.style.color = 'black';
    button_prio_middle.style.color = 'black';
    prioImgLow.src = "assets/img/arrowDownWhite.png";
    prioImgLow.style.height="32px";
    prioImgLow.style.width="32px";
    prioImgMedium.src = "assets/img/medium.png";
    prioImgHigh.src = "assets/img/red_arrow.png";   
}

async function saveCard(id){
    let selectContacts = [];    
    for (let i=0;i<selectedNames.length;i++){
        if(document.getElementById(selectNamesWithoutSpace[i]) === null){
            break;           
        }else{
            if (document.getElementById(selectNamesWithoutSpace[i]).checked ==true) {
                selectContacts.push(document.getElementById(selectNamesWithoutSpace[i]).value);
            }
        }        
    }
    let uniqueSelected = [...new Set(selectContacts)];
    for (let index = 0; index < tasks.length; index++) {
        const element = tasks[index]['id'];        
        if (id == element) {            
            tasks[index]['title'] =  document.getElementById('taskCardDescription').innerHTML;
            tasks[index]['description'] =  document.getElementById('taskCardText').innerHTML;
            if(document.getElementById('categoryNew1').value !==''){
                tasks[index]['category'] =  document.getElementById('categoryNew1').value;
            }             
            if(document.getElementById('dueDate').value !==''){
                tasks[index]['date'] =  document.getElementById('dueDate').value;
            }            
            if(document.getElementById('stateEdit').value !== ""){
                tasks[index]['state'] = document.getElementById('stateEdit').value;
            }  
            if(uniqueSelected.length){
                tasks[index]['selectContacts'] =  uniqueSelected;
            }           
            if(priority_selected != "empty"){
                tasks[index]['priority'] =  priority_selected;
            }
            priority_selected = "empty";            
            
            break;           
        }       
    }    
    await saveTask();
    document.getElementById('stateEdit').classList.add('d-none');
    resetAssignedUsers();
    popCardOverClose();
    updateHTML();
}

