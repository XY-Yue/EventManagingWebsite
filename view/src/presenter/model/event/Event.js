/**
 * An abstract entity class of events, stores name, ID, duration, location, description, capacity,
 * and a list of attendees of the event.
 * Abstract because there are different kind of events.
 * Methods in this class are some getter and setter for attributes in this class.
 */
export default class {
    /**
     * Constructs a event object
     * @param name name of the new event
     * @param start the date of start time of the event
     * @param end the date of end time of the event
     * @param location room name of the new event held in
     * @param description description of the new event
     * @param capacity the max number of people can participate in the new event
     * @param ID The unique ID of the event
     * @param type the type of the event to help parsing JSON
     */
    constructor(name, ID, location, description, capacity, start, end, type) {
        this._name = name;
        this._ID = ID;
        this._start = start;
        this._end = end;
        this._location = location;
        this._description = description;
        this._capacity = capacity;
        this._type = type;
        this._isVIP = false;
        this._attendee = [];
        this._requiredFeatures = [];
    }

    /**
     * Gets name of this event.
     * @return name of event
     */
    get name(){
        return this._name;
    }

    /**
     * Gets id of this event.
     * @return id of event
     */
    get ID(){
        return this._ID;
    }

    /**
     *  Gets event start time
     * @return start time of the event
     */
    get start(){
        return this._start;
    }

    /**
     *  Gets event end time
     * @return end time of the event
     */
    get end(){
        return this._end;
    }

    /**
     * Gets location of this event, which represents as the name of room holds this event
     * @return location which holds the event
     */
    get location(){
        return this._location;
    }

    /**
     * Sets a new location for this event
     * @param location The new location for a event, assumes it is valid
     */
    set location(location){
        this._location = location
    }

    /**
     * Gets the capacity of the event
     * @return capacity of the event
     */
    get capacity(){
        return this._capacity;
    }

    /**
     * Modifies the capacity of the event
     * @param capacity the new capacity of the event
     */
    set capacity(capacity){
        this._capacity = capacity;
    }

    /**
     * Gets all required features of this event
     * @return requiredFeature list
     */
    get requiredFeatures(){
        return Array.from(this._requiredFeatures);
    }

    /**
     * Gets the attendees of this event in a list.
     * @return attendee list
     */
    get attendee(){
        return Array.from(this._attendee);
    }

    /**
     * Adds a new attendee to the attendee list of this event.
     * @param attendee the username of user we want to add into attendee list
     * @return true if added successfully, else false
     */
    addAttendee(attendee){
        if (this._attendee.length < this._capacity && !this._attendee.includes(attendee)){
            this._attendee.push(attendee);
            return true;
        }else return false;
    }

    /**
     * Adds all the given features to the required features list
     * @param feature a list of new required features for this event
     * @return true iff not all new required features already exist in this event
     */
    addRequiredFeatures(feature){
        if (!Array.isArray(feature))
            this._requiredFeatures.push(feature);
        else this._requiredFeatures.concat(feature);
    }

    /**
     * Checks if the user of given username is one of the attendees of this event.
     * @param attendee the username of user we want to check
     * @return true if given username in attendee list, else false
     */
    isInEvent(attendee){
        return this._attendee.includes(attendee);
    }

    /**
     * Removes an attendee from the attendee list of this event.
     * @param attendee the username of user we want to remove from attendee list
     * @return true if removed successfully, else false
     */
    removeAttendee(attendee){
        let i = this._attendee.indexOf(attendee);
        if (i === -1){
            return false;
        }else {
            this._attendee.splice(i, 1);
            return true;
        }
    }

    /**
     * Gives the toString information of this event in a string.
     * The information contains name, start time, location, capacity and description.
     * @return the String of information of the event, contains name, start time, location, capacity and description
     */
    toString(){
        return name + "\n" +
            ((this._isVIP) ? "VIP ONLY\n" : "") +
            "Time of event: \n" +
            this._start + "to" + this._end + "\n" +
            "Location of event: " + this._location + "\n" +
            "Capacity of event: " + this._capacity + "\n" +
            "Description of event :" + this._description + "\n";
    }

    /**
     * Checks of there are still space in the event
     * @return true if and only if the event is not full
     */
    canSignup(){
        return this._capacity > this._attendee.length;
    }

    /**
     * Checks if the event is VIP only
     * @return true iff the event is VIP only
     */
    get isVIP(){
        return this._isVIP;
    }

    /**
     * Updates the VIP status of this event
     * @param isVIP The new VIP status of this event
     */
    set isVIP(isVIP){
        this._isVIP = isVIP;
    }

    /**
     * Gets the type of this event
     * @return this._type which represents the type of the event
     */
    getType() {
        return this._type;
    }

}