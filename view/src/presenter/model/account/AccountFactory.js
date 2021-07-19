import Attendee from './Attendee.js';
import Organizer from "./Organizer.js";
import VIPAttendee from "./VIPAttendee.js";
import Speaker from "./Speaker.js";
import Account from "./Account.js";

/**
 * A factory class that can construct a new Attendee, Speaker or Organizer account.
 * It gives account type, username and password for a new account as parameter.
 */
export default class {
    /**
     * Creates a new account with given type, username and password.
     * @param accountType A string representing the type of this new account.
     * @param username A string representing the username of this new account.
     * @param password A string representing the password of this new account.
     * @return Account object with these given information.
     */
    getAccount(accountType, username, password){
        if (accountType == null) {
            return null;
        } else if (accountType.toUpperCase() === "ATTENDEE") {
            return new Attendee(username, password);
        } else if (accountType.toUpperCase() === "SPEAKER") {
            return new Speaker(username, password);
        } else if (accountType.toUpperCase() === "ORGANIZER") {
            return new Organizer(username, password);
        } else if (accountType.toUpperCase() === "VIP"){
            return new VIPAttendee(username, password);
        } else {
            return null;
        }
    }
}