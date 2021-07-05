import EventPresenter from "./presenter/EventPresenter.js";

document.getElementById("searchStart").addEventListener("click", beginSearch);
var events = new EventPresenter();

// Handles events on EventSearchPage.html
// Search events with the provided keywords and requirements
function beginSearch() {
    // We extract all values in the search field and search for those events, add the result to html
    document.getElementById("searchResult").innerHTML = events.searchEvents(
        _extractRadioResult("vip"),
        _extractRadioResult("current"),
        document.getElementById("searchKeyword").value.toString(),
        document.getElementById("roomChoice").value.toString().split(","),
        _convertDate(document.getElementById("startDate").value.toString(),
            document.getElementById("startHour").value.toString()),
        _convertDate(document.getElementById("endDate").value.toString(),
            document.getElementById("endHour").value.toString()),
        _extractCheckboxResult("type"),
        document.getElementById("speakerChoice").value.toString().split(",")
    );
    document.getElementById("searchResultTitle").innerHTML = "Found " + events.getNumResult() + " results:";
    updateListener();
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


// Helper to extract user choices from a checkbox input
// name is the name of the checkboxes
function _extractCheckboxResult(name){
    let checkbox = document.getElementsByName(name);
    let choice = [];
    for (let i = 0; i < checkbox.length; i++){
        if (checkbox[i].checked){ // Finding the user's choice
            choice.push(checkbox[i].value.toString());
        }
    }
    return choice;
}


// Helper to convert the user input date into an actual date object
// value: a date string in yyyy-mm-dd format, hour: hour of the date
function _convertDate(value, hour){
    let day = value.split("-");
    return new Date(
        parseInt(day[0], 10), // year
        parseInt(day[1], 10), // month
        parseInt(day[2], 10), // day
        parseInt(hour, 10) // hour
    );
}

// Jump to a page to display event details for this event with given ID
function viewElementDetails(){
    window.open("EventSignUpPage.html?id=" + this.id);
}

// When new dt elements are added to the dl, this sets the onClick listener for those dt elements
function updateListener(){
    let dt = document.getElementsByTagName("dt");
    for (let i = 0; i < dt.length; i++){
        dt[i].addEventListener("click", viewElementDetails);
    }
}