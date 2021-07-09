import RoomPresenter from "./presenter/RoomPresenter.js";

// Sets listener and interactions for the corresponding HTML page
document.getElementById("addRoom").addEventListener("click", addRoom);
if (sessionStorage.getItem("curAccount") != null && sessionStorage.getItem("curType") === "organizer"){
    document.getElementById("addRoom").style.display = "block";
}else {
    document.getElementById("addRoom").style.display = "none";
}


function addRoom(){
    window.open("RoomAddingPage.html", "_self");
}


function viewRoom(){
    window.open("RoomViewingPage.html?name=" + this.id);
}