import Account from './Account.js'

/**
 * An entity class represents an organizer account, which is a child class of abstract class account.
 * It stores a list of events that the organizer organized in addition, no matter the event is removed or not.
 */
export default class extends Account{
    /** Creates an organizer account with specific username and his/her account password.
     * @param name A string represents the username of this organizer account.
     * @param password A string represents the password of this organizer account.
     */
    constructor(name, password) {
        super(name, password, "Organizer");
        this._specialEvents = [];
        this._isVIP = true;
    }

    /** Gets the list of events that the organizer organized.
     * @return The list of strings which represents the unique id of each event that the
     * organizer organized.
     */
    getSpecialList() {
        return Array.from(this._specialEvents);
    }

    /** Adds a new event to the list of events that the organizer organized.
     * @param id A String represents the unique ID of this event.
     * @return true iff the list does not already contain the ID
     */
    addToSpecialList(id) {
        if (this._specialEvents.lastIndexOf(id) !== -1) {
            return false;
        }
        this._specialEvents.push(id);
        return true;
    }

    /** Removes an event from the list of events that the organizer organized.
     * @param id A String represents the unique ID of this event.
     * @return true iff the list does contain the ID and it is removed
     */
    removeFromSpecialList(id) {
        let index = this._specialEvents.lastIndexOf(id);
        if (index !== -1) {
            this._specialEvents.splice(index, 1);
            return true;
        }
        return false;
    }

    /** Displays a description for this organizer account about the number of events he/she is organizing.
     * @return string representing the number of events organized by this organizer account in addition.
     */
    toString(){
        return super.toString() + "\nYou have organized " + this._specialEvents.length + " events.";
    }

    /**
     * Checks if this account has VIP access
     * @return isVIP which represents if this account has VIP
     */
    isVIP() {
        return this._isVIP;
    }
}