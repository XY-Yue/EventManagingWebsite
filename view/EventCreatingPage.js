import EventCreatingPresenter from "./presenter/EventCreatingPresenter.js";
import {convertDate, extractCheckboxResult} from "./InputParser.js";

let curAccount = sessionStorage.getItem("curAccount");
let presenter;

// Use variables to record some of user input, so that we do not need to extract them every time
let start = null, end = null;
let capacity = 100;
let type = null;
let feature = [];
let speakerRecommend = "";

// Checks if there is a user logged in, if not, we cannot enter this page
if (curAccount == null || sessionStorage.getItem("curType") !== "organizer") {
    window.open("MainPage.html", "_self");
}else {
    presenter = new EventCreatingPresenter();

    // Need to update the room and speaker recommendation list when time and capacity changes
    document.getElementById("type").innerHTML = presenter.getAllTypes();
    document.getElementById("features").innerHTML = presenter.allFeatures();
    onChangeType();
    document.getElementById("continue").addEventListener("click", createEvent);
    document.getElementById("type").addEventListener("change", onChangeType);
    document.getElementById("startDate").addEventListener("change", onChangeDate);
    document.getElementById("startHour").addEventListener("change", onChangeDate);
    document.getElementById("endDate").addEventListener("change", onChangeDate);
    document.getElementById("endHour").addEventListener("change", onChangeDate);
    onChangeDate();
    document.getElementById("capacity").addEventListener("change", onChangeCapacity);
    onChangeCapacity();
    document.getElementById("features").addEventListener("change", onChangeFeature);
    onChangeFeature();
}

// Handles user click event on the continue button, which requests to create an event
function createEvent(){
    let result = presenter.createEvent(
        type,
        document.getElementById("eventName").value.toString(),
        capacity,
        start,
        end,
        document.getElementById("description").value.toString(),
        extractCheckboxResult("room")[0],
        feature,
        extractCheckboxResult("speaker"),
        document.getElementById("vipTrue").checked,
        curAccount
    );

    if (result === ""){
        alert("Event Created!");
        window.open("EventSearchPage.html", "_self");
    }else {
        document.getElementById("invalidInputWarning").innerHTML = result;
    }
}

// When the date input changed, we need to update room and speaker recommendations
function onChangeDate(){
    start = convertDate(
        document.getElementById("startDate").value.toString(),
        document.getElementById("startHour").value.toString()
    );
    end = convertDate(
        document.getElementById("endDate").value.toString(),
        document.getElementById("endHour").value.toString()
    );

    updateSpeakerRecommendations();
    updateRoomRecommendations();
}

// When the capacity of event changes, we need to update room recommendations
function onChangeCapacity(){
    capacity = document.getElementById("capacity").value.toString();
    capacity = parseInt(capacity);

    updateRoomRecommendations();
}

// When the required feature of event changes, we need to update room recommendations
function onChangeFeature(){
    feature = extractCheckboxResult("feature");

    updateRoomRecommendations();
}

// When the capacity of event changes, we need to update speakers recommendations on how many speakers can be chosen
function onChangeType(){
    type = document.getElementById("type").value.toString();
    let numSpeakers = presenter.getNumSpeakers(type);

    if (numSpeakers === 0 || numSpeakers <= -2){
        document.getElementById("speakerChoice").innerHTML = "The chosen type do not need speakers";
    }else if (numSpeakers === 1){
        document.getElementById("speakerChoice").innerHTML = speakerRecommend;
        let speakerOptions = document.getElementsByName("speaker");

        for (let i = 0; i < speakerOptions.length; i++){
            speakerOptions[i].type = "radio"; // We can only choose one speaker, so we use radio
        }
    }else {
        document.getElementById("speakerChoice").innerHTML = speakerRecommend;
        let speakerOptions = document.getElementsByName("speaker");

        for (let i = 0; i < speakerOptions.length; i++){
            speakerOptions[i].type = "checkbox"; // We can only choose one speaker, so we use radio
        }
    }
}

// Give room recommendations with the current user input and display them on screen
function updateRoomRecommendations(){
    if (start != null && end != null){
        let rooms = presenter.getAvailableRooms(start, end, capacity, feature);
        document.getElementById("roomChoice").innerHTML =
            rooms;

        if (rooms === "") {
            document.getElementById("roomChoice").innerHTML = "No room is available for this interval!";
        }
    }else {
        document.getElementById("roomChoice").innerHTML =
            "Enter start and finish time to see available rooms...";
    }
}

// Give speaker recommendations with the current user input and display them on screen
function updateSpeakerRecommendations(){
    if (start != null && end != null){
        speakerRecommend = presenter.getAvailableSpeakers(start, end);
        document.getElementById("speakerChoice").innerHTML =
            speakerRecommend;

        if (speakerRecommend === ""){
            document.getElementById("speakerChoice").innerHTML = "No speaker is available at this moment!";
        }else {
            onChangeType();
        }
    }else {
        document.getElementById("speakerChoice").innerHTML =
            "Enter start and finish time to see available speakers...";
    }
}