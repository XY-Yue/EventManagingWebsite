import MessageSearchingPresenter from "./presenter/MessageSearchingPresenter.js";

document.getElementById("sendMessage").addEventListener("click", sendMessage);


function sendMessage(){
    window.open("MessageSendingPage.html", "_self");
}