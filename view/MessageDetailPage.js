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
    // start the search and get the message object
    let message = presenter.getSingleMessage(messageID, curAccount);
    // Fill in the data
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

// Deletes a message from the current user's data
function deleteMessage(){
    presenter.deleteMessage(messageID, curAccount);
}