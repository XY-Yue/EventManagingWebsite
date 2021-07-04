/**
 * Check if the given schedule is available during this time or not
 * @param schedule A map of schedule in format {eventID: [start time, finish time]}
 * @param start Start time of this interval
 * @param finish End time of this interval
 * @return true iff this interval is available with given schedule
 */
export function isAvailable(schedule, start, finish){
    // Assuming the given time is checked with isValidTimeSlots
    for (const value in Object.values(schedule)){
        if ((value[0].getTime() >= start.getTime() && value[0].getTime() < finish.getTime())
            || (value[1].getTime() <= finish.getTime() && value[1].getTime() > start.getTime())){
            return false;
        }
    }
    return true;
}