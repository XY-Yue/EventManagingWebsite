import MessageSendingPresenter from "./presenter/MessageSendingPresenter.js";
import {extractCheckboxResult} from "./InputParser.js";

let curAccount = sessionStorage.getItem("curAccount");
let presenter;

// Checks if there is a user logged in, if not, we cannot enter this page
if (curAccount == null) {
    window.open("MainPage.html", "_self");
}else {
    presenter = new MessageSendingPresenter();

    // Loads friend contact information into the checkbox field
    // If there is no friends, we do not need to display the checkbox field
    let friends = presenter.getAllFriends(curAccount);
    if (friends === ""){
        document.getElementById("chooseFriendsLabel").style.display = "none";
        document.getElementById("friends").style.display = "none";
    }else {
        document.getElementById("friends").innerHTML = friends;
    }
    // Adds on click listener to the submit button
    document.getElementById("continue").addEventListener("click", sendMessage);
}


// Respond to the request to send messages, sends all input to presenter, and output the result/warning
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