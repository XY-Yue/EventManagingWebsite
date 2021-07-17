import Room from "./Room.js";
import reviver from "../reviver.js";

/**
 * An use case class of room.
 * Stores all room in a map which has room name map to the corresponding Room object.
 * Contains constructor of room, which is able to construct a new room.
 * Methods in this class contains check room status, operating on specific room, and get room with given information.
 * All the parameter should be given by controller of room.
 */
export default class{
    /**
     * Constructs the RoomManager object
     */
    constructor() {
        // format: {room name: room object with this name, ...}
        this._roomList = this._readData("roomList");
        this._roomFeatureList = this._readData("roomFeatureList");
        if (this._roomFeatureList.length === 0)
            this._roomFeatureList = ["projector", "row of chairs", "table", "computers"]; // records features available
    }

    // Writes roomList and roomFeatureList to local storage
    _storeData(){
        localStorage.setItem("roomList", JSON.stringify(this._roomList));
        localStorage.setItem("roomFeatureList", JSON.stringify(this._roomFeatureList));
    }

    // Reads room information from local storage, parse JSON objects to room objects with methods
    _readData(key){
        let data = localStorage.getItem(key);

        if (data == null) {
            if (key === "roomList"){
                return {};
            }else {
                return [];
            }
        } else {
            if (key === "roomFeatureList"){
                return JSON.parse(data);
            }else {
                data = JSON.parse(data, reviver);

                for (const [key, value] of Object.entries(data)){
                    let room = new Room(value._capacity, value._availableTimes, value._roomName,
                        value._features);

                    for (const [event, time] of Object.entries(value._schedule)){
                        room.addEventToSchedule(time[0], time[1], event, time[2]);
                    }
                    data[key] = room;
                }
                return data;
            }
        }
    }

    _findRoom(name){ // find a room object with a given name
        if (this._roomList.hasOwnProperty(name)){
            return this._roomList[name];
        }
        return null;
    }

    /**
     * Gives the toString description of room with given name.
     * @param roomName the name of room ask for toString description
     * @return room in a JSON object
     */
    printRoom(roomName){
        let room = this._findRoom(roomName);
        if (room == null) {
            return null;
        }else {
            return JSON.parse(JSON.stringify(room, reviver));
        }
    }

    /**
     * Finds a list of room that satisfies all the given conditions (time, feature, capacity)
     * @param start Start time of the interval
     * @param end End time of the interval
     * @param features Required a list of String representation of additional features
     * @param capacity Required capacity
     * @return list of room name that satisfies all of the given conditions
     */
    availableRooms(start, end, features, capacity){
        let output = [];
        for (const [name, room] in Object.entries(this._roomList)){
            if (room.capacity >= capacity){
                if (room.available(start, end)){
                    if (room.hasFeatures(features)){
                        if (end.getTime() - start.getTime() >= 86400000) { // the durations is over a day
                            if (room.isValidTimeSlot(0, 24)){
                                output.push(name);
                            }
                        }else {
                            if (room.isValidTimeSlot(start.getHours(), end.getHours())){
                                output.push(name);
                            }
                        }
                    }
                }
            }
        }
        return output;
    }

    /**
     * Adds a room, assume the name is valid
     * @param capacity Maximum capacity of the given room
     * @param availableTime Available time slots of the room, in format [[start1, end1], ...]
     * @param roomName A String representation of the room name
     * @param features A list of String representation of additional features
     */
    addRoom(capacity, availableTime, roomName, features){
        this._roomList[roomName] = new Room(capacity, availableTime, roomName, features);
        this._storeData();
    }

    /**
     * Checks the given room name exists or not
     * @param roomName A String representation of the room name
     * @return true iff the room exists
     */
    hasRoom(roomName){
        return this._findRoom(roomName) != null;
    }

    /**
     * Adds an event to a room
     * @param roomName A String representation of the room name
     * @param eventID A String representation of the event id
     * @param eventName Name of the event
     * @param startTime Start time of the interval
     * @param endTime End time of the interval
     * @return true iff the event is added successfully
     */
    addEventToRoom(roomName, eventID, eventName, startTime, endTime){
        let room = this._findRoom(roomName);
        if (room != null){
            room.addEventToSchedule(startTime, endTime, eventID, eventName);
            this._storeData();
        }
        return false;
    }

    /**
     * Removes an event from a room
     * @param roomName A String representation of the room name
     * @param eventID A String representation of the event id
     * @param startTime Start time of the interval
     * @param endTime End time of the interval
     * @return true iff the event is removed successfully
     */
    removeEventFromRoom(roomName, eventID, startTime, endTime){
        let room = this._findRoom(roomName);
        if (room != null){
            room.removeEventFromSchedule(startTime, endTime, eventID);
            this._storeData();
        }
        return false;
    }

    /**
     * Gets the room capacity
     * @param roomName A String representation of given room
     * @return capacity of the given room, -1 if the room does not exist
     */
    getRoomCapacity(roomName){
        let room = this._findRoom(roomName);
        if (room != null){
            return room.capacity;
        }
        return -1;
    }

    /**
     * Generates a String representation of the room info
     * @param roomName a string keyword of roomName
     * @param capacity an integer representing minimum capacity of the rooms needed
     * @param available a pair of integer representing a time period that the room need to be available
     * @param features all features the room need to have
     * @return room info for all desired rooms in JSON objects
     */
    searchRoomsInfo(roomName, capacity, available, features){
        let output = [];
        for (const [key, value] of Object.entries(this._roomList)){
            if (!key.includes(roomName)){
                continue;
            }
            if (value.capacity < capacity){
                continue;
            }
            if (available.length !== 0 && !value.isValidTimeSlot(available[0], available[1])){
                continue;
            }
            if (!value.hasFeatures(features)){
                continue;
            }
            output.push(JSON.parse(JSON.stringify(value, reviver)));
        }
        return output;
    }

    /**
     * Gets a list of String representation of the additional features
     * @return list of all features
     */
    getAllFeatures(){
        return Array.from(this._roomFeatureList);
    }

    /**
     * Checks if the feature is in the feature list
     * @param feature A String representation of the additional feature
     * @return true iff the additional feature is in the list
     */
    hasFeature(feature){
        return this._roomFeatureList.includes(feature);
    }

    /**
     * Adds a new feature to the feature list
     * @param feature A String representation of the additional feature
     */
    addFeature(feature){
        this._roomFeatureList.push(feature);
        this._storeData();
    }

    /**
     * Adds all features to roomName's room
     * @param roomName the name of the target room
     * @param features the features to be added
     * @return array of features that are finally added
     */
    addFeatureToRoom(roomName, features){
        let room = this._findRoom(roomName);
        if (room != null){
            let output = room.addFeatures(features);
            if (output.length !== 0){
                this._storeData();
            }
            return output;
        }
        return [];
    }
}