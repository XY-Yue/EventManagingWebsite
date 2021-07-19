// Helper to extract user choices from a checkbox input
// name is the name of the checkboxes
export function extractCheckboxResult(name){
    let checkbox = document.getElementsByName(name);
    let choice = [];
    for (let i = 0; i < checkbox.length; i++){
        if (checkbox[i].checked){ // Finding the user's choice
            choice.push(checkbox[i].value.toString());
        }
    }
    return choice;
}

// Helper to convert the user input date into an actual date object
// value: a date string in yyyy-mm-dd format, hour: hour of the date
export function convertDate(value, hour){
    if (value === "") {
        return null;
    }
    let day = value.split("-");
    return new Date(
        parseInt(day[0], 10), // year
        parseInt(day[1], 10) - 1, // month
        parseInt(day[2], 10), // day
        parseInt(hour, 10) // hour
    );
}