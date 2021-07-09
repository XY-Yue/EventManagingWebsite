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
        this._schedule = []; // Will be in format {eventID: [start time of this event, end time of this event], ...}
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
            let slot;
            for (slot in this._availableTimes){
                if (!(slot[0] > end || slot[1] < start)){
                    return slot[0] <= start && slot[1] >= end;
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
     */
    addEventToSchedule(startTime, endTime, eventID){
        this._schedule[eventID] = [startTime, endTime];
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
        let feature;
        for (feature in checkedFeatures){
            if (!this._features.includes(feature)) return false;
        }
        return true;
    }

    /**
     * Give the toString representation of a room object
     */
    toString(){
        let result = this._roomName;
        result += '\n' + 'capacity: ' + this._capacity + '\n';
        result += 'features: ';
        let features;
        for (features in this._features){
            result += features + '; ';
        }
        return result;
    }
}