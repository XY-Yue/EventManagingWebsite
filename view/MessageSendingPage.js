import MessageSendingPresenter from "./presenter/MessageSendingPresenter.js";
import {extractCheckboxResult} from "./InputParser.js";

let curAccount = sessionStorage.getItem("curAccount");
let presenter = new MessageSendingPresenter();

if (curAccount == null) {
    window.open("MainPage.html", "_self");
}else {
    let friends = presenter.getAllFriends(curAccount);
    if (friends === ""){
        document.getElementById("chooseFriendsLabel").style.display = "none";
        document.getElementById("friends").style.display = "none";
    }else {
        document.getElementById("friends").innerHTML = friends;
    }
    document.getElementById("continue").addEventListener("click", sendMessage);
}



function sendMessage(){
    let result = presenter.sendMessage(
        curAccount,
        document.getElementById("receivers").value.toString(),
        extractCheckboxResult("friend"),
        document.getElementById("subject").value.toString(),
        document.getElementById("content").value.toString()
    )

    if (result === "") {
        alert("Message sent successfully!");
        window.open("MessageViewingPage.html", "_self");
    }else {
        document.getElementById("invalidInputWarning").innerHTML = result;
    }
}