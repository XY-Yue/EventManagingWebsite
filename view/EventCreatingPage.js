import EventCreatingPresenter from "./presenter/EventCreatingPresenter.js";

let curAccount = sessionStorage.getItem("curAccount");
let presenter;

// Checks if there is a user logged in, if not, we cannot enter this page
if (curAccount == null || sessionStorage.getItem("curType") !== "organizer") {
    window.open("MainPage.html", "_self");
}else {
    presenter = new EventCreatingPresenter();

    // Need to update the room and speaker recommendation list when time and capacity changes
    document.getElementById("type").innerHTML = presenter.getAllTypes();
    document.getElementById("continue").addEventListener("click", createEvent);
    document.getElementById("type").addEventListener("change", onChangeType);
    document.getElementById("startDate").addEventListener("change", onChangeDate);
    document.getElementById("startHour").addEventListener("change", onChangeDate);
    document.getElementById("endDate").addEventListener("change", onChangeDate);
    document.getElementById("endHour").addEventListener("change", onChangeDate);
    document.getElementById("capacity").addEventListener("change", onChangeCapacity);
}

// Handles user click event on the continue button, which requests to create an event
function createEvent(){

}

// When the date input changed, we need to update room and speaker recommendations
function onChangeDate(){

}

// When the capacity of event changes, we need to update room recommendations
function onChangeCapacity(){

}

// When the capacity of event changes, we need to update speakers recommendations on how many speakers can be chosen
function onChangeType(){

}