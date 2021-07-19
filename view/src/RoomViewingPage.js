import RoomPresenter from "./presenter/RoomPresenter.js";
import {extractCheckboxResult} from "./InputParser.js";

// Sets listener and interactions for the corresponding HTML page
var roomPresenter = new RoomPresenter();
document.getElementById("addRoom").addEventListener("click", addRoom);
document.getElementById("moreRoomsButton").addEventListener("click", loadMoreRooms);
document.getElementById("applyFilters").addEventListener("click", searchRooms);
document.getElementById("features").innerHTML += roomPresenter.allFeatures();

// If user is an organizer, give the option to add a new room
if (sessionStorage.getItem("curAccount") != null && sessionStorage.getItem("curType") === "organizer"){
    document.getElementById("addRoom").style.display = "block";
}else {
    document.getElementById("addRoom").style.display = "none";
}

// Load initial content (room info) onto the page
if (document.getElementById("roomList").innerHTML === ""){
    let content = roomPresenter.searchRooms("", 0, ["-", "-"], []);
    if (content === ""){
        document.getElementById("roomList").innerHTML += "There are currently no rooms...";
        document.getElementById("moreRoomsButton").style.display = "none";
    }else {
        document.getElementById("roomList").innerHTML += content;
        updateListener();
    }
}

// Provides link to the room titles on the page so that they link to the page with detailed room info
function updateListener(){
    let dt = document.getElementsByTagName("dt");
    for (let i = 0; i < dt.length; i++){
        dt[i].addEventListener("click", viewRoom);
    }
}

// Respond to on click event of the load more button
function loadMoreRooms(){
    let content = roomPresenter.getMoreRooms();

    if (content === ""){
        document.getElementById("roomList").innerHTML += "No more events...";
        document.getElementById("moreRoomsButton").style.display = "none";
    }else {
        document.getElementById("roomList").innerHTML += content;
    }
    updateListener();
}

// Respond to user click for the add room button
function addRoom(){
    window.open("RoomAddingPage.html", "_self");
}

// Goes to a new page with detailed info for the target room
function viewRoom(){
    window.open("RoomDetailPage.html?name=" + this.id);
}

// Respond to user click on apply filter button by searching rooms with the given keywords
function searchRooms(){
    let keyword = document.getElementById("roomName").value.toString();
    let capacity = document.getElementById("capacity").value.toString();
    let available = [document.getElementById("startHour").value.toString(),
            document.getElementById("endHour").value.toString()]

    let features = extractCheckboxResult("feature");

    document.getElementById("roomList").innerHTML = roomPresenter.searchRooms(keyword, capacity,
        available, features);

    document.getElementById("searchResultTitle").innerHTML = "Found " +
        roomPresenter.getNumResult() + " results:";
    if (roomPresenter.getNumResult() === 0) {
        document.getElementById("moreRoomsButton").style.display = "none";
    }else {
        document.getElementById("moreRoomsButton").style.display = "block";
        updateListener();
    }
}