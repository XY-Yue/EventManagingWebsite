import Account from './Account.js'

/**
 * An entity class representing an VIP account, which is a child class of abstract class account.
 * It stores a list of VIP only events that the account attended
 */
export default class extends Account{
    /**
     * Creates an account with the specified username and password.
     * @param name The username of this account.
     * @param password The password to log in this account.
     */
    constructor(name, password) {
        super(name, password, "VIP");
        this._specialEvents = [];
    }

    /** Gets the VIP events the user attended
     * @return The list of VIP event IDs for this user
     */
    getSpecialList() {
        return Array.from(this._specialEvents);
    }

    /** Adds new VIP event to the list of events attended.
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

    /** Removes an event from the list of events attended.
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

    /** Displays a description for this VIP account about the number of VIP events attended.
     * @return string representing the number of VIP events this VIP account attended.
     */
    toString(){
        return super.toString() + "\nYou have organized " + this._specialEvents.length + " events.";
    }

    /**
     * Checks if this account has VIP access
     * @return true only, because VIP attendees are always VIP
     */
    isVIP() {
        return true;
    }
}