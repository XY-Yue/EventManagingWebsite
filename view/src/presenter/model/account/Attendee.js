import Account from './Account.js';

/**
 * An entity class represents an attendee account, which is a child class of abstract class account.
 */
export default class extends Account{
    /**
     * Creates an attendee account with specific username and his/her account password.
     * @param name A string represents the username of this attendee account.
     * @param password  A string represents the password of this attendee account.
     */
    constructor(name, password) {
        super(name, password, "attendee");
    }

    /** Gets the list of events specialized for this account (unavailable for attendee)
     * @return Null because attendee has no special events
     */
    getSpecialList() {
        return null;
    }

    /** Adds a event into the specialized list for this account
     * @param id A String represents the unique ID of this event.
     * @return true iff the list does not already contain the ID
     */
    addToSpecialList(id) {
        return false;
    }

    /** Removes a event from the specialized list for this account
     * @param id A String represents the unique ID of this event.
     * @return true iff the list does contain the ID and it is removed
     */
    removeFromSpecialList(id) {
        return false;
    }

    /**
     * Checks if this account has VIP access
     * @return false only, because normal attendees cannot be VIP
     */
    isVIP() {
        return false;
    }

    specialDescription(){
        return null;
    }
}