// Jump to a page to display event details for this event with given ID
function viewElementDetails(){
    window.open("EventSignUpPage.html?id=" + this.id);
}

// When new dt elements are added to the dl, this sets the onClick listener for those dt elements
export function updateListener(){
    let dt = document.getElementsByTagName("dt");
    for (let i = 0; i < dt.length; i++){
        dt[i].addEventListener("click", viewElementDetails);
    }
}

// Loads more event data onto the page
// Should have an instance of EventPresenter initialized before calling
export function addMoreContent(eventPresenter, targetID){
    let content = eventPresenter.getMoreEvents();

    if (content === ""){
        document.getElementById(targetID).innerHTML += "No more events...";
        document.getElementById("moreEventsButton").style.display = "none";
    }else {
        document.getElementById(targetID).innerHTML += content;
    }
    updateListener();
}