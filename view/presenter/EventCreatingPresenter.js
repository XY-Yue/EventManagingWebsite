import RoomManager from "./model/room/RoomManager.js";
import EventManager from "./model/event/EventManager.js";
import AccountManager from "./model/account/AccountManager.js";
import {formatToCheckbox, formatToRadio} from "./FormatToOptions.js";

export default class {
    constructor() {
        this._eventManager = new EventManager();
        this._accountManager = new AccountManager();
        this._roomManager = new RoomManager();
    }

    /**
     * Creates an event based on the input information, need to check if the input is valid
     * @param type of the desired event
     * @param eventName of the new event, cannot be empty
     * @param capacity of the new event
     * @param start start time of the new event
     * @param end end time of the new event, must be later than start
     * @param description of the new event
     * @param room location of the new event, cannot be null
     * @param feature an array of features this event requires
     * @param speakers an array of speakers of the new event, based on event type, it may or may not be empty
     * @param vip status of the new event
     * @param creatorUsername the creator organizer of the new event
     * @return string representing an error message, empty means success
     */
    createEvent(type, eventName, capacity, start, end, description, room, feature, speakers, vip, creatorUsername){
        if (eventName === ""){
            return "Event name cannot be empty!";
        }else if (start.getTime() >= end.getTime()){
            return "Event start time has to be before end time!";
        }else if (room == null){
            return "Select a room!";
        }else if (speakers.length === 0 &&
            (this._eventManager.getNumSpeakers(type) > 0 || this._eventManager.getNumSpeakers(type) === -1)){
            return "This type of event requires more speakers!";
        }else {
            let eventID = this._eventManager.createEvent(eventName, start, end, room, description, capacity, type);
            this._eventManager.setVIP(eventID, vip);
            this._eventManager.setRequiredFeatures(feature);

            for (let i = 0; i < speakers.length; i++){
                this._eventManager.scheduleSpeaker(eventID, speakers[i]);
                this._accountManager.signUpEvent([start, end], eventID, speakers[i], eventName);
                this._accountManager.addToSpecialList(eventID, speakers[i]);
            }

            this._roomManager.addEventToRoom(room, eventID, eventName, start, end);
            this._accountManager.addToSpecialList(eventID, creatorUsername);

            return "";
        }
    }

    /**
     * Based on the given constraints, get all available rooms that meets the conditions
     * @param start of a time interval where the room must be available
     * @param end of a time interval where the room must be available
     * @param capacity that the room need to have (at least)
     * @param feature an array of features the room needs
     * @return string representing all desired rooms formatted as HTML radio inputs
     */
    getAvailableRooms(start, end, capacity, feature){
        if (start.getTime() >= end.getTime()){
            return "";
        }
        let rooms = this._roomManager.availableRooms(start, end, feature, capacity);
        let output = "";

        for (let i = 0; i < rooms.length; i++){
            output += formatToRadio(rooms[i], "room");
        }
        return output;
    }

    /**
     * Based on the given constraints, get all available speakers that meets the conditions
     * @param start of a time interval where the room speakers be available
     * @param end of a time interval where the speakers must be available
     * @return string representing all desired speakers formatted as HTML checkbox inputs
     */
    getAvailableSpeakers(start, end){
        if (start.getTime() >= end.getTime()){
            return ""
        }
        let speakers = this._accountManager.getAvailableSpeakers([start, end]);
        let output = "";

        for (let i = 0; i < speakers.length; i++){
            output += formatToCheckbox(speakers[i], "speaker");
        }
        return output;
    }

    /**
     * Gets required number of speakers of this type of events
     * @param type of the target events
     * @return number of speakers required, -1 means at least 1
     */
    getNumSpeakers(type){
        return this._eventManager.getNumSpeakers(type);
    }

    /**
     * Gets all existing types of events
     * @return string formatted into HTML <select> options representing all types
     */
    getAllTypes(){
        let allTypes = this._eventManager.allEventTypes();
        let output = "";

        for (let i = 0; i < allTypes.length; i++){
            output += "<option value='" + allTypes[i] + "'>" + allTypes[i] + "</option>";
        }
        return output;
    }
}