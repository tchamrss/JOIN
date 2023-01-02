let users = [];
let guests = [];
let mailOfForgottenPw =[]; 
let signUpDone = false;
let userNoFound = true;
let loggedUserName =[] ;
let contacts = [];
/**
 * This function load the users from the server at the beginning and save it in the users-array
 */
async function init() {
    setURL('https://join.russell-tchamba.de/smallest_backend_ever');
    await downloadFromServer();
    await loadUser();
    await loadContacts();
}


/**
 * This function load the users from the server
 */
async function loadUser(){
    users = await JSON.parse(backend.getItem('users')) || [];
    guests = await JSON.parse(backend.getItem('guests')) || [];    
}

/**
 * This function load the contacts from server
 */
async function loadContacts() {
    contacts = await JSON.parse(backend.getItem('contacts')) || [];
}

/**
 * This function check the Log In data of the user
 */

function loginUser(){
    let userMail= document.getElementById('inputEmail-child');
    let userPassword= document.getElementById('inputPassword-child');
    for (let i = 0; i < users.length; i++) {
        const element = users[i];
        if(element.Mail == userMail.value && element.Password == userPassword.value){
            //save logged user name for greeting later 
            loggedUserName[0]=element.Name;
            let loggedUserNameAsText = JSON.stringify(loggedUserName);
            localStorage.setItem('Name', loggedUserNameAsText);
            userNoFound = false;
            window.open('summary.html', "_self");
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
    window.open('summary.html', "_self");
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
        if(element.Name == name){
            users.splice(i,1);
            await backend.deleteItem('users[i]');
            safeUser();
            break;
        }     
    }   
}

/**
 * This function save the user at the server
 */
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

/**
 * This function check if the passwords are correct and reset them 
 */
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

/**
 * This function save the mail-adresse in the local storage
 */
function saveMail(){
    let eMail = document.getElementById('inputEmail-child-su').value;
    mailOfForgottenPw[0]=eMail;
    let mailOfForgottenPwAsText = JSON.stringify(mailOfForgottenPw);
    localStorage.setItem('Mail', mailOfForgottenPwAsText);
}

/**
 * This function load the mail-adresse from the local storage
 */
function loadEmail(){
    let mailOfForgottenPwAsText = localStorage.getItem('Mail');
    /* let test=localStorage.getItem('Mail'); */
    mailOfForgottenPw = JSON.parse(mailOfForgottenPwAsText);

}

/**
 * This function check the exxistance of the mail-adresse
 */
function isMailExisting(){
    let userMail= document.getElementById('inputEmail-child-su');
    let mailNoFound = true;
    for (let i = 0; i < users.length; i++) {
        const element = users[i];
        
        if(element.Mail == userMail.value){           
            mailNoFound = false;
            document.getElementById('msgBoxResetPW').style.cssText ='display:none';
            saveMail();
            return true;
        }     
    }
    if(mailNoFound){
        document.getElementById('msgBoxResetPW').style.cssText ='display:flex';
    }
    userMail.value ='';
    return false;

}