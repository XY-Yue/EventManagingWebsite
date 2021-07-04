import EventPresenter from "./presenter/EventPresenter.js";

// This view corresponds to MainPage

// This part is responsible for showing popular events on the page
document.getElementById("moreEventsButton").addEventListener("click", addMoreContent);
var eventPresenter = new EventPresenter();

if (document.getElementById("popularEvents").innerHTML === ""){
    let content = eventPresenter.searchEvents(0, 0, "", "", null, null, "");
    if (content === ""){
        document.getElementById("popularEvents").innerHTML += "There are currently no events...";
        document.getElementById("moreEventsButton").style.display = "none";
    }else {
        document.getElementById("popularEvents").innerHTML += content;
        updateListener();
    }
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

// Loads more event data onto the page
function addMoreContent(){
    let content = eventPresenter.getMoreEvents(0, 0, "", "", null, null, "");

    if (content === ""){
        document.getElementById("popularEvents").innerHTML += "No more events...";
        document.getElementById("moreEventsButton").style.display = "none";
    }else {
        document.getElementById("popularEvents").innerHTML += content;
    }
    updateListener();
}