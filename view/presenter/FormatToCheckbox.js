// Format the input string as the value and label of a <input> element of type checkbox
export function formatToCheckbox(value, name){
    return "<input type=\"checkbox\" id=\"" + value + "\" name=\"" + name + "\" value=\"" + value + "\">" +
        "<label for=\"" + value + "\">" + value + "</label><br>"
}