import RoomPresenter from "./presenter/RoomPresenter.js";
import {extractCheckboxResult} from "./InputParser.js";

// First extract the room name from query text in URL
var roomName = window.location.search.toString();

if (roomName === "") {
    window.open("MainPage.html", "_self");
}else {
    roomName = roomName.split("=")[1];
}

document.getElementById("title").innerHTML = roomName;
fillRoomInfo();
document.getElementById("featureAdder").style.display = "none";
document.getElementById("ADD").style.display = "inline";
document.getElementById("addFeature").addEventListener("click", onClickAddMore);
document.getElementById("addFeatureToRoom").addEventListener("click", onClickAddFeature);
document.getElementById("ADD").addEventListener("click", addFeature);

// If user is an organizer, give the option to add features to the room
if (sessionStorage.getItem("curAccount") != null && sessionStorage.getItem("curType") === "organizer"){
    document.getElementById("addFeatureToRoom").style.display = "inline";
    document.getElementById("additionalFeatures").innerHTML += new RoomPresenter().allFeatures();
}else {
    document.getElementById("addFeatureToRoom").style.display = "none";
}


function fillRoomInfo(){
    let room = new RoomPresenter().getSingleRoom(roomName);

    document.getElementById("capacity").innerHTML = room._capacity;
    document.getElementById("features").innerHTML = room._features;
    document.getElementById("schedule").innerHTML = room._schedule;
    document.getElementById("available").innerHTML = room._availableTimes;
}


function onClickAddFeature(){
    document.getElementById("featureAdder").style.display = "block";
}


function onClickAddMore(){
    document.getElementById("moreFeaturesLabel").style.display = "inline";
    document.getElementById("moreFeatures").style.display = "inline";
}


function addFeature(){
    let presenter = new RoomPresenter();
    let features = extractCheckboxResult("feature");
    let additionalFeature = document.getElementById("moreFeatures").value.toString();

    if (additionalFeature !== ""){
        presenter.addFeature(additionalFeature);
        features.push(additionalFeature);
    }

    let addFeatureResult = presenter.addFeatureToRoom(roomName, features);

    if (addFeatureResult.length === 0) {
        document.getElementById("addFeatureFeedback").innerHTML = "No features are added";
    }else {
        document.getElementById("addFeatureFeedback").innerHTML =
            "added: " + addFeatureResult + " to the room";
    }
    fillRoomInfo();
}