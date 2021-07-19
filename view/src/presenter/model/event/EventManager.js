import Event from './Event.js';
import Party from "./Party.js";
import PanelDiscussion from "./PanelDiscussion.js";
import Talk from "./Talk.js";
import EventFactory from "./EventFactory.js";
import reviver from "../reviver.js";

/**
 * An use case class of event.
 * Stores all event in a map with event id of event map to the corresponding event. Also a sorted map with
 * time map to a list of toString of events start at that time.
 * Also stores total number of events.
 * Has methods to construct new events, get event with given information, and change the information of event.
 */
export default class{
    /**
     * Constructs a EventManager, set everything to empty.
     */
    constructor() {
        // Will be in format {type: {eventID: event object of this type with this ID, ...}, ...}
        this._eventList = this._readData("allEvent");

        this._numEvents = this._readData("numEvents"); // keep track of number of events created so far,
                                                            // not current number of active events
        this._eventType = ["talk", "party", "discussion"];

        this._desiredHostNumber = {talk: 1, party: 0, discussion: -1}
    }

    // Read data from local storage, used by constructor
    // Have the 'key' as input
    _readData(key){
        let value = localStorage.getItem(key);

        if (value == null){
            if (key === "numEvents") return 0;
            else return {};
        }else {
            if (key !== "allEvent"){
                return JSON.parse(value, reviver);
            }else {
                value = JSON.parse(value, reviver);

                for (const [_, v] of Object.entries(value)){
                    for (const [id, event] of Object.entries(v)){
                        v[id] = this._parseEvent(event);
                    }
                }
                return value;
            }
        }
    }

    // parse a JSON event object into an actual event object with methods
    _parseEvent(JSONObj){
        let event = new EventFactory().makeEvent(JSONObj._type, JSONObj._name, JSONObj._start, JSONObj._end,
            JSONObj._location, JSONObj._description, JSONObj._capacity, JSONObj._ID);

        event.isVIP = JSONObj._isVIP;
        for (let i = 0; i < JSONObj._attendee.length; i++){
            event.addAttendee(JSONObj._attendee[i]);
        }
        event.addRequiredFeatures(JSONObj._requiredFeatures);
        if (JSONObj.hasOwnProperty('_host')){
            let hosts = JSONObj._host;

            if (!Array.isArray(hosts)){
                hosts = [hosts];
            }
            event.changeHost(hosts);
        }
        return event;
    }

    // This method writes eventList, schedule and numEvents to storage as a JSON string
    // Every time something is updated, this method should be called
    _storeData(){
        localStorage.setItem("allEvent", JSON.stringify(this._eventList));
        localStorage.setItem("numEvents", JSON.stringify(this._numEvents));
    }

    _findEvent(id){
        for (const [_, value] of Object.entries(this._eventList)){
            if (value.hasOwnProperty(id) && value[id] != null) return value[id];
        }
        return null;
    }

    _totalNumberOfEvents(){
        let sum = 0;

        for (const [_, value] of Object.entries(this._eventList)){
            sum += Object.values(value).length;
        }
        return sum;
    }

    /**
     * Gets all existing event types
     * @return list of string representations of all existing event types
     */
    allEventTypes(){
        return Array.from(this._eventType);
    }

    /**
     * Gets Schedule of all events
     * @return array containing 2 arrays representing expired and current events, each array are JSON objects of a event
     * @param vip indicates if only VIP events are wanted, 0 means both vip and not vip, > 0 means vip only, < 0 means
     *              non-vip only
     * @param current indicates if only current events are wanted, 0 means both current and expired,
     *              > 0 means current only, < 0 means expired only
     * @param nameKey key for searching events by name, empty string means any events
     * @param location locations of the desired events in a list, empty list means any location
     * @param start start time of the desired events, null means any start time
     * @param end end time of the desired events, null means any end time
     * @param type types of the desired events in a list, empty list means any type
     * @param speakers usernames of speakers of the desired events in a list, empty list means any speaker
     */
    searchEventSchedule(vip, current, nameKey, location, start, end, type, speakers){
        let output = [];

        let date = new Date();

        for (const [key, value] of Object.entries(this._eventList)){
            if (type.length === 0 || type.includes(key)){
                for (const [_, event] of Object.entries(value)){
                    if ((event.isVIP && vip < 0) || (!event.isVIP && vip > 0)){
                        continue; // Event's vip status does not match the requirement
                    }
                    if ((start != null && event.start.getTime() < start.getTime()) ||
                        (end != null && event.end.getTime() > end.getTime())){
                        continue; // Event's time is outside of the desired interval
                    }
                    if ((event.start.getTime() < date.getTime() && current > 0) ||
                    (event.start.getTime() > date.getTime() && current < 0)){
                        continue; // Event's expired status does not match requirement
                    }
                    if (location.length !== 0 && !location.includes(event.location)){
                        continue; // Event is not in the desired locations
                    }

                    let found = speakers.length === 0;
                    for (let i = 0; i < event.host.length; i++){ // For all speakers in event, check if this speaker is desired
                        if (speakers.includes(event.host[i])){
                            found = true;
                            break;
                        }
                    }
                    if (!found)// found is true means this event is desired, otherwise we should not include this event
                        continue;

                    if (!event.name.includes(nameKey)){
                        continue; // Event does not match the given keyword
                    }
                    output.push(JSON.parse(JSON.stringify(event), reviver));
                }
            }
        }
        return output;
    }

    /**
     * Checks if an event exist.
     * @param eventID id of the target event
     * @return true iff event exists
     */
    checkEvent(eventID){
        return this._findEvent(eventID) != null;
    }

    /**
     * Creates a new event with given information, and then add the new constructed event into
     * eventList and eventSchedule.
     * Assumes that it has been checked to make sure there is only one event in a given room.
     * Assumes that it has been checked to make sure the capacity does not exceed the room capacity.
     * @param name name of the new event
     * @param start time where event starts
     * @param finish time where event finishes
     * @param location room name of the new event held in
     * @param description description of the new event
     * @param capacity the max number of people can participate in the new event
     * @param type the type of the event
     * @return return event id if create successfully, otherwise return null.
     */
    createEvent(name, start, finish, location, description, capacity, type){
        this._numEvents = Math.max(this._numEvents, this._totalNumberOfEvents());
        let id = 'E' + this._numEvents;
        let newEvent = new EventFactory().makeEvent(type, name, start, finish,
            location, description, capacity, id);

        if (newEvent == null) return null;

        let added = false;
        for (const [key, value] of Object.entries(this._eventList)){
            if (key === type.toLowerCase()){
                value[id] = newEvent;
                added = true;
                break;
            }
        }
        if (!added) {
            this._eventList[type.toLowerCase()] = {};
            this._eventList[type.toLowerCase()][id] = newEvent;
        }


        this._storeData();
        return id;
    }

    /**
     * Adds a given user as attendee into the event with given id.
     * @param userName the username of user we want to add into event as attendee
     * @param id id of the event we want to add the user in
     * @return true of added successfully, else false
     */
    addAttendee(userName, id){
        let event = this._findEvent(id);
        if (event == null || event.isInEvent(userName)) return false;
        else {
            let success = event.addAttendee(userName);
            if (success) this._storeData();
            return success;
        }
    }

    /**
     * Removes a given user from attendee of the event with given id.
     * @param userName the username of user we want to remove from attendee of event
     * @param eventID id of the event we want to add the user in
     * @return true iff removed successfully
     */
    removeAttendee(userName, eventID){
        let event = this._findEvent(eventID);

        if (event == null) return false;
        else{
            let success = event.removeAttendee(userName);

            if (success)
                this._storeData();

            return success;
        }
    }

    /**
     * Schedules a speaker into a given event.
     * @param eventID id of the event we want to schedule the speaker to
     * @param username the user we want to schedule as the speaker of the event
     * @return true iff scheduled successfully
     */
    scheduleSpeaker(eventID, username){
        let event = this._findEvent(eventID);
        if (event != null){
            let success = event.changeHost(username);

            if (success)
                this._storeData();

            return success;
        }
        return false;
    }

    /**
     * Cancels an event.
     * @param eventID id of the event we want to cancel
     * @return true iff canceled successfully
     */
    cancelEvent(eventID){
        let event = this._findEvent(eventID);
        if (event == null) return false;

        for (const [key, value] of Object.entries(this._eventList)){
            if (key === event.getType()){
                delete value[eventID];

                this._storeData();
                return true;
            }
        }
        return false;
    }

    /**
     * Provides the description of event with given id.
     * The description is toString of the event.
     * @param ID id of the event we want to get description
     * @return toString of event with given id if it exists
     */
    provideDescription(ID){
        let event = this._findEvent(ID);
        if (event == null) return null;
        else return event.toString();
    }

    /**
     * Returns the hosts of a given event.
     * @param eventID id of the event we want to work on
     * @return hosts for this event, or null if this event does not exist
     */
    getHosts(eventID){
        let event = this._findEvent(eventID);
        if (event == null) return null;
        else return event.host;
    }

    /**
     * Returns all attendees of a given event.
     * @param eventID id of the event we want to work on
     * @return attendees for this event, or null if this event does not exist
     */
    getAttendees(eventID){
        let event = this._findEvent(eventID);
        if (event == null) return null;
        else return event.attendee;
    }

    /**
     * Checks if the attendee has signed up with the given event id
     * @param eventID id of the event
     * @param username username of the user
     * @return true iff this user has signed up for this event
     */
    hasAttendee(eventID, username){
        let event = this._findEvent(eventID);
        if (event == null) return false;
        else return event.isInEvent(username);
    }

    /**
     * Gets event duration with given event Id
     * @param eventID A String representation of event id
     * @return start and finish time in an array
     */
    getEventDuration(eventID){
        let event = this._findEvent(eventID);
        if (event == null) return null;
        else return [event.start, event.end];
    }

    /**
     * Returns room of a given event.
     * @param eventID id of the event we want to work on
     * @return room where the event located
     */
    getRoom(eventID){
        let event = this._findEvent(eventID);
        if (event == null) return null;
        else return event.location;
    }

    /**
     * Checks of there are still space in the event
     * @param eventID id of the target event
     * @return true if and only if the event is not full
     */
    canSignUp(eventID){
        let event = this._findEvent(eventID);
        if (event == null) return false;
        else return event.canSignup();
    }

    /**
     * Gets the number of speakers required for a given event.
     * @param eventID id of the target event
     * @return number of speakers this event requires, or -2 if the event does not exist
     */
    numSpeakers(eventID){
        let event = this._findEvent(eventID);
        if (event == null) return -2;
        else return event.getNumSpeaker();
    }

    /**
     * Gets the capacity for a given event.
     * @param eventID id of the target event
     * @return capacity this event requires, or -1 if the event is not found
     */
    getCapacity(eventID){
        let event = this._findEvent(eventID);
        if (event == null) return -1;
        else return event.capacity;
    }

    /**
     * Sets a new capacity for a event
     * @param eventID id of the target event
     * @param newCapacity The new capacity for a event
     * @return true iff the event exists
     */
    setCapacity(eventID, newCapacity){
        let event = this._findEvent(eventID);
        if (event == null) return false;
        else {
            event.capacity = newCapacity;
            this._storeData();
            return true;
        }
    }

    /**
     * Sets a new location for a event
     * @param eventID id of the target event
     * @param roomName The new location for a event, assumes it is valid
     * @return true iff the event exists
     */
    changeRoom(eventID, roomName){
        let event = this._findEvent(eventID);
        if (event == null) return false;
        else {
            event.location = roomName;
            this._storeData();
            return true;
        }
    }

    /**
     * Checks if the event is still valid or expired
     * @param eventID id of the target event
     * @return true iff the event is not passed and is therefore valid
     */
    isValidEvent(eventID){
        let event = this._findEvent(eventID);
        if (event == null) return false;
        else {
            return event.start.getTime() < new Date().getTime();
        }
    }

    /**
     * Updates the VIP status of a event
     * @param eventID id of the target event
     * @param isVIP The new VIP status of the target event
     * @return true iff the event exists
     */
    setVIP(eventID, isVIP){
        let event = this._findEvent(eventID);
        if (event == null) return false;
        else {
            event.isVIP = isVIP;
            this._storeData();
            return true;
        }
    }

    /**
     * Checks if a given event is VIP only
     * @param eventID id of the target event
     * @return true iff the event exists and is VIP only
     */
    isVIP(eventID){
        let event = this._findEvent(eventID);
        if (event == null) return false;
        else {
            return event.isVIP;
        }
    }

    /**
     * Gets all required features of a event
     * @param eventID id of the target event
     * @return required features for the event
     */
    getRequiredFeatures(eventID){
        let event = this._findEvent(eventID);
        if (event == null) return null;
        else return event.requiredFeatures;
    }

    /**
     * Adds the given list of required features to the event's features
     * @param eventID id of the target event
     * @param requiredFeatures a list of new required features for a event
     * @return true iff the target event exists
     */
    setRequiredFeatures(eventID, requiredFeatures){
        let event = this._findEvent(eventID);
        if (event == null) return false;
        else {
            event.addRequiredFeatures(requiredFeatures);
            this._storeData();
            return true;
        }
    }

    /**
     * Gets the object representation of a event
     * @param eventID the target event's ID
     * @return object containing all information of the target event
     */
    getEvent(eventID){
        let event = this._findEvent(eventID);
        if (event == null) return null;
        else {
            return JSON.parse(JSON.stringify(event), reviver);
        }
    }

    /**
     * Gets the number of speakers desired for the given type
     * @param type the type of desired events
     * @return number representing number of speakers needed, -1 means at least one
     */
    getNumSpeakers(type){
        if (this._desiredHostNumber.hasOwnProperty(type)){
            return this._desiredHostNumber[type];
        }else {
            return -2;
        }
    }

    /**
     * Gets the name of the target event
     * @param eventID the ID of the target event
     * @return string representing the event's name
     */
    getEventName(eventID){
        let event = this._findEvent(eventID);
        if (event == null) return null;
        else {
            return event.name;
        }
    }
}