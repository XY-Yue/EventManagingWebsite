if (localStorage.getItem("curAccount") != null){
    document.documentElement.style.setProperty('--guest-option', 'none');
    document.documentElement.style.setProperty('--account-option', 'block');
}else {
    document.documentElement.style.setProperty('--guest-option', 'block');
    document.documentElement.style.setProperty('--account-option', 'none');
}

function jumpToEventSearch(){
    window.open("EventSearchPage.html", "_self");
}

function jumpToAbout(){
    window.open("AboutPage.html", "_self");
}

function jumpToLogin(){
    window.open("LoginPage.html", "_self");
}

function jumpToSignUp(){
    window.open("RegisterPage.html", "_self");
}

function jumpToMyMessage(){
    window.open("MessageViewingPage.html", "_self");
}

function jumpToMyAccount(){
    window.open("AccountInfoPage.html", "_self");
}

function jumpToMyEvent(){
    window.open("SchedulePage.html", "_self");
}

function jumpToMain(){
    window.open("MainPage.html", "_self");
}

function jumpToRoom(){
    window.open("RoomViewingPage.html", "_self");
}