/**
 * Check if the given schedule is available during this time or not
 * @param schedule A map of schedule in format {eventID: [start time, finish time]}
 * @param start Start time of this interval
 * @param finish End time of this interval
 * @return true iff this interval is available with given schedule
 */
export function isAvailable(schedule, start, finish){
    // Assuming the given time is checked with isValidTimeSlots
    let values = Object.values(schedule);
    for (let i = 0; i < values.length; i++){
        if ((values[i][0].getTime() >= start.getTime() && values[i][0].getTime() < finish.getTime())
            || (values[i][1].getTime() <= finish.getTime() && values[i][1].getTime() > start.getTime())){
            return false;
        }
    }
    return true;
}