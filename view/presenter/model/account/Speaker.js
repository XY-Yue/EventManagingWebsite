import Account from './Account.js'

/**
 * An entity class represents an speaker account, which is a child class of abstract class account.
 * It stores a list of events that the speaker given in addition.
 */
export default class extends Account{
    /** Creates a speaker account with specific username and his/her account password.
     * @param name A string represents the username of this speaker account.
     * @param password A string represents the password of this speaker account.
     */
    constructor(name, password) {
        super(name, password, "speaker");
        this._specialEvents = [];
        this._isVIP = true;
    }

    /** Gets the list of events that the organizer organized.
     * @return The list of strings which represents the unique id of each event that the speaker given.
     */
    getSpecialList() {
        return Array.from(this._specialEvents);
    }

    /** Adds new event to the list of events that the speaker given.
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

    /** Removes am event from the list of events that the speaker given.
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

    /** Displays a description for this speaker account about the number of events he/she gives.
     * @return string representing the number of events given by this speaker account in addition.
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

    specialDescription(){
        return "Hosted events: ";
    }
}