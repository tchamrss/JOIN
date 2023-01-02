let users = [];
let guests = [];
let mailOfForgottenPw =[]; 
let signUpDone = false;
let userNoFound = true;
/**
 * This function load the users from the server at the beginning and save it in the users-array
 */
async function init() {
    setURL('https://gruppe-307.developerakademie.net/smallest_backend_ever') ;
    await downloadFromServer();
    await loadUser();
   
}

async function loadUser(){
    users = await JSON.parse(backend.getItem('users')) || [];
    guests = await JSON.parse(backend.getItem('guests')) || [];    
}

/**
 * This function check the Log In data of the user
 */

function loginUser(){
    let userMail= document.getElementById('inputEmail-child');
    let userPassword= document.getElementById('inputPassword-child');
    /* console.log(userMail);
    console.log(userPassword); */
    for (let i = 0; i < users.length; i++) {
        const element = users[i];
        if(element.Mail == userMail.value && element.Password == userPassword.value){
            userNoFound = false;
            window.open('./assets/templates/desktop_template.html', "_self");
            generateMessageLogIn(userNoFound); 
        }     
    }
    if(userNoFound){
        generateMessageLogIn(userNoFound);   
    }
    userMail.value ='';
    userPassword.value ='';
}

function guest(){
    window.open('./assets/templates/desktop_template.html');
}

/**
 * This function add a user to the server
 */

async function addUser() {
    let userName= document.getElementById('inputName-child-su');
    let userMail= document.getElementById('inputEmail-child-su');
    let userPassword= document.getElementById('inputPassword-child-su');
    let user = {
        "Name": userName.value, 
        "Mail": userMail.value, 
        "Password": userPassword.value 
    };
    users.push(user);
    await backend.setItem('users', JSON.stringify(users));
    users.push(user);
    signUpDone = true;  
    generateMessage(signUpDone);
    userName.value ='';
    userMail.value ='';
    userPassword.value ='';
    
}

/**
 * This function delete a user from the server
 */
async function deleteUser(name) {
    for (let i = 0; i < users.length; i++) {
        const element = users[i];
        if(element.Name == 'name'){
            users.splice(i,1);
            await backend.deleteItem('users[i]');
            safeUser();
            break;
        }     
    }   
}

async function safeUser(){
    await backend.setItem('users', JSON.stringify(users));
    await backend.setItem('guests', JSON.stringify(guests));
    await loadUser();
}

/**
 * This function generate a message after the user have been registrated
 * @param {boolean} actionDone - this give up the confirmation for Sign up or Log in
 */
function generateMessage(actionDone){
    
    if(actionDone){
        document.getElementById('msgBox').innerHTML = `<span>Registration successfull go back to log in</span>`;
    }else{
        document.getElementById('msgBox').innerHTML  = `<span>Registration not successfull</span>`;
    }
}

/**
 * This function generate a message after the user have been logged in
 */
function generateMessageLogIn(actionDone){   
    if(actionDone){       
        document.getElementById('msgBoxLogIn').innerHTML = `<span>Log In not successfull: Mail or Password not correct!</span>`;
    }else{
        document.getElementById('msgBoxLogIn').innerHTML  = `<span>Log In successfull</span>`;
    }
}

async function resetpw(){
    loadEmail();
    let newPW = document.getElementById('newPassword');
    let confirmPW = document.getElementById('confirmPassword');
    if (newPW.value == confirmPW.value) {
        for (let i = 0; i < users.length; i++) {
            const element = users[i];
            if(element.Mail == mailOfForgottenPw[0]){
                users[i].Password = newPW.value;
                await safeUser();
                break;
            }     
        }   
        
        window.open('./confirmation.html', "_self");
    }else{
        document.getElementById('msgBoxReset').innerHTML  = `<span> Password confirmation failed </span>`;
    }
}

function saveMail(){
    let eMail = document.getElementById('inputEmail-child-su').value;
    mailOfForgottenPw[0]=eMail;
    let mailOfForgottenPwAsText = JSON.stringify(mailOfForgottenPw);
    localStorage.setItem('Mail', mailOfForgottenPwAsText);
    console.log('after save Mail:', mailOfForgottenPwAsText);
}

function loadEmail(){
    let mailOfForgottenPwAsText = localStorage.getItem('Mail');
    /* let test=localStorage.getItem('Mail'); */
    mailOfForgottenPw = JSON.parse(mailOfForgottenPwAsText);

}