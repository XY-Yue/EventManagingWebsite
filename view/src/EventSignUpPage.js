import EventSignUpPresenter from "./presenter/EventSignUpPresenter.js";

// First extract the event id from query text in URL
var eventID = window.location.search.toString();
let curAccount = sessionStorage.getItem("curAccount");
let presenter = new EventSignUpPresenter();
let isOrganizer = sessionStorage.getItem("curType") === "organizer";

if (eventID === "") {
    window.open("MainPage.html", "_self");
}else {
    eventID = eventID.split("=")[1];

    // Checks if there is a user logged in, if not, we must hide some user only operations
    if (curAccount == null) {
        document.getElementById("signUp").style.display = "none";
        document.getElementById("cancel").style.display = "none";
        document.getElementById("withdraw").style.display = "none";
    } else if (!isOrganizer) {
        document.getElementById("cancel").style.display = "none";
    }

    // Block any event operation if this event has already passed
    if (!presenter.isCurrentEvent(eventID)){
        document.getElementById("signUp").style.display = "none";
        document.getElementById("withdraw").style.display = "none";
        document.getElementById("cancel").style.display = "none";
    }
    // Add event listeners
    document.getElementById("signUp").addEventListener("click", signUpEvent);
    document.getElementById("cancel").addEventListener("click", deleteEvent);
    document.getElementById("withdraw").addEventListener("click", cancelSignUp);

    let event = presenter.getSingleEvent(eventID);
    // We fill in the UI with event information
    document.getElementById("name").innerHTML = event.name;
    document.getElementById("location").innerHTML = event.location;
    document.getElementById("time").innerHTML = event.duration;
    document.getElementById("capacity").innerHTML = event.capacity;
    document.getElementById("attendees").innerHTML = event.curAttendee;
    if (event.hasOwnProperty("host")){
        document.getElementById("hosts").innerHTML = event.host;
    }else {
        document.getElementById("hostField").style.display = "none";
    }
    if (isOrganizer){
        document.getElementById("features").innerHTML = event.features;
    }else {
        document.getElementById("featuresField").style.display = "none";
    }
    document.getElementById("description").innerHTML = event.description;

    if (curAccount != null){
        if (presenter.isInEvent(eventID, curAccount)){
            document.getElementById("signUp").style.display = "none";
        }else {
            document.getElementById("withdraw").style.display = "none";
        }
        if (presenter.isHost(eventID, curAccount)){
            document.getElementById("signUp").style.display = "none";
            document.getElementById("withdraw").style.display = "none";
        }
    }
}

// Respond to user's request to sign up for this event
function signUpEvent(){
    if (confirm("Sign up for the event?")){
        let result = presenter.signUpEvent(eventID, curAccount);

        if (result === ""){
            alert("Successfully signed up for this event!");
            window.open("MainPage.html", "_self");
        }else {
            alert(result);
        }
    }
}

// Respond to user's request to withdraw for this event
function cancelSignUp(){
    if (confirm("Withdraw from the event?")){
        presenter.cancelSignedUpEvent(eventID, curAccount);

        alert("Successfully deleted this event from your schedule!");
        window.open("MainPage.html", "_self");
    }
}

// Respond to user's request to delete this event
function deleteEvent(){
    if (confirm("Delete the event? all attendees will be automatically canceled from the event")){
        presenter.deleteEvent(eventID);

        alert("Successfully deleted this event!");
        window.open("MainPage.html", "_self");
    }
}