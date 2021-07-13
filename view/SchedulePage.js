import AccountEventPresenter from "./presenter/AccountEventPresenter.js";
import {updateListener} from "./EventDisplayer.js";

var curAcc = sessionStorage.getItem("curAccount");

if (sessionStorage.getItem("curAccount") == null) {
    window.open("MainPage.html", "_self");
}

var eventAccount = new AccountEventPresenter(curAcc);
eventAccount.getFullSchedule(); // First let the presenter to get the full schedule

document.getElementById("moreEventsButton").addEventListener("click", addMoreContent);
document.getElementById("moreEventsButton").style.display = "none";
document.getElementById("currentTrue").checked = true;
document.getElementById("currentTrue").addEventListener("change", onChangeRadioButton);
document.getElementById("currentFalse").addEventListener("change", onChangeRadioButton);

addMoreContent();

// Loads more event data onto the page
// Should have an instance of EventPresenter initialized before calling
function addMoreContent(){
    let content;
    let current = document.getElementById("currentTrue").checked;
    let titleStatus;
    if (current){
        content = eventAccount.getMoreCurrent();
        titleStatus = "current";
    }else {
        content = eventAccount.getMoreExpired();
        titleStatus = "expired";
    }

    if (content === ""){
        document.getElementById("mySchedule").innerHTML += "No more " + titleStatus + " events...";
        document.getElementById("moreEventsButton").style.display = "none";
    }else {
        document.getElementById("mySchedule").innerHTML += content;
        document.getElementById("moreEventsButton").style.display = "block";
    }
    updateListener();
}


function onChangeRadioButton(){
    document.getElementById("mySchedule").innerHTML = "";
    addMoreContent();

}