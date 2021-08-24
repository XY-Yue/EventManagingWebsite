import Event from "./Event.js";

/**
 * An entity class which extends abstract class event, representing a event with only one speaker
 * Inherits all existing attributes of event class and with new attribute speaker.
 */
export default class extends Event{
    /**
     * Constructs a Talk object
     * @param name name of the Talk
     * @param start the date of start time of the event
     * @param end the date of end time of the event
     * @param location room name of the Talk held in
     * @param description description of the Talk
     * @param capacity the max number of people can participate in the Talk
     * @param ID The unique ID of the Talk
     * @param type the type of the event to help parsing JSON
     */
    constructor(name, ID, location, description, capacity, start, end, type) {
        super(name, ID, location, description, capacity, start, end, type);
        this._host = null;
    }

    /**
     * Changes the speaker of this talk by given new speaker.
     * @param speakers new speaker of this talk
     * @return true if there is exactly one speaker given, and changed speaker successfully, else false
     */
    set host(speakers) {
        if (speakers == null || speakers.length === 0) return false;
        this._host = speakers[0];
        return true;
    }

    /**
     * Shows the speaker of this talk.
     * @return An iterator that only contains the one speaker for this talk
     */
    get host(){
        return new Array(this._host);
    }

    /**
     * Gets the number of speakers required for this PanelDiscussion, which is 1
     * @return 1, representing exactly one speaker is allowed
     */
    getNumSpeaker() {
        return 1;
    }

    /**
     * Gives the toString information of this talk in a string.
     * The information contains all information from toString method in event class, also speaker for the talk.
     * @return the String of information of this talk, contains name, start time, location, capacity, description and
     * speaker
     */
    toString(){
        return super.toString() + "Host: " + this._host;
    }
}