import EventPresenter from "./presenter/EventPresenter.js";
import {addMoreContent, updateListener} from "./EventDisplayer.js";
import {extractCheckboxResult, convertDate} from "./InputParser.js";

document.getElementById("searchStart").addEventListener("click", beginSearch);
document.getElementById("moreEventsButton").addEventListener("click", callAddMoreContent);
document.getElementById("moreEventsButton").style.display = "none";
document.getElementById("addEvent").addEventListener("click", addEvent);
var events = new EventPresenter();

// If user is an organizer, give the option to add a new event
if (sessionStorage.getItem("curAccount") != null && sessionStorage.getItem("curType") === "organizer"){
    document.getElementById("addEvent").style.display = "block";
}else {
    document.getElementById("addEvent").style.display = "none";
}

// Handles events on EventSearchPage.html
// Search events with the provided keywords and requirements
function beginSearch() {
    // We extract all values in the search field and search for those events, add the result to html
    let location = document.getElementById("roomChoice").value.toString();
    if (location !== "") {
        location = location.split(",");
    }

    let speaker = document.getElementById("speakerChoice").value.toString();
    if (speaker !== "") {
        speaker = speaker.split(",");
    }

    document.getElementById("searchResult").innerHTML = events.searchEvents(
        _extractRadioResult("vip"),
        _extractRadioResult("current"),
        document.getElementById("searchKeyword").value.toString(),
        location,
        convertDate(document.getElementById("startDate").value.toString(),
            document.getElementById("startHour").value.toString()),
        convertDate(document.getElementById("endDate").value.toString(),
            document.getElementById("endHour").value.toString()),
        extractCheckboxResult("type"),
        speaker
    );
    document.getElementById("searchResultTitle").innerHTML = "Found " + events.getNumResult() + " results:";
    if (events.getNumResult() === 0) {
        document.getElementById("moreEventsButton").style.display = "none";
    }else {
        document.getElementById("moreEventsButton").style.display = "block";
        updateListener();
    }

}


// Helper to extract user choice for a radio button
// name is the name of the radio buttons
function _extractRadioResult(name){
    let radio = document.getElementsByName(name);
    let choice = "";
    for (let i = 0; i < radio.length; i++){
        if (radio[i].checked){ // Finding the user's choice
            choice = radio[i].value.toString();
            break;
        }
    }
    if (choice === "true"){
        return 1;
    }else if (choice === "false") {
        return -1;
    }else {
        return 0;
    }
}


// A helper function to call addMoreContent, avoids duplicated code
function callAddMoreContent(){
    addMoreContent(events, "searchResult");
}


// Respond to user click for the add event button
function addEvent(){
    window.open("EventCreatingPage.html", "_self");
}