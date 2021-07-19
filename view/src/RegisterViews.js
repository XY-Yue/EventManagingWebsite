import AccountPresenter from "./presenter/AccountPresenter.js";

// Sets event listeners for elements in the HTML file
document.getElementById("login").addEventListener("click", jumpToLogin);
document.getElementById("continue").addEventListener("click", createAccount);
document.getElementById("type").innerHTML += new AccountPresenter().accountTypes();
document.getElementById("type").addEventListener("change", needInvitation);
document.getElementById("invitation").style.display = "none";
document.getElementById("invitationLabel").style.display = "none";

// Handles account creation request from user
function createAccount(){
    let username = document.getElementById("username").value.toString();
    let password = document.getElementById("password").value.toString();
    let type = document.getElementById("type").value.toString();
    let invitation = document.getElementById("invitation").value.toString();
    let presenter = new AccountPresenter();

    if (username === ""){
        document.getElementById("invalidUsernameWarning").innerHTML = "Username cannot be empty!";
        document.getElementById("invalidPasswordWarning").innerHTML = "";
        document.getElementById("invalidInvitationWarning").innerHTML = "";
        return;
    }

    if (presenter.checkUsername(username)){
        document.getElementById("invalidUsernameWarning").innerHTML = "Username already exist!";
        document.getElementById("invalidPasswordWarning").innerHTML = "";
        document.getElementById("invalidInvitationWarning").innerHTML = "";
        return;
    }

    if (password === ""){
        document.getElementById("invalidUsernameWarning").innerHTML = "";
        document.getElementById("invalidPasswordWarning").innerHTML = "Password cannot be empty!";
        document.getElementById("invalidInvitationWarning").innerHTML = "";
        return;
    }

    if (type !== "attendee" && !presenter.checkInvitation(type, invitation)){
        document.getElementById("invalidUsernameWarning").innerHTML = "";
        document.getElementById("invalidPasswordWarning").innerHTML = "";
        document.getElementById("invalidInvitationWarning").innerHTML = "Incorrect invitation code!";
        return;
    }

    presenter.createAccount(type, username, password);
    sessionStorage.setItem("curAccount", username);
    sessionStorage.setItem("curType", type);
    window.open("MainPage.html", "_self");
}


function jumpToLogin(){
    window.open("LoginPage.html", "_self");
}


function needInvitation(){
    if (this.value === "attendee"){
        document.getElementById("invitation").style.display = "none";
        document.getElementById("invitationLabel").style.display = "none";
    }else {
        document.getElementById("invitation").style.display = "inline";
        document.getElementById("invitationLabel").style.display = "inline";
    }
}
