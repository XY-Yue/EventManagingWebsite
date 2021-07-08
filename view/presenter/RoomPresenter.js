import RoomManager from "./model/room/RoomManager.js";

export default class {
    constructor() {
        this._roomManager = new RoomManager();
    }

    displayRooms(){

    }

    /**
     * Adds a new room based on user input, the <name> input may or may not be valid
     * @param name of the new room, should be unique in all room names
     * @param availableTime a sorted collection of hours that this room is available, e.g. 1 in availableTime means
     * room is available at 1:00 - 2:00 a.m.
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
                if (i === j - 1){
                    slots.push([availableTime[i], availableTime[i] + 1]);
                }else {
                    slots.push([availableTime[i], availableTime[j] + 1]);
                }
            }

            this._roomManager.addRoom(capacity, slots, name, features);
            return true;
        }
    }
}