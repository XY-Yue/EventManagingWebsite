import Event from "./Event.js";

/**
 * A party, which is a sub class of event, and it has no speaker
 */
export default class extends Event{
    /**
     * Constructs a Party object
     * @param name name of the Party
     * @param start the date of start time of the event
     * @param end the date of end time of the event
     * @param location room name of the Party held in
     * @param description description of the Party
     * @param capacity the max number of people can participate in the Party
     * @param ID The unique ID of the Party
     * @param type the type of the event to help parsing JSON
     */
    constructor(name, ID, location, description, capacity, start, end, type) {
        super(name, ID, location, description, capacity, start, end, type);
    }

    /**
     * Gets the speakers of this event, none in this case
     * @return empty array, as Party has no speakers
     */
    get host(){
        return [];
    }

    /**
     * Changes the host of the event, which is not allowed for party
     * @param newHost new speaker of event
     * @return false, as Party has no speakers
     */
    set host(newHost){
        return false;
    }

    /**
     * Gets the number of speakers required for this Party, which is None
     * @return 0 , representing no speaker is needed
     */
    getNumSpeaker() {
        return 0;
    }

    /**
     * Gives the toString information of this talk in a string.
     * The information contains all information from toString method in event class, add a Have Fun message
     * @return String of information of this talk, contains name, start time, location, capacity and description
     */
    toString(){
        return super.toString() + "Have fun!";
    }
}