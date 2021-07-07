import AccountPresenter from "./presenter/AccountPresenter.js";

document.getElementById("signUp").addEventListener("click", jumpToSignUp);
document.getElementById("continue").addEventListener("click", authenticate);


function authenticate(){
    let username = document.getElementById("username").value.toString();
    let password = document.getElementById("password").value.toString();
    let presenter = new AccountPresenter();

    if (!presenter.checkUsername(username)){
        document.getElementById("invalidUsernameWarning").innerHTML = "Username does not exist!";
        document.getElementById("invalidPasswordWarning").innerHTML = "";
        return;
    }
    let type = presenter.checkPassword(username, password);
    if (type == null) {
        document.getElementById("invalidUsernameWarning").innerHTML = "";
        document.getElementById("invalidPasswordWarning").innerHTML = "Incorrect Password";
    }else {
        sessionStorage.setItem("curAccount", username);
        sessionStorage.setItem("curType", type);
        window.open("MainPage.html", "_self");
    }
}


function jumpToSignUp(){
    window.open("RegisterPage.html", "_self");
}