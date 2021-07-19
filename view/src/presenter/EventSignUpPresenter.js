import EventManager from "./model/event/EventManager.js";
import AccountManager from "./model/account/AccountManager.js";
import RoomManager from "./model/room/RoomManager.js";

export default class {
    constructor() {
        this._eventManager = new EventManager();
        this._accountManager = new AccountManager();
        this._roomManager = new RoomManager();
    }

    /**
     * Sign the given username up in the given event ID
     * @param eventID the target event the user is trying to sign up
     * @param username the target user
     */
    signUpEvent(eventID, username){
        if (!this._eventManager.canSignUp(eventID)){
            return "Event is already full!";
        }
        let eventTime = this._eventManager.getEventDuration(eventID);
        if (!this._accountManager.freeAtTime(eventTime[0], eventTime[1], username)){
            return "You have a conflict with the time of this event!"
        }
        if (this._eventManager.isVIP(eventID) && !this._accountManager.checkVIP(username)){
            return "This event is VIP only!";
        }
        this._eventManager.addAttendee(username, eventID);
        this._accountManager.signUpEvent(eventTime, eventID, username, this._eventManager.getEventName(eventID));
        if (this._accountManager.checkType(username) === "vip"){
            this._accountManager.addToSpecialList(eventID, username);
        }
        return "";
    }

    /**
     * Remove the event from the user's schedule to cancel the sign up of that event
     * @param eventID the target event, user must be in this event
     * @param username the target user
     */
    cancelSignedUpEvent(eventID, username){
        this._accountManager.cancelEvent(this._eventManager.getEventDuration(eventID), eventID, username);
        this._eventManager.removeAttendee(username, eventID);
        if (this._accountManager.checkType(username) === "vip"){
            this._accountManager.removeFromSpecialList(eventID, username);
        }
    }

    /**
     * Deletes a event that has not taken place yet
     * @param eventID the target event to be deleted
     */
    deleteEvent(eventID){
        let attendees = this._eventManager.getAttendees(eventID);
        let hosts = this._eventManager.getHosts(eventID);
        let room = this._eventManager.getRoom(eventID);
        let time = this._eventManager.getEventDuration(eventID);

        this._eventManager.cancelEvent(eventID);
        for (let i = 0; i < hosts.length; i++){
            this._accountManager.removeFromSpecialList(eventID, hosts[i]);
            this._accountManager.cancelEvent(time, eventID, hosts[i]);
        }
        for (let i = 0; i < attendees.length; i++){
            this._accountManager.cancelEvent(time, eventID, attendees[i]);
            if (this._accountManager.checkType(attendees[i]) === "vip"){
                this._accountManager.removeFromSpecialList(eventID, attendees[i]);
            }
        }
        this._roomManager.removeEventFromRoom(room, eventID, time[0], time[1]);
    }

    /**
     * Gets the information of the event with this ID, format it into a object and can be inserted into HTML directly
     * @param eventID the target event's ID
     */
    getSingleEvent(eventID){
        let event = this._eventManager.getEvent(eventID);
        let outputEvent = {};

        outputEvent.name = "";
        if (event._isVIP){
            outputEvent.name += "[VIP] "
        }
        outputEvent.name += event._name;
        outputEvent.capacity = event._capacity;
        outputEvent.duration = "From " + event._start.toLocaleString() + "  to  " + event._end.toLocaleString();
        outputEvent.description = event._description;

        outputEvent.location = "<a href='./RoomDetailPage.html?id=" + event._location + "'>"
            + event._location + "</a>";

        outputEvent.type = event._type;
        outputEvent.curAttendee = event._attendee.length;
        outputEvent.features = "";
        for (let i = 0; i < event._requiredFeatures.length; i++){
            outputEvent.features += event._requiredFeatures[i] + ";  ";
        }

        if (event.hasOwnProperty("_host")){
            if (Array.isArray(event._host)){
                outputEvent.host = "";
                for (let i = 0; i < event._host.length; i++){
                    outputEvent.host += "<a href='./AccountInfoPage.html?id=" + event._host[i] + "'>"
                        + event._host[i] + "</a>; ";
                }
            }else {
                outputEvent.host = "<a href='./AccountInfoPage.html?id=" + event._host + "'>"
                    + event._host + "</a>";
            }
        }

        return outputEvent;
    }

    /**
     * Checks if the user is signed up for this event
     * @param eventID the target event to be checked
     * @param username the target user that needs the check
     */
    isInEvent(eventID, username){
        return this._eventManager.hasAttendee(eventID, username);
    }

    /**
     * Checks if the user is a host of this event
     * @param eventID the target event to be checked
     * @param username the target user that needs the check
     */
    isHost(eventID, username){
        return this._eventManager.getHosts(eventID).includes(username);
    }

    /**
     * Checks if the target event is expired
     * @param eventID the target event's ID
     * @return true if the target event is NOT expired
     */
    isCurrentEvent(eventID){
        return this._eventManager.getEventDuration(eventID)[0].getTime() > new Date().getTime();
    }
}