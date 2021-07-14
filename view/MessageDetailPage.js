import MessageSearchingPresenter from "./presenter/MessageSearchingPresenter.js";


let curAccount = sessionStorage.getItem("curAccount");
let messageID = window.location.search.toString();
let presenter;

// Checks if there is a user logged in and if there is a message ID in query text, if not, we cannot enter this page
if (curAccount == null || messageID === "") {
    window.open("MainPage.html", "_self");
}else {
    presenter = new MessageSearchingPresenter(curAccount);
    messageID = messageID.split("=")[1];
    document.getElementById("delete").addEventListener("click", deleteMessage);

    let message = presenter.getSingleMessage(messageID, curAccount);

    document.getElementById("subject").innerHTML = message.subject;
    document.getElementById("time").innerHTML = message.time;
    document.getElementById("content").innerHTML = message.content;
    document.getElementById("sender").innerHTML = message.sender;

    if (message.hasOwnProperty("receiver")){
        document.getElementById("receivers").innerHTML = message.receiver;
    }else {
        document.getElementById("receiverField").style.display = "none";
    }
}


function deleteMessage(){
    presenter.deleteMessage(messageID, curAccount);
}