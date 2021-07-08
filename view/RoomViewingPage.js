import RoomPresenter from "./presenter/RoomPresenter.js";

document.getElementById("addRoom").addEventListener("click", addRoom);
if (sessionStorage.getItem("curAccount") != null && sessionStorage.getItem("curType") === "organizer"){
    document.getElementById("addRoom").style.display = "block";
}


function addRoom(){
    window.open("RoomAddingPage.html", "_self");
}


function viewRoom(){
    window.open("RoomViewingPage.html?name=" + this.id);
}