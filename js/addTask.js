let priority_button;
let tasks = [];
let openContact;
let openCategory;
let users = [];
let ids = [];
let day = "";
let contacts = [];
let selectNames=[];
let selectNamesWithoutSpace=[];
let wasMenuOpen = false;
let wasCategoryOpen = false;

let categories =[];


async function init() {
    setURL('https://join.russell-tchamba.de/smallest_backend_ever');// setURL('https://w01d87e2.kasserver.com/smallest_backend_ever');
    await downloadFromServer();
    await loadTask();
    await loadContacts();
    await loadCategory();
    document.getElementById('description').value = '';
}


async function loadContacts() {
    contacts = await JSON.parse(backend.getItem('contacts')) || [];
}


async function loadTask() {
    tasks = await backend.getItem('tasks') || [];
}

async function loadCategory() {
    categories = await backend.getItem('categories') || [];
}

async function saveTask() {
    await backend.setItem('tasks', tasks);    
}

async function saveCategory() {
    await backend.setItem('categories', categories);    
}

function showDate() {
    day = document.getElementById("dueDate").value;
}


function taskAddedToBord() {
    document.getElementById('showCreateTask').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('showCreateTask').classList.add('downShowCreateTask');
    }, 2000)
    setTimeout(() => {
        document.getElementById('showCreateTask').classList.add('d-none');
        document.getElementById('showCreateTask').classList.remove('downShowCreateTask');
    }, 2300)
    resetForm();
}


function resetForm() {
    let form = document.getElementById('form');
    form.addEventListener('submit', function handleSubmit(event) {
        event.preventDefault();       
        form.reset();
    });
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


async function addTask(status) {
    wasMenuOpen = false;
    let idNew = idlogic();
    let title = document.getElementById('title');
    let selectContacts = [];   
    for (let i=0;i<selectNames.length;i++){
        if (document.getElementById(selectNamesWithoutSpace[i]).checked) {
            selectContacts.push(document.getElementById(selectNamesWithoutSpace[i]).value);           
        }
    }  
    let uniqueSelected = [...new Set(selectContacts)];
    let category = document.getElementById('categoryNew');
    let description = document.getElementById('description');
    let datechoosed = document.getElementById('dueDate');
    tasks.push(
        {
            'title': title.value,
            'selectContacts': uniqueSelected,
            'date': datechoosed.value,
            'category': category.value,
            'priority': priority_button,
            'description': description.value,
            'id': idNew,
            'state': status
        });
    await saveTask();
    resetPriority(priority_button);
    taskAddedToBord();   
}

function resetPriority(priority_button){
    resetPriorityHigh(priority_button);
    resetPriorityMiddle(priority_button);
    resetPriorityLow(priority_button);
    document.getElementById("dueDate").value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value ='';
    document.getElementById('categoryNew').value = ''; 
    if(wasMenuOpen){
        document.getElementById('selectAll').innerHTML ='';
        wasMenuOpen = false;
    }        
}

function resetPriorityHigh(priority_button){
    if (priority_button == "high") {
        document.getElementById('button_prio_high').style.background = 'white';
        document.getElementById('button_prio_high').style.color = 'black';
        document.getElementById('imgPrioHigh').src = "assets/img/red_arrow.png"; 
    }
}

function resetPriorityMiddle(priority_button){
    if (priority_button == "middle") {
        document.getElementById('button_prio_middle').style.background = 'white';
        document.getElementById('button_prio_middle').style.color = 'black';
        document.getElementById('imgPrioMiddle').src = "assets/img/medium.png";
    }
}

function resetPriorityLow(priority_button){
    if (priority_button == "low") {
        document.getElementById('button_prio_low').style.color = 'black';
        document.getElementById('button_prio_low').style.background = 'white';
        document.getElementById('imgPrioLow').src = "assets/img/green_arrow.png"; 
    }
}

function resetTask(){
    document.getElementById("dueDate").value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value ='';
    document.getElementById('categoryNew').value = ''; 
    resetPriority(priority_button);
    

}

async function saveTask() {
    await backend.setItem('tasks', tasks);
    let taskAsText = JSON.stringify(tasks);
}


function clickPriority(priority) {
    let button_prio_high = document.getElementById('button_prio_high');
    let button_prio_middle = document.getElementById('button_prio_middle');
    let button_prio_low = document.getElementById('button_prio_low');
    let prioImgHigh = document.getElementById('imgPrioHigh');
    let prioImgMedium = document.getElementById('imgPrioMiddle');
    let prioImgLow = document.getElementById('imgPrioLow');
    if (priority == "high") {
        settingsPriorityHigh(button_prio_high, button_prio_middle,button_prio_low,prioImgHigh,prioImgMedium,prioImgLow);
    }
    if (priority == "middle") {
        settingsPriorityMiddle(button_prio_high, button_prio_middle,button_prio_low,prioImgHigh,prioImgMedium,prioImgLow);
    }
    if (priority == "low") {        
        settingsPriorityLow(button_prio_high, button_prio_middle,button_prio_low,prioImgHigh,prioImgMedium,prioImgLow);
    }
}


function settingsDefault() {
    button_prio_high.style.background = 'white';
    button_prio_middle.style.background = 'white';
    button_prio_low.style.background = 'white';
    priority_button = ""; 
    selectNames=[];
    selectNamesWithoutSpace=[];
    showContact();
}


function settingsPriorityHigh(button_prio_high, button_prio_middle,button_prio_low,prioImgHigh,prioImgMedium,prioImgLow) {  
    prioImgHigh.src = "assets/img/arrowUpWhite.png";
    prioImgHigh.style.height="32px";
    prioImgHigh.style.width="32px"; 
    button_prio_high.style.background = '#FF3D00';
    button_prio_high.style.color = 'white';
    button_prio_middle.style.background = 'white';
    button_prio_low.style.background = 'white';
    button_prio_middle.style.color = 'black';
    button_prio_low.style.color = 'black';
    priority_button = "high";
    prioImgLow.src = "assets/img/green_arrow.png";
    prioImgMedium.src = "assets/img/medium.png";
}

function settingsPriorityMiddle(button_prio_high, button_prio_middle,button_prio_low,prioImgHigh,prioImgMedium,prioImgLow) { 
    prioImgMedium.src = "assets/img/medium_white.png";
    prioImgMedium.style.height="32px";
    prioImgMedium.style.width="32px";
    button_prio_high.style.background = 'white';
    button_prio_middle.style.background = '#FFA800';
    button_prio_middle.style.color = 'white';
    button_prio_low.style.background = 'white';
    button_prio_high.style.color = 'black';
    button_prio_low.style.color = 'black';
    priority_button = "middle";
    prioImgLow.src = "assets/img/green_arrow.png";
    prioImgHigh.src = "assets/img/red_arrow.png";
}

function settingsPriorityLow(button_prio_high, button_prio_middle,button_prio_low,prioImgHigh,prioImgMedium,prioImgLow) {
    prioImgLow.src = "assets/img/arrowDownWhite.png";
    prioImgLow.style.height="32px";
    prioImgLow.style.width="32px";
    button_prio_high.style.background = 'white';
    button_prio_middle.style.background = 'white';
    button_prio_low.style.background = '#7AE229';
    button_prio_low.style.color = 'white';
    button_prio_high.style.color = 'black';
    button_prio_middle.style.color = 'black';
    priority_button = "low";
    prioImgMedium.src = "assets/img/medium.png";
    prioImgHigh.src = "assets/img/red_arrow.png";
}


function showCategory(){
    let x = document.getElementById("categoryAll");
    if (x.style.display === "none"){
        /* x.innerHTML ='';  */
        x.style.display = "block";
        if(!wasCategoryOpen){
            for (let i = 0; i < categories.length; i++) {           
                x.innerHTML += eachCategoryshowed(i);
            }
            x.innerHTML += `<a id="newCatName" href="#" class="selectName" onclick="addNewCategory()" placeholder="New Category name">New Category name</a>           
            `;
            wasCategoryOpen = true;
        }        
        /* document.getElementById('categoryAll').innerHTML=eachCategoryHardCoded(); */
    }
    else {
        x.style.display = "none";
    }
}

function eachCategoryshowed(i){
    return `
    <a href="#" class="selectName" onclick="catchCategory('${categories[i]}')">${categories[i]}</a>   
    `;
}

function addNewCategory(){
    document.getElementById('categoryNew').value = '';
    document.getElementsByName('categoryName')[0].placeholder = 'New Category name';
    document.getElementById('categoryNew').readOnly = false;
    document.getElementById('categoryNewImg0').classList.add('d-none');
    document.getElementById('categoryNewImg1').classList.remove('d-none');
    document.getElementById('categoryNewImg2').classList.remove('d-none');
    document.getElementById('categoryNewImg3').classList.remove('d-none');
    document.getElementById('categoryAll').innerHTML = '';
    wasCategoryOpen = false;
}

function cancelAddNewCategory(){
    document.getElementById('categoryNewParent').innerHTML =
    `
    <input id="categoryNew" name="categoryName" type="text" readonly="true" required placeholder="Select Task category" >
    <img id="categoryNewImg0" src="assets/img/dropdown_arrow.png" onclick="showCategory()">
    <img id="categoryNewImg1" class="d-none styleImg" src="assets/img/cancelBlue.png" onclick="cancelAddNewCategory()">
    <img id="categoryNewImg2" class="d-none styleImg" src="assets/img/separation.png">
    <img id="categoryNewImg3" class="d-none styleImg" src="assets/img/checkBlue.png" onclick="checkAddNewCategory()">
    `;
}


function eachCategoryHardCoded() {
    return `     
    <a href="#" class="selectName" onclick="catchCategory('Backoffice')">Backoffice</a>
    <a href="#" class="selectName" onclick="catchCategory('Design')">Design</a>
    <a href="#" class="selectName" onclick="catchCategory('Software')">Software</a>
    <a href="#" class="selectName" onclick="catchCategory('Hardware')">Hardware</a>
    `;
}


function catchCategory(selectedCat){
    document.getElementById('categoryNew').value=selectedCat;
    document.getElementById('categoryAll').innerHTML = '';
    wasCategoryOpen = false;
    openCategory = false;
}

async function checkAddNewCategory(){
    let NewCategory = document.getElementById('categoryNew').value;
    categories.push(NewCategory);
    await saveCategory();
    cancelAddNewCategory();
    document.getElementById('categoryNew').value = categories.slice(-1);  
    wasCategoryOpen = false;

}


function showContact() {
    let x = document.getElementById("selectAll");
    if (x.style.display === "none") {
        /* x.innerHTML =''; */
        x.style.display = "block";
        if(!wasMenuOpen){
            for (let i = 0; i < contacts.length; i++) {           
                x.innerHTML += allContacts(i);
            }
            x.innerHTML += ` <div id="newContact" class="selectName" onclick="addNewUser()"> <a id="newUserName" href="#"   placeholder="Invite new Contact">Invite new Contact</a>
            <img class="styleImgContact" src="assets/img/contactImg.png">  </div>         
            `;
            wasMenuOpen = true;
        }
    } else {
        x.style.display = "none";
    }
}


function allContacts(i) {
    let name = contacts[i].fullname;
    let nameWithoutSpace=name.replace(/\s/g,'');
    selectNames.push(name);
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

function addNewUser(){
    document.getElementById('userNew').value = '';
    document.getElementsByName('userName')[0].placeholder = 'Contact email';
    document.getElementById('userNew').readOnly = false;
    document.getElementById('userNewImg0').classList.add('d-none');
    document.getElementById('userNewImg1').classList.remove('d-none');
    document.getElementById('userNewImg2').classList.remove('d-none');
    document.getElementById('userNewImg3').classList.remove('d-none');
    document.getElementById('selectAll').innerHTML = '';
    wasMenuOpen = false;
}

function cancelAddNewUser(){
    document.getElementById('userNewParent').innerHTML =
    `
    <input id="userNew" name="userName" type="text" readonly="true" required placeholder="Select contacts to assign" >
    <img id="userNewImg0" src="assets/img/dropdown_arrow.png" onclick="showContact()">
    <img id="userNewImg1" class="d-none styleImg" src="assets/img/cancelBlue.png" onclick="cancelAddNewUser()">
    <img id="userNewImg2" class="d-none styleImg" src="assets/img/separation.png">
    <img id="userNewImg3" class="d-none styleImg" src="assets/img/checkBlue.png" onclick="checkAddNewUser()">
    `;
}

async function checkAddNewUser(){
    let color = Math.floor(Math.random()*16777215).toString(16);
    let email = document.getElementById('userNew').value;
    let name = 'New Contact';
    let phone = '000000' ;
    let contact = { fullname: name, mail: email, phone: phone, color: color };
    contacts.push(contact);
    await backend.setItem('contacts', JSON.stringify(contacts));
    cancelAddNewUser();
    /* document.getElementById('userNew').value = name; */  
    wasMenuOpen = false;

}
