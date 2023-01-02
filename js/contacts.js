let contacts = []; 
let priority_selected = "";
let color;
let currentContact;
/* let tasks =[]; */
let isSelectOpen =false;
let wasCategoryOpen = false;
let wasMenuOpen = false;
let selectedNames=[];
let selectedNamesTasks =[];
let selectNamesWithoutSpace =[];
async function init() {
    setURL('https://join.russell-tchamba.de/smallest_backend_ever');
    await downloadFromServer();
    await loadContacts();
    await loadTask(); 
    await loadCategory();
    /* await deleteContacts(); */
    await showContacts();
    // await deleteUser();  
}

async function deleteContacts(){
    for (let i = 0; i < contacts.length; i++) {
        const element = contacts[i];
        if(element['fullname'] == ''){
            contacts.splice(i,1);
        }     
    } 
    /* await backend.setItem('contacts', JSON.stringify(contacts));  */ 
}

async function loadTask() {
    tasks = await backend.getItem('tasks') || [];
}

async function saveTask() {
    await backend.setItem('tasks', tasks);
    
}

async function loadCategory() {
    categories = await backend.getItem('categories') || [];
}

async function saveCategory() {
    await backend.setItem('categories', categories);    
}


async function loadContacts() {
    contacts = await JSON.parse(backend.getItem('contacts')) || [];
}


async function newContact() {
    let name = document.getElementById('newContact-name');
    let email = document.getElementById('newContact-email');
    let phone = document.getElementById('newContact-phone');
    color = Math.floor(Math.random()*16777215).toString(16);
    addNewContactToArray(name, email, phone, color);
    showContacts();
}


async function addNewContactToArray(name, email, phone, color) {
    let contact = { fullname: name.value, mail: email.value, phone: phone.value, color: color };
    contacts.push(contact);
    await backend.setItem('contacts', JSON.stringify(contacts));
    /* clearNewContactInputfields(name, email, phone);  */   
}


function clearNewContactInputfields(name, email, phone) {
    name.value = '';
    email.value = '';
    phone.value = '';
}

// Function shows Contact Book with Contacts //

async function showContacts() {
    
    document.getElementById('contact-book').innerHTML = ``;
    contacts.sort(function (a, b) {
    if (a.fullname < b.fullname){
        return -1;
    }
    if (a.fullname > b.fullname) {
        return 1;
    }
    /* return 0; */
    });
    showLetters();
}

async function showLetters(){
    let letter;
    let letter2;
    await deleteContacts();
    for (let i = 0; i < contacts.length; i++){
        letter=contacts[i].fullname.slice(0,1);
        /* if(window.letter){
            /* contacts[i]['fullname']= "toDelete" 
            letter =" ";
        } */
           /*  if(i!=contacts.length-1){
                letter2=contacts[i+1].fullname.slice(0,1);
            } */
            /* if (i==0){ */
                document.getElementById('contact-book').innerHTML += `<div class="letter">${letter} <br></div> <div class="letter-child"></div> `;
           // }
        document.getElementById('contact-book').innerHTML += await renderContactTemplate(i);
            /* if( (letter!=letter2)  ){
                document.getElementById('contact-book').innerHTML += `<div class="letter">${letter2} <br></div><div class="letter-child"></div> `;
            } */
    }
}

function showDetailsContact(i){
    const indexSpace = contacts[i].fullname.indexOf(' ') ; 
    const ShortName = contacts[i].fullname.charAt(0) + contacts[i].fullname.charAt(indexSpace+1);   
    document.getElementById('contactOverview').innerHTML= 
    `<div class="contact-card">
    <div id="contact-right-box">
        <div class="contact-header">
            <div style="background: #${contacts[i].color}" class="contact-short-name">
                ${ShortName.toUpperCase()}
            </div>
            <div class="contact-header-child">
                <div id="contName" class="contact-name">${contacts[i].fullname}</div>
                <div class="add-task" onclick="openNav_contact(); generateOverlay('todo')">
                    <img src="./assets/img/plus.png" alt="">
                    <p>  Add Task</p>
                </div>
            </div>
        </div>
        <div id="contactEdit">
            <div class="contact-headline">Contact Information</div>
                <div id="contactEdit-child">
                    <img src="./assets/img/edit_stift.png" alt="">
                    <a href="#" onclick="contactEditable(${i})">  Edit Contact</a>
                </div>
        </div>
        <div id="informations">
            <div class="contact-email">E Mail</div>
            <div id="contMail-parent"><a id="contMail" href="mailto:${contacts[i].mail}">${contacts[i].mail}</a></div>
            <div class="contact-phone">Mobil</div>
            <div id="contPhone" class"phone-number">${contacts[i].phone}</div>
        </div>
        </div>

        <div class="btn">
            <button id="button-contact1" class="button-contact" onclick="openNewContact()" >New contact <img  class="capa" src="/assets/img/Capa.png" alt=""></button>
        </div>

        
    </div>
    
    `;
    widthCheck();
}


function widthCheck(){
    if( document.body.clientWidth < 750 ){
        document.getElementById('contact-book').style.cssText ='display:none !important';
        document.getElementById('contactOverview').style.cssText ='width:90% !important';
        document.getElementById('contact-right-box').style.cssText ='display:block !important';
        document.getElementById('retourContact').style.cssText ='display:block';
        document.getElementById('button-contact1').style.cssText ='display:none';
        /* document.getElementById('retourContact').classList.remove('d-none'); */
    }  
}


function contactEditable(i){
    const indexSpace = contacts[i].fullname.indexOf(' ') ; 
    const ShortName = contacts[i].fullname.charAt(0) + contacts[i].fullname.charAt(indexSpace+1);  
    openNewContact();
    document.getElementById('contactOverlayTitle').innerHTML = `Edit Contact`; 
    document.getElementById('closeContactEdit').style.cssText ='display:block !important'; 
    document.getElementById('shortNameCont').innerHTML =   
        `<div style="background: #${contacts[i].color}" class="contact-short-name">
        ${ShortName.toUpperCase()}
        </div>`; 
    document.getElementById('newContact-name').value = document.getElementById('contName').innerHTML;
    document.getElementById('newContact-email').value = document.getElementById('contMail').innerHTML;
    document.getElementById('newContact-phone').value = document.getElementById('contPhone').innerHTML;
    document.getElementById('newContact-name').contentEditable = true;
    document.getElementById('newContact-email').contentEditable = true;
    document.getElementById('newContact-phone').contentEditable = true;
    document.getElementById('buttons').style.cssText ='display:none';
    document.getElementById('overlayContent').style.cssText ='background: #005DFF';
    document.getElementById('btn-save').classList.remove('d-none');
    currentContact = i;
} 

async function saveContact(){
    document.getElementById('newContact-name').contentEditable = false;
    document.getElementById('newContact-email').contentEditable = false;
    document.getElementById('newContact-phone').contentEditable = false;
    contacts[currentContact].mail =  document.getElementById('newContact-email').innerHTML;
    contacts[currentContact].fullname =  document.getElementById('newContact-name').innerHTML;
    contacts[currentContact].phone =  document.getElementById('newContact-phone').innerHTML; 
    await showContacts();
}

async function renderContactTemplate(i){
 const indexSpace = contacts[i].fullname.indexOf(' ') ; 
 const ShortName = contacts[i].fullname.charAt(0) + contacts[i].fullname.charAt(indexSpace+1); 
    return `   <div class="content-left" onclick="showDetailsContact(${i})">
    <div class="contact-box">
    <div style="background: #${contacts[i].color}" class="short-name">
    ${ShortName.toUpperCase()}
    </div>
        <div class="contact-info">
            <span>${contacts[i].fullname}</span>
            <a href="mailto:${contacts[i].mail}">${contacts[i].mail}</a>
        </div>        
    </div> 
    </div> 
    `;
}


function openNewContact() { 
    if( document.body.clientWidth < 850 ){ 
        document.getElementById("contact-overlay-body").classList.add('d-none');   
    }else{
        document.getElementById("contact-overlay-body").style.opacity = "0.5";
    }
    if( document.body.clientWidth < 320 ){
        document.getElementById('closeContact').style.cssText ='display:block !important';
    }else{
        document.getElementById('closeContact').style.cssText ='display:none !important';
    }
    document.getElementById('contact-overlay').classList.remove('d-none');
    document.getElementById('contactOverlayTitle').innerHTML = `Add Contact`; 
    document.getElementById('buttons').style.cssText ='display:flex'; 
    document.getElementById('btn-save').classList.add('d-none');
    document.getElementById('overlayContent').style.cssText ='background: #4589FF';
    document.getElementById('newContact-name').value = '';
    document.getElementById('newContact-email').value = '';
    document.getElementById('newContact-phone').value = '';
    document.getElementById('shortNameCont').innerHTML =   
        `<img  src="/assets/img/newContact.png" alt="">`; 
}


function closeNewContact(){
    document.getElementById('contact-overlay').classList.add('d-none');
    document.getElementById("contact-overlay-body").style.opacity = "1";
    document.getElementById('newContact-name').value = '';
    document.getElementById('newContact-email').value = '';
    document.getElementById('newContact-phone').value = '';
    if( document.body.clientWidth < 850 ){
        document.getElementById("contact-overlay-body").classList.remove('d-none');
    }    
}


function retourContacts(){ 
    document.getElementById('button-contact1').style.cssText ='display:block';
    document.getElementById('retourContact').style.cssText ='display:none';
    window.location.href='contacts.html';
    
}


async function generateOverlay(state){
    document.getElementById("myNav").innerHTML =/*html*/ `
   <img class="closebtn" onclick="closeNav_contact()" src="./assets/img/closeX.png" alt="">
    <div id="createTask-overlay">
       <span class="addTask-text-overlay">Add Task</span>
         
        
    </div>
    <div class="overlay-content">
        <div class="addTask-board">
        <form id="form_contact"  onsubmit="addTask_contact('${state}'); taskAddedToBord_contact(); return false;">
            <div class="left-box">
                <!--Title-->
    
                    <input class="title-contact inputContact" id="title" type="text" required placeholder="Enter a title">
    
    
                <!--Select Contacts-->
                  
                <div class="selectContacts">

                    <div id="userNewParentC" class="input_select_contacts">
                        <input id="userNewC" class="inputContact" name="userNameC" type="text" readonly="true" required placeholder="Select contacts to assign" >
                        <img id="userNewImg0C" src="assets/img/dropdown_arrow.png" onclick="showContact_contact()">
                        <img id="userNewImg1C" class="d-none styleImg" src="assets/img/cancelBlue.png" onclick="cancelAddNewUser()">
                        <img id="userNewImg2C" class="d-none styleImg" src="assets/img/separation.png">
                        <img id="userNewImg3C" class="d-none styleImg" src="assets/img/checkBlue.png" onclick="checkAddNewUser()">
                    </div>
            
                    <div id="selectAll3" class="selectAll" style="display: none"> </div> 
                                      
                </div>   
    
                <!--Due Date-->
    
                    <span class="spanContact">Due date</span>
                    <div class="dueDate"  >
                    <input class="inputContact" id="dueDate" minlength="10" maxlength="10" type="date" required >
                    
                </div>
    
                <!--Category-->
                
                    <span class="spanContact">Category</span>
                    <div class="selectContacts"   >

                            <div id="categoryNewParent3" class="input_select_contacts">
                                <input id="categoryNew3" class="inputContact" name="categoryName3" type="text" readonly="true" required placeholder="Select Task category" >
                                <img id="categoryNewImg0C" src="assets/img/dropdown_arrow.png" onclick="showCategory_contact()">
                                <img id="categoryNewImg1C" class="d-none styleImg" src="assets/img/cancelBlue.png" onclick="cancelAddNewCategory_contact()">
                                <img id="categoryNewImg2C" class="d-none styleImg" src="assets/img/separation.png">
                                <img id="categoryNewImg3C" class="d-none styleImg" src="assets/img/checkBlue.png" onclick="checkAddNewCategory_contact()">
                            </div>
                       <!--  </div> -->
                
                        <div id="categoryAll3" class="selectAll"> </div> 
                
                        
                    </div>
                
                <!--Priority-->
    
                <div class="priority">
    
                    <button id="button_prio_high3" onclick="clickPriority_contact ('high')" value="high" type="button"  class="b1">Urgent <img id="imgPrioHigh3" src="assets/img/red_arrow.png"></button> 
    
                    <button id="button_prio_middle3" onclick="clickPriority_contact ('middle')" value="middle" type="button" class="b2">Medium <img id="imgPrioMiddle3" src="assets/img/medium.png"></button>
    
                    <button id="button_prio_low3" onclick="clickPriority_contact ('low') " value="low" type="button"  class="b3">Low <img id="imgPrioLow3" src="assets/img/green_arrow.png"></button>
    
                </div>   
                 
    
                <!--Description-->
                    
                    <span class="spanContact">Description</span>
    
                    <input required class="description"  type="text"
                    
                    id="description"  placeholder="Enter a description..">
    
                    <!-- </input> -->

                    <button class="createTask-btn" type="submit" value="Submit"> <span class="createTask-btn-text">Create task</span>  <img class="createTask-btn-img" src="./assets/img/checkOK.png" alt="">

                    </button>
    
            </div>
                <!--Add Task Button Confirm-->
            
    
            </div>
            
            
            </form>
        
    
            <div class="showCreateTask d-none" id="showCreateTask3">Task added to board</div>
    </div>
  </div>
    
    `;

}

function openNav_contact() { 
    if(document.body.clientWidth < 950){
        /* document.getElementById('board-body').classList.add('d-none'); */
        document.getElementById('contact-overlay-body').classList.add('d-none');
        document.getElementById("myNav").style.width = "100%";
    }
    else if(document.body.clientWidth >= 950 && document.body.clientWidth < 1200)
        {document.getElementById("myNav").style.width = "50%";
    }else
        {document.getElementById("myNav").style.width = "45%";
    }
        document.getElementById("contact-overlay-body").style.opacity = "0.5";
        document.getElementById("contact-overlay-body").style.pointerEvents = 'none';  
           
}

function closeNav_contact() {
    document.getElementById('contact-overlay-body').classList.remove('d-none');
    document.getElementById('footerContact').classList.remove('d-none');
    document.getElementById("myNav").style.width = "0%";
    document.getElementById("contact-overlay-body").style.opacity = "1";
    document.getElementById("contact-overlay-body").style.pointerEvents = 'auto';
    wasCategoryOpen = false;
    wasMenuOpen = false;
}

async function addTask_contact(status){
    let idNew = idlogic();
    let title = document.getElementById('title');
    let dateValue = document.getElementById("dueDate"); 
    let selectContacts = [];
    for (let i=0;i<selectedNames.length;i++){
        
        if (document.getElementById(selectNamesWithoutSpace[i] + "_").checked == true) {
            selectContacts.push(document.getElementById(selectNamesWithoutSpace[i] + "_").value); 
            console.log('selectContacts 412',selectContacts)          
        }
    }
    let uniqueSelected = [...new Set(selectContacts)]; 
    let category = document.getElementById('categoryNew3');
    let description = document.getElementById('description');

    tasks.push(
        {
            'title': title.value,
            'selectContacts': uniqueSelected,
            'date': dateValue.value,
            'category': category.value,
            'priority': priority_selected,
            'description': description.value,
            'id': idNew,
            'state': status

        });

    await saveTask();
    taskAddedToBord_contact();
    wasCategoryOpen = false;
    wasMenuOpen = false;

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

function taskAddedToBord_contact() {
    closeNav_contact();
    document.getElementById('showCreateTask3').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('showCreateTask3').classList.add('downShowCreateTask');
    }, 2000)

    setTimeout(() => {
        document.getElementById('showCreateTask3').classList.add('d-none');
        document.getElementById('showCreateTask3').classList.remove('downShowCreateTask');
    }, 2300)
}

function showContact_contact(){ 
    /* document.getElementById("button-contact1").classList.remove('button-contact');   */
        let y = document.getElementById("selectAll3"); 
     
             if (y.style.display === "none") {
                 /* x.innerHTML =''; */
                y.style.display = "block";
                if(!wasMenuOpen){
                    for (let i = 0; i < contacts.length; i++) {           
                        y.innerHTML += allContacts_contact(i);
                    }
                    y.innerHTML += ` <div id="newContact3" class="selectName" onclick="addNewUser()"> <a id="newUserNameC" href="#"   placeholder="Invite new Contact">Invite new Contact</a>
                        <img class="styleImgContact" src="assets/img/contactImg.png">  </div>         
                        `;
                    wasMenuOpen = true;
                }
             } else {
                 
                 y.style.display = "none";
             }    
}

function allContacts_contact(i) {    
    /* selectedNames.splice(i,1); */
    let name = contacts[i].fullname;
    let nameWithoutSpace=name.replace(/\s/g,'');
    selectedNames.push(name);
    console.log('selectedNames 493',selectedNames)
    selectNamesWithoutSpace.push(nameWithoutSpace);
    console.log('selectNamesWithoutSpace 495',selectNamesWithoutSpace)
    return `
    
                <a href="#" class="selectName">
                 <label for="${nameWithoutSpace}">${name}</label>
                    <div>
                <input   type="checkbox" id="${nameWithoutSpace}_" name="${nameWithoutSpace}" value="${name}">
                    </div>
                </a>

            `;
}

function addNewUser(){
    document.getElementById('userNewC').value = '';
    document.getElementsByName('userNameC')[0].placeholder = 'Contact email';
    document.getElementById('userNewC').readOnly = false;
    document.getElementById('userNewImg0C').classList.add('d-none');
    document.getElementById('userNewImg1C').classList.remove('d-none');
    document.getElementById('userNewImg2C').classList.remove('d-none');
    document.getElementById('userNewImg3C').classList.remove('d-none');
    document.getElementById('selectAll3').innerHTML = '';
    wasMenuOpen = false;
}

function cancelAddNewUser(){
    document.getElementById('userNewParentC').innerHTML =
    `
    <input id="userNewC" class="inputContact" name="userNameC" type="text" readonly="true" required placeholder="Select contacts to assign" >
    <img id="userNewImg0C" src="assets/img/dropdown_arrow.png" onclick="showContact_contact()">
    <img id="userNewImg1C" class="d-none styleImg" src="assets/img/cancelBlue.png" onclick="cancelAddNewUser()">
    <img id="userNewImg2C" class="d-none styleImg" src="assets/img/separation.png">
    <img id="userNewImg3C" class="d-none styleImg" src="assets/img/checkBlue.png" onclick="checkAddNewUser()">
    `;
}

async function checkAddNewUser(){
    let color = Math.floor(Math.random()*16777215).toString(16);
    let email = document.getElementById('userNewC').value;
    let name = 'New Contact';
    let phone = '000000' ;
    let contact = { fullname: name, mail: email, phone: phone, color: color };
    contacts.push(contact);
    await backend.setItem('contacts', JSON.stringify(contacts));
    cancelAddNewUser();
    showContacts();
    /* document.getElementById('userNew').value = name; */  
    wasMenuOpen = false;

}





function showCategory_contact(){
    let x = document.getElementById("categoryAll3");
    if (x.style.display === "none"){
       /* x.innerHTML ='';  */
       x.style.display = "block";
       if(!wasCategoryOpen){
           for (let i = 0; i < categories.length; i++) {           
               x.innerHTML += eachCategoryshowed_contact(i);
           }
           x.innerHTML += `<a id="newCatName3" href="#" class="selectName" onclick="addNewCategory_contact()" placeholder="New Category name">New Category name</a>           
           `;
           wasCategoryOpen = true;
       }        
    }
    else {
        x.style.display = "none";
    }
}

function eachCategoryHardCoded_contact() {
    return `     
    <a href="#" class="selectName" onclick="catchCategory_contact('Backoffice')">Backoffice</a>
    <a href="#" class="selectName" onclick="catchCategory_contact('Design')">Design</a>
    <a href="#" class="selectName" onclick="catchCategory_contact('Software')">Software</a>
    <a href="#" class="selectName" onclick="catchCategory_contact('Hardware')">Hardware</a>
    `;
}

function eachCategoryshowed_contact(i){
    return `
    <a href="#" class="selectName" onclick="catchCategory_contact('${categories[i]}')">${categories[i]}</a>   
    `;
}

function catchCategory_contact(i){
    document.getElementById('categoryNew3').value=i;
    document.getElementById('categoryAll3').innerHTML = '';
    wasCategoryOpen = false;
}

function clickPriority_contact(priority) {

    let button_prio_high = document.getElementById('button_prio_high3');
    let button_prio_middle = document.getElementById('button_prio_middle3');
    let button_prio_low = document.getElementById('button_prio_low3');
    let prioImgHigh = document.getElementById('imgPrioHigh3');
    let prioImgMedium = document.getElementById('imgPrioMiddle3');
    let prioImgLow = document.getElementById('imgPrioLow3');
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

function addNewCategory_contact(){
    document.getElementById('categoryNew3').value = '';
    document.getElementsByName('categoryName3')[0].placeholder = 'New Category name';
    document.getElementById('categoryNew3').readOnly = false;
    document.getElementById('categoryNewImg0C').classList.add('d-none');
    document.getElementById('categoryNewImg1C').classList.remove('d-none');
    document.getElementById('categoryNewImg2C').classList.remove('d-none');
    document.getElementById('categoryNewImg3C').classList.remove('d-none');
    document.getElementById('categoryAll3').innerHTML = '';
    wasCategoryOpen = false;
}

function cancelAddNewCategory_contact(){
    document.getElementById('categoryNewParent3').innerHTML =
    `
    <input id="categoryNew3" class="inputContact" name="categoryName" type="text" readonly="true" required placeholder="Select Task category" >
    <img id="categoryNewImg0C" src="assets/img/dropdown_arrow.png" onclick="showCategory_contact()">
    <img id="categoryNewImg1C" class="d-none styleImg" src="assets/img/cancelBlue.png" onclick="cancelAddNewCategory()">
    <img id="categoryNewImg2C" class="d-none styleImg" src="assets/img/separation.png">
    <img id="categoryNewImg3C" class="d-none styleImg" src="assets/img/checkBlue.png" onclick="checkAddNewCategory()">
    `;
}

async function checkAddNewCategory_contact(){
    let NewCategory = document.getElementById('categoryNew3').value;
    categories.push(NewCategory);
    await saveCategory();
    cancelAddNewCategory_contact();
    document.getElementById('categoryNew3').value = categories.slice(-1);  
    wasCategoryOpen = false;

}
