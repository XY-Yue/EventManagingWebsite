// helper to format given events into HTML <dl> elements
export function _formatEventsIntoHTML(events){
    let output = "";
    for (let i = 0; i < events.length; i++){
        output += _formatEventIntoHTML(events[i]);
    }
    return output;
}

// helper to format a single event into a HTML <dl> element, where name is <dt> and details are in <dd>
function _formatEventIntoHTML(event){
    let output = "";

    output += "<dt id='" + event._ID + "'>";
    if (event._isVIP){
        output += "[VIP] ";
    }
    output += event._name;
    output += "</dt>";

    output += "<dd>";
    output += "Type: " + event._type;
    output += "</dd>";

    output += "<dd>";
    output += "Location: " + event._location;
    output += "</dd>";

    output += "<dd>";
    output += event._start.toLocaleString() + "  to  " + event._end.toLocaleString();
    output += "</dd>";

    output += "<dd>";
    output += event._description;
    output += "</dd>";

    return output;
}