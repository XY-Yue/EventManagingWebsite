import EventManager from "./model/event/EventManager.js";

/**
 * Operates on events, mainly requesting data and sending them to some view.
 */
export default class{
    /**
     * Initializes event manager, and return data back to the caller view
     */
    constructor() {
        this._eventManager = new EventManager();
    }

    /**
     * Extracts all event information and return the first 10 results
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
     * @return string formatted as HTML <dl> elements, representing first 10 resulting events
     */
    searchEvents(vip, current, nameKey, location, start, end, type, speakers){
        this._allEvents = this._eventManager.searchEventSchedule(vip, current, nameKey, location, start,
            end, type, speakers);

        this._curCount = 1;

        return this._formatEventsIntoHTML(this._allEvents.slice(0, 10));
    }

    /**
     * Gets the number of results from a previous search
     */
    getNumResult(){
        if (this.hasOwnProperty("_allEvents")){
            return this._allEvents.length;
        }else {
            return 0;
        }
    }

    // helper to format given events into HTML <dl> elements
    _formatEventsIntoHTML(events){
        let output = "";
        for (let i = 0; i < events.length; i++){
            output += this._formatEventIntoHTML(events[i]);
        }
        return output;
    }

    // helper to format a single event into a HTML <dl> element, where name is <dt> and details are in <dd>
    _formatEventIntoHTML(event){
        let output = "";

        output += "<dt id='" + event._ID + "'>";
        if (event._isVIP){
            output += "[VIP] ";
        }
        output += event._name;
        output += "</dt>";

        output += "<dd>";
        output += "Type: " + event._type;
        output += "</dd>";

        output += "<dd>";
        output += "Location: " + event._location;
        output += "</dd>";

        output += "<dd>";
        output += event._start.toLocaleString() + "  to  " + event._end.toLocaleString();
        output += "</dd>";

        output += "<dd>";
        output += event._description;
        output += "</dd>";

        this._curCount ++;

        return output;
    }

    getMoreEvents(){
        return this._formatEventsIntoHTML(this._allEvents.slice(this._curCount - 1, this._curCount + 9));
    }

}
