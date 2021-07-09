import RoomPresenter from "./presenter/RoomPresenter.js";
import {extractCheckboxResult} from "./InputParser.js";

const SELECTED = "forestgreen";
const NOT_SELECTED = "white";

document.getElementById("features").innerHTML += new RoomPresenter().allFeatures();
document.getElementById("ADD").style.display = "none";
document.getElementById("ADD").addEventListener("click", addFeatureConfirm);
document.getElementById("addFeature").addEventListener("click", addFeatureRequest);
document.getElementById("continue").addEventListener("click", addRoom);
let elements = document.getElementsByName("hourChoice");
for (let i = 0; i < elements.length; i++){
    elements[i].addEventListener("click", hourSelected);
}


function addFeatureRequest(){
    document.getElementById("moreFeaturesLabel").style.display = "inline";
    document.getElementById("moreFeatures").style.display = "inline";
    document.getElementById("ADD").style.display = "inline";
}


function addFeatureConfirm(){
    let newFeature = document.getElementById("moreFeatures").value.toString();
    let formatted = new RoomPresenter().addFeature(newFeature);
    let origChoice = extractCheckboxResult("feature");

    if (formatted === "") {
        document.getElementById("newFeatureInvalidWarning").innerHTML = "This feature already exist!";
    }else {
        document.getElementById("features").innerHTML += formatted;
        document.getElementById("newFeatureInvalidWarning").innerHTML = newFeature + " added!";
    }
    document.getElementById(newFeature.toLowerCase()).checked = true;
    for (let i = 0; i < origChoice.length; i++){
        document.getElementById(origChoice[i]).checked = true;
    }
}


function hourSelected(){
    if (this.style.backgroundColor === SELECTED){
        this.style.backgroundColor = NOT_SELECTED;
    }else {
        this.style.backgroundColor = SELECTED;
    }
}


function addRoom(){
    document.getElementById("invalidNameWarning").innerHTML = "";
    document.getElementById("availableWarning").innerHTML = "";

    let available = extractHours("hourChoice");
    if (available.length === 0){
        document.getElementById("availableWarning").innerHTML = "Choose when room is available...";
    }else{
        for (let i = 0; i < available.length; i++){
            available[i] = parseInt(available[i]);
        }

        available.sort((a, b) => a - b);
        let features = extractCheckboxResult("feature");
        let capacity = parseInt(document.getElementById("capacity").value.toString());
        let roomName = document.getElementById("roomName").value.toString();

        if (roomName === ""){
            document.getElementById("invalidNameWarning").innerHTML = "Room name cannot be empty";
        } else if (!new RoomPresenter().addRoom(roomName, available, capacity, features)){
            document.getElementById("invalidNameWarning").innerHTML = "Room name already exist";
        }else {
            window.open("RoomViewingPage.html", "_self");
        }
    }
}


function extractHours(name){
    let choices = document.getElementsByName(name);
    let output = [];

    for (let i = 0; i < choices.length; i++){
        if (choices[i].style.backgroundColor === SELECTED){
            output.push(choices[i].value.toString());
        }
    }
    return output;
}
