import AccountPresenter from "./presenter/AccountPresenter.js";

// First extract the username from query text in URL
var userName = window.location.search.toString();
var curAcc = sessionStorage.getItem("curAccount");
var isSelf = false;
if (userName === ""){
    userName = curAcc;
    if (userName != null){
        isSelf = true;
    }
}else {
    userName = userName.split("=")[1];
    isSelf = false;
}
document.getElementById("title").innerHTML = userName + "'s profile page";

document.getElementById("viewMessage").addEventListener("click", jumpToMessage);
document.getElementById("viewSchedule").addEventListener("click", jumpToSchedule);
document.getElementById("changePassword").addEventListener("click", changePasswordRequest);
document.getElementById("applyPwdChange").addEventListener("click", changePassword);
document.getElementById("addFriend").addEventListener("click", addFriend);

if (curAcc == null || curAcc === userName){
    document.getElementById("addFriend").style.display = "none";
}

if (!isSelf){
    document.getElementById("passwordRow").style.display = 'none';
    document.getElementById("messageRow").style.display = 'none';
    document.getElementById("viewSchedule").style.display = 'none';
    document.getElementById("changePassword").style.display = 'none';
}

if (userName != null && userName !== ""){
    let account = new AccountPresenter().getAccount(userName);

    document.getElementById("type").innerHTML = account.type;

    if (isSelf){
        document.getElementById("messages").innerHTML =
            "You have " + account.unreadMessages + " unread messages.";
        document.getElementById("events").innerHTML =
            "You have " + account.numberOfEvents[0] + " up coming events.<br>";
        document.getElementById("events").innerHTML +=
            "You have attended " + account.numberOfEvents[1] + " events.";
    }else {
        document.getElementById("events").innerHTML =
            userName + " has attended " + account.numberOfEvents[1] + " events.";
    }

    let spec = account.specialEvents;
    if (spec === ""){
        document.getElementById("specialList").style.display = "none";
    }else {
        document.getElementById("specialEvents").innerHTML = userName + "'s " + spec;
    }
}


function jumpToMessage(){
    window.open("MessageViewingPage.html?name=" + curAcc, "_self");
}


function jumpToSchedule(){
    window.open("SchedulePage.html?name=" + curAcc, "_self");
}


function changePasswordRequest(){
    document.getElementById("passwordChanger").style.display = 'block';
}


function changePassword(){
    let oldPwd = document.getElementById("oldPwd").value.toString();
    if (oldPwd === ""){
        document.getElementById("invalidOldPwdWarning").innerHTML = "enter old password here...";
    }else {
        let newPwd = document.getElementById("password").value.toString();
        if (newPwd === ""){
            document.getElementById("invalidOldPwdWarning").innerHTML = "";
            document.getElementById("invalidPasswordWarning").innerHTML = "enter new password here...";
        }else {
            if (new AccountPresenter().changePassword(curAcc, oldPwd, newPwd)){
                alert("Password for " + curAcc + " changed!");
                document.getElementById("passwordChanger").style.display = 'none';
            }else {
                document.getElementById("invalidOldPwdWarning").innerHTML = "incorrect old password...";
                document.getElementById("invalidPasswordWarning").innerHTML = "";
            }
        }
    }
}


function addFriend(){
    alert(new AccountPresenter().addFriend(curAcc, userName));
}