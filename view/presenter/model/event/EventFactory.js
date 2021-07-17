import Event from './Event.js';
import Party from "./Party.js";
import PanelDiscussion from "./PanelDiscussion.js";
import Talk from "./Talk.js";

/**
 * An Factory class that creates Event Entities
 * Creates a event object of given type with given information
 */
export default class{
    /**
     * Constructs the Event Entity
     * @param type The type of the event, used for determining which constructor to call
     * @param name name of the new event
     * @param start start time of event
     * @param end end time of event
     * @param location room name of the new event held in
     * @param description description of the new event
     * @param capacity the max number of people can participate in the new event
     * @param id The unique ID of this event
     * @return Event object created based on user input
     */
    makeEvent(type, name, start, end, location, description, capacity, id){
        type = type.toLowerCase();
        switch (type){
            case "talk":
                return new Talk(name, id, location, description, capacity, start, end, type);
            case "party":
                return new Party(name, id, location, description, capacity, start, end, type);
            case "discussion":
                return new PanelDiscussion(name, id, location, description, capacity, start, end, type);
            default:
                return null;
        }
    }
}