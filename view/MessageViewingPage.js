import MessageSearchingPresenter from "./presenter/MessageSearchingPresenter.js";
import {messageStatus} from "./presenter/MessageStatus.js";


let curAccount = sessionStorage.getItem("curAccount");
let presenter;

// Checks if there is a user logged in, if not, we cannot enter this page
if (curAccount == null) {
    window.open("MainPage.html", "_self");
}else{
    presenter = new MessageSearchingPresenter(curAccount);
    // Sets event listener for elements on the page
    document.getElementById("sendMessage").addEventListener("click", sendMessage);
    document.getElementById("received").checked = true;
    document.getElementById("received").addEventListener("change", onChangeStatus);
    document.getElementById("sent").addEventListener("change", onChangeStatus);
    document.getElementById("applyFilters").addEventListener("click", searchMessages);
    document.getElementById("moreMessagesButton").addEventListener("click", getMoreMessages);
    document.getElementById("moreMessagesButton").style.display = "none";
    // display received messages on the page
    searchMessages();
}

// Opens the page for message sending, responds to click event for the button at the top right corner
function sendMessage(){
    window.open("MessageSendingPage.html", "_self");
}

// Respond to user changing the choice of message status in the search field
function onChangeStatus(){
    if (this.checked){
        if (this.value === messageStatus.received){
            document.getElementById("usernameField").innerHTML = "Sender: ";
        }else if (this.value === messageStatus.sent){
            document.getElementById("usernameField").innerHTML = "Receiver: ";
        }
    }
}

// Start searching messages with the input in the Apply Filter block
function searchMessages(){
    let status;
    if (document.getElementById("sent").checked){
        status = messageStatus.sent;
    }else if (document.getElementById("received").checked){
        status = messageStatus.received;
    }

    let messages = presenter.searchMessage(
        status,
        document.getElementById("senderAndReceiver").value.toString(),
        document.getElementById("subject").value.toString()
    );

    document.getElementById("messageList").innerHTML = messages;
    updateListener();
    document.getElementById("moreMessagesButton").style.display = "block";
}

// Respond to user request to load more content onto the page
function getMoreMessages(){
    let content = presenter.getMoreMessages();

    if (content === ""){
        document.getElementById("messageList").innerHTML += "No more messages...";
        document.getElementById("moreMessagesButton").style.display = "none";
    }else {
        document.getElementById("messageList").innerHTML += content;
        updateListener();
    }
}

// Respond to user click event on the subject of a message to view its details
function viewElementDetails(){
    window.open("MessageDetailPage.html?id=" + this.id);
}

// Sets the on click listeners to all message subjects
export function updateListener(){
    let dt = document.getElementsByTagName("dt");
    for (let i = 0; i < dt.length; i++){
        dt[i].addEventListener("click", viewElementDetails);
    }
}