import {isAvailable} from '../Available.js';

/**
 * An entity class of Room.
 * Stores capacity, available time, unique room name, schedule of a room, and a collection of features
 * Schedule is a map with start time map to event name.
 * availableTime is a map that maps the start hour to end hour of the room open time, 0 <= start time <= 23 and
 * 1 <= end time <= 24, and no overlap.
 */
export default class {
    /**
     * Constructs a Room object
     * @param capacity Maximum capacity of this room
     * @param availableTimeSlots Time slots that this room is available, assume the input has no overlap slots
     * @param roomName An unique String representation of the room name
     * @param features A List of additional features that this room can provide
     */
    constructor(capacity, availableTimeSlots, roomName, features){
        this._capacity = capacity;

        this._availableTimes = []; // This will be a 2D array
        for (let i = 0; i < availableTimeSlots.length; i++){
            this._availableTimes.push([availableTimeSlots[i][0], availableTimeSlots[i][1]]);
        }

        this._features = Array.from(features);
        this._roomName = roomName;
        this._schedule = {};// Will be in format {eventID: [startTime of this event, endTime of this event, name], ...}
    }

    /**
     * Gets the capacity of room.
     * @return capacity of room
     */
    get capacity() {
        return this._capacity;
    }

    /**
     * Checks if the room is available during the given interval
     * @param startTime Start time of the interval
     * @param endTime End time of the interval
     * @return true iff the room is available during this interval
     */
    available(startTime, endTime) {
        return isAvailable(this._schedule, startTime, endTime);
    }

    /**
     * Checks the room is open during the given interval hours
     * @param start Start Hour of the given interval
     * @param end End Hour of the given interval
     * @return true iff this room is open during this interval
     */
    isValidTimeSlot(start, end){
        if (start > end) {
            return this.isValidTimeSlot(0, start) && this.isValidTimeSlot(end, 24);
        }else {
            for (let i = 0; i < this._availableTimes.length; i++){
                if (this._availableTimes[i][0] <= start && this._availableTimes[i][1] >= end){
                    return true;
                }
            }
            return false;
        }
    }

    /**
     * Adds the event to the schedule
     * @param startTime Start time of the interval
     * @param endTime End time of the interval
     * @param eventID A String representation of the event id
     * @param eventName the name of the event
     */
    addEventToSchedule(startTime, endTime, eventID, eventName){
        this._schedule[eventID] = [startTime, endTime, eventName];
    }

    /**
     * Removes the event from the schedule
     * @param startTime Start time of the interval
     * @param endTime End time of the interval
     * @param eventID A String representation of the event id
     * @return true iff the event is removed successfully
     */
    removeEventFromSchedule(startTime, endTime, eventID){
        if (this._schedule.hasOwnProperty(eventID) && this._schedule[eventID] != null){
            if (this._schedule[eventID][0].getTime() === startTime &&
                this._schedule[eventID][1].getTime() === endTime){
                delete this._schedule[eventID];
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if the room has the list of additional features
     * @param checkedFeatures A list of String representation of the additional features
     * @return true iff the room has all the features given by
     */
    hasFeatures(checkedFeatures){
        for (let j = 0; j < checkedFeatures.length; j++){
            let pass = false;
            for (let i = 0; i < this._features.length; i++){
                if (checkedFeatures[j] === this._features[i]){
                    pass = true;
                    break;
                }
            }
            if (!pass) {
                return false;
            }
        }
        return true;
    }

    /**
     * Adds given features to the room, only adds the ones that are not already present
     * @param features an array of features to be added
     * @return array representing all features that are finally added
     */
    addFeatures(features){
        let added = [];
        for (let i = 0; i < features.length; i++){
            if (!this._features.includes(features[i].toString())){
                this._features.push(features[i].toString());
                added.push(features[i]);
            }
        }
        return added;
    }
}