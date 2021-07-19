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

    }

    /**
     * Remove the event from the user's schedule to cancel the sign up of that event
     * @param eventID the target event, user must be in this event
     * @param username the target user
     */
    cancelSignedUpEvent(eventID, username){

    }

    /**
     * Deletes a event that has not taken place yet
     * @param eventID the target event to be deleted
     */
    deleteEvent(eventID){

    }

    /**
     * Gets the information of the event with this ID, format it into a object and can be inserted into HTML directly
     * @param eventID the target event's ID
     */
    getSingleEvent(eventID){

    }

    /**
     * Checks if the user is signed up for this event
     * @param eventID the target event to be checked
     * @param username the target user that needs the check
     */
    isInEvent(eventID, username){

    }

    /**
     * Checks if the user is a host of this event
     * @param eventID the target event to be checked
     * @param username the target user that needs the check
     */
    isHost(eventID, username){

    }
}