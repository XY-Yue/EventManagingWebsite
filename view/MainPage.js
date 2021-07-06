import EventPresenter from "./presenter/EventPresenter.js";
import {updateListener, addMoreContent} from "./EventDisplayer.js";

// This view corresponds to MainPage

// This part is responsible for showing popular events on the page
document.getElementById("moreEventsButton").addEventListener("click", callAddMoreContent);
var eventPresenter = new EventPresenter();

if (document.getElementById("popularEvents").innerHTML === ""){
    let content = eventPresenter.searchEvents(0, 0, "", [],
        null, null, [], []);
    if (content === ""){
        document.getElementById("popularEvents").innerHTML += "There are currently no events...";
        document.getElementById("moreEventsButton").style.display = "none";
    }else {
        document.getElementById("popularEvents").innerHTML += content;
        updateListener();
    }
}

// A helper function to call addMoreContent, avoids duplicated code
function callAddMoreContent(){
    addMoreContent(eventPresenter, "popularEvents");
}
