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