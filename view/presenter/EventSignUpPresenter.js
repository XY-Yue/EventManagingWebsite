import EventManager from "./model/event/EventManager.js";
import AccountManager from "./model/account/AccountManager.js";
import RoomManager from "./model/room/RoomManager.js";

export default class {
    constructor() {
        this._eventManager = new EventManager();
        this._accountManager = new AccountManager();
        this._roomManager = new RoomManager();
    }


    signUpEvent(eventID, username){

    }

    cancelSignedUpEvent(eventID, username){

    }

    deleteEvent(eventID){

    }
}