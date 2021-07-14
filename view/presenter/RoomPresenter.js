import RoomManager from "./model/room/RoomManager.js";
import {formatToCheckbox} from "./FormatToCheckbox.js";

/**
 * Handles View's events by communicating with model and return data to views
 */
export default class {
    constructor() {
        this._roomManager = new RoomManager();
    }

    /**
     * Search rooms that matches the given constrains, output room information formatted in HTML <dt> and <dd> elements
     * @param roomNameKeyword a string representing keyword in roomName, empty means any room name
     * @param capacity a string containing a integer representing minimum capacity of the desired room
     * @param available a pair of string containing integers as available times for the room, empty string means any
     * @param features an array of desired features of rooms
     * @return string containing the first 10 room information formatted correctly
     */
    searchRooms(roomNameKeyword, capacity, available, features){
        capacity = parseInt(capacity);
        if (available[0] === "-"){
            available = []; // This means no requirement on available time
        }else {
            available[0] = parseInt(available[0]);
            available[1] = parseInt(available[1]);
        }

        this._allRooms = this._roomManager.searchRoomsInfo(roomNameKeyword, capacity, available, features);
        this._curCount = 1;

        return this._formatRoomsIntoHTML(this._allRooms.slice(0, 10));
    }

    /**
     * Gets the number of results from a previous search
     */
    getNumResult(){
        if (this.hasOwnProperty("_allRooms")){
            return this._allRooms.length;
        }else {
            return 0;
        }
    }

    // helper to format given rooms into HTML <dl> elements
    _formatRoomsIntoHTML(rooms){
        let output = "";
        for (let i = 0; i < rooms.length; i++){
            output += this._formatRoomIntoHTML(rooms[i]);
        }
        return output;
    }

    // helper to format a single room into a HTML <dl> element, where name is <dt> and details are in <dd>
    _formatRoomIntoHTML(room){
        let output = "";

        output += "<dt id='" + room._roomName + "'>";
        output += room._roomName;
        output += "</dt>";

        output += "<dd>";
        output += "Capacity: " + room._capacity.toString();
        output += "</dd>";

        output += "<dd>";
        output += "Available at: "
        for (let i = 0; i < room._availableTimes.length; i++){
            output += room._availableTimes[i][0] + "-" + room._availableTimes[i][1] + "   ";
        }
        output += "</dd>";

        this._curCount++;

        return output;
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
            output += formatToCheckbox(features[i], "feature");
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
            return formatToCheckbox(feature, "feature");
        }
    }

    /**
     * Gets the next 10 rooms from a previous search result
     * @return {string} of rooms formatted as HTML <dl> element's inner HTML
     */
    getMoreRooms(){
        return this._formatRoomsIntoHTML(this._allRooms.slice(this._curCount - 1, this._curCount + 9));
    }

    /**
     * Gets data for a single room with this given roomName
     * @param roomName the name of the desired room
     * @return object with field name mapped to strings representing value of the fields
     */
    getSingleRoom(roomName){
        // Converting to a string literal to avoid mistake comparison between object and literal
        let room = this._roomManager.printRoom(roomName.toString());

        room._capacity = room._capacity.toString();

        let available = "";
        for (let i = 0; i < room._availableTimes.length; i++){
            available += room._availableTimes[i][0] + "-" + room._availableTimes[i][1] + "   ";
        }
        room._availableTimes = available;

        let features = "";
        for (let i = 0; i < room._features.length; i++){
            features += room._features[i] + "<br>";
        }
        room._features = features;

        let schedule = "";
        for (const [key, value] of Object.entries(room._schedule)){
            if (value[1].getTime() > new Date().getTime()){
                schedule += key + ": <a href='../EventSignUpPage.html?id=" + key + "'></a>"
                    + value[2] + ";  from " + value[0] + " to " + value[1] + ";<br>";
            }
        }
        room._schedule = schedule;

        return room;
    }

    /**
     * Adds features to the room
     * @param roomName name of the target room
     * @param features an array of features to be added to the room
     * @return string containing all new features that are finally added into the room
     */
    addFeatureToRoom(roomName, features){
        let result = this._roomManager.addFeatureToRoom(roomName, features);

        let output = "";
        for (let i = 0; i < result.length; i++){
            output += result[i] + "; ";
        }
        return output;
    }
}
