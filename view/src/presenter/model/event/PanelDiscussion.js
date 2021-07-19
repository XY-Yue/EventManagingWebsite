import Event from "./Event.js";

/**
 * A panel discussion, which is a sub class of event, and it has multiple speakers
 */
export default class extends Event{
    /**
     * Constructs a PanelDiscussion object
     * @param name name of the PanelDiscussion
     * @param start the date of start time of the event
     * @param end the date of end time of the event
     * @param location room name of the PanelDiscussion held in
     * @param description description of the PanelDiscussion
     * @param capacity the max number of people can participate in the PanelDiscussion
     * @param ID The unique ID of the PanelDiscussion
     * @param type the type of the event to help parsing JSON
     */
    constructor(name, ID, location, description, capacity, start, end, type) {
        super(name, ID, location, description, capacity, start, end, type);
        this._host = [];
    }

    /**
     * Gets all the speakers of this PanelDiscussion.
     * @return hosts for this PanelDiscussion
     */
    get host(){
        return Array.from(this._host);
    }

    /**
     * Sets the Speakers of this PanelDiscussion.
     * @param newHost new speakers of PanelDiscussion
     * @return true meaning that the speakers are modified
     */
    set host(newHost){
        this._host.length = 0;
        this._host.concat(newHost);
        return true;
    }

    /**
     * Gets the number of speakers required for this PanelDiscussion, which is multiple
     * @return -1, representing multiple speakers are allowed
     */
    getNumSpeaker() {
        return -1;
    }

    /**
     * Gives the toString information of this talk in a string.
     * The information contains all information from toString method in event class, also speaker for the talk.
     * @return String of information of this Panel Discussion, contains name, start time, location, capacity, description and
     * speaker
     */
    toString(){
        return super.toString() + "Host: " + this.hostToString();
    }

    hostToString(){
        let builder = "";
        let speaker;
        for (speaker in this._host){
            builder += speaker + ", ";
        }
        if (builder.length != 0) builder = builder.substring(0, builder.length - 2);
        return builder;
    }
}