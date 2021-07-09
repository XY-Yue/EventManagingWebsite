import RoomManager from "./model/room/RoomManager.js";

/**
 * Handles View's events by communicating with model and return data to views
 */
export default class {
    constructor() {
        this._roomManager = new RoomManager();
    }

    /**
     * Display all room information formatted in HTML <dt> and <dd> elements
     * @return string containing the first 10 room information formatted correctly
     */
    displayRooms(){

    }

    /**
     * Adds a new room based on user input, the <name> input may or may not be valid
     * @param name of the new room, should be unique in all room names
     * @param availableTime a collection of integer hours that this room is available, e.g. 1 in availableTime
     * means room is available at 1:00 - 2:00 a.m.
     * @param capacity a positive integer representing capacity
     * @param features a list of features this room has
     * @return true iff room is created successfully
     */
    addRoom(name, availableTime, capacity, features){
        if (this._roomManager.hasRoom(name)){
            return false;
        }else {
            let slots = [];
            let i = 0;
            while (i < availableTime.length){
                let j = i + 1;
                while (j < availableTime.length && availableTime[j] === availableTime[j - 1] + 1){
                    j++;
                }
                slots.push([availableTime[i], availableTime[j - 1] + 1]);

                i = j;
            }

            this._roomManager.addRoom(capacity, slots, name, features);
            return true;
        }
    }

    /**
     * Provides all existing features, formatted so that they can be inserted into a checkbox form directly
     */
    allFeatures(){
        let features = this._roomManager.getAllFeatures();

        let output = "";

        for (let i = 0; i < features.length; i++){
            output += formatToCheckbox(features[i]);
        }

        return output;
    }

    /**
     * Adds a new feature
     * @param feature a new feature that needs to be added
     * @return string formatted to checkbox element, or empty if the feature already exist
     */
    addFeature(feature){
        feature = feature.toLowerCase();
        if (this._roomManager.hasFeature(feature)){
            return "";
        }else {
            this._roomManager.addFeature(feature);
            return formatToCheckbox(feature);
        }
    }

}


// Format the input string as the value and label of a <input> element of type checkbox
function formatToCheckbox(input){
    return "<input type=\"checkbox\" id=\"" + input + "\" name=\"feature\" value=\"" + input + "\">" +
        "<label for=\"" + input + "\">" + input + "</label><br>"
}