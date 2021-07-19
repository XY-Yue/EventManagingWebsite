import Attendee from './Attendee.js';
import Organizer from "./Organizer.js";
import VIPAttendee from "./VIPAttendee.js";
import Speaker from "./Speaker.js";
import Account from "./Account.js";
import AccountFactory from "./AccountFactory.js";
import reviver from "../reviver.js";

/**
 * A use case class that can manager Account entity
 * It stores all accounts。
 */
export default class{
    constructor() {
        // Will be in format: {type: {ID: account of this type with this ID, ...}, ...}
        this._allAccounts = this._readData();
        this._accountTypes = ["attendee", "organizer", "speaker", "vip"];
        this._invitationCode = {
            attendee: [],
            organizer: ["create an organizer"],
            speaker: ["create an speaker"],
            vip: ["create an vip"]
        }
    }

    // This method writes this._allAccounts to storage as a JSON string
    // Every time a account is updated, this method should be called
    _storeData(){
        localStorage.setItem("allAccount", JSON.stringify(this._allAccounts));
    }

    // This method reads this._allAccounts from storage and parse it from JSON string into JSON objects
    // This method is only needed by the constructor.
    _readData(){
        let accounts = localStorage.getItem("allAccount");

        if (accounts == null) return {}; // No data in local storage, so no accounts
        else {
            let accountObj = JSON.parse(accounts, reviver);
            // parse JSON string into an array of JSON objects, with Date parsed by the above reviver function
            for (const [_, value] of Object.entries(accountObj)){
                for (const [id, account] of Object.entries(value)){
                    value[id] = this._parseAccount(value[id]);
                }
            }
            return accountObj;
        }
    }

    // This method parse the JSON object representation of an account into an actual account object, so that
    // we can call methods in Account
    _parseAccount(jsonObj){
        if (jsonObj == null) return null;
        let account = new AccountFactory().getAccount(jsonObj._type, jsonObj._name, jsonObj._password);

        for (let i = 0; i < jsonObj._friends.length; i++){
            account.addFriend(jsonObj._friends[i]);
        }

        for (const [key, value] of Object.entries(jsonObj._schedule)){
            account.addEvent(value[0], value[1], key, value[2]);
        }

        for (const [key, value] of Object.entries(jsonObj._message)){
            account.setMessageList(key, value);
        }

        if (jsonObj.hasOwnProperty('_specialEvents')){
            for (let i = 0; i < jsonObj._specialEvents.length; i++){
                account.addToSpecialList(jsonObj._specialEvents[i]);
            }
        }
        return account;
    }

    _findAccountByUsername(username){
        for (const [_, value] of Object.entries(this._allAccounts)){
            if (value.hasOwnProperty(username) && value[username] != null)
                return value[username];
        }
        return null;
    }

    /**
     * Checks if this account is given type
     * @param username A string representation of the username
     * @param type A String representation of the account type
     * @return true iff the account of a given username is the type of given type
     */
    isAccountType(username, type){
        if (!this._allAccounts.hasOwnProperty(type) || this._allAccounts[type] == null){
            return false;
        }else {
            let value = this._allAccounts[type];

            return value.hasOwnProperty(username) && value[username] != null;
        }
    }

    /**
     * Checks if this user exist.
     * @param username A string representing the username of the account for checking.
     * @return true iff the account with given username exists, false if the account does not exist.
     */
    checkUser(username){
        return this._findAccountByUsername(username) != null;
    }

    /**
     * Gets all usernames of accounts basing on the type
     * @param type A string represents the type of accounts needed.
     * @return List of Strings that represent all usernames of the given type of accounts.
     */
    getUsernameForType(type){
        if (!this._allAccounts.hasOwnProperty(type) || this._allAccounts[type] == null){
            return null;
        }else {
            let accounts = Object.keys(this._allAccounts[type]);
        }
    }

    /**
     * Check if the given password matches the account's password.
     * @param username A string represents the username of this account.
     * @param password A string represents the password that be checked.
     * @return type of this account iff the account exists and with the password matching
     * with that account's password, null if the account does not exist or the password does not match.
     */
    checkPassword(username, password){
        let account = this._findAccountByUsername(username);

        if (account == null || account.password !== password) return null;
        else return account.type;
    }

    /**
     * Get the user's type
     * @param username A string represents the username of this account.
     * @return type of this account iff the account exists, otherwise return null
     */
    checkType(username){
        let account = this._findAccountByUsername(username);

        if (account == null) return null;
        else return account.type;
    }

    /**
     * Adds a new account to specific account lists basing on the type of this new account. If this account is a
     * speaker account, it is added to speakerList. ELse, it is added to allAccounts.
     * Assumes that this account does not exist
     * @param accountType A string represents the type of this account.
     * @param username A string represents the username of this account.
     * @param password A string represents the password of this account.
     */
    addAccount(accountType, username, password){
        let newAccount = new AccountFactory().getAccount(accountType, username, password);

        accountType = accountType.toLowerCase();

        if (!this._allAccounts.hasOwnProperty(accountType) || this._allAccounts[accountType] == null){
            this._allAccounts[accountType] = {};
        }
        this._allAccounts[accountType][username] = newAccount;

        this._storeData();
    }

    /**
     * Checks if a given account is available at given time interval
     * @param startTime Represents the start of a time interval
     * @param endTime Represents the end of a time interval
     * @param user A string represents the username of the account.
     * @return true iff this account exists and is available at given time, false if the account does not exist
     * or is not available at that time.
     */
    freeAtTime(startTime, endTime, user){
        let account = this._findAccountByUsername(user);

        return account != null && account.isAvailable(startTime, endTime);
    }

    /**
     * Signs up a event for an account at a given time interval
     * @param time A time interval where start time is at index 0 and end time is index 1
     * @param eventID A string represents the unique id of this event.
     * @param username A string represents the username of an account.
     * @param eventName name of the event
     * @return true iff this account exists and is available at the given time list
     */
    signUpEvent(time, eventID, username, eventName){
        let account = this._findAccountByUsername(username);

        if (account == null || !account.isAvailable(time[0], time[1])){
            return false;
        }else {
            account.addEvent(time[0], time[1], eventID, eventName);
            this._storeData();
            return true;
        }
    }

    /**
     * Cancels a event for an account at a given time interval
     * @param time A time interval where start time is at index 0 and end time is index 1
     * @param event A string represents the unique id of this event.
     * @param username A string represents the username of this account.
     * @return true iff this account exists and the event can be removed from account's eventList successfully,
     * false if this account does not exist or the removing fails.
     */
    cancelEvent(time, event, username){
        let account = this._findAccountByUsername(username);

        if (account == null) {
            return false;
        }
        console.log("123");
        account.removeEvent(time[0], time[1], event);
        this._storeData();
        return true;
    }

    /**
     * Gets a list of strings representing the events that the user signed up.
     * @param username A string represents the username of the account.
     * @return object with eventID mapped to an array of [start time, finish time, event name]
     */
    viewSignedUpEvents(username){
        let account = this._findAccountByUsername(username);

        if (account == null) {
            return null;
        }
        return account.schedule;
    }

    /**
     * Gets the number of up coming and expired events of the user
     * @param username the target user's username
     * @return pair of integer representing the number of [up coming, expired] events
     */
    getNumberOfEvents(username){
        let account = this._findAccountByUsername(username);

        if (account == null) {
            return null;
        }else {
            return account.numberOfEvents();
        }
    }

    /**
     * Adds a new friend to the list of friends of the account.
     * @param username A string represents the username of the account.
     * @param friend A string represents the username of the friend account.
     * @return true iff the account exist, the friend account exists and does not exist in the account's friend list,
     * and add the friend successfully, false if the either accounts does not exist or the friend account already in
     * the friend list of the account.
     */
    addFriend(username, friend){
        let account = this._findAccountByUsername(username);

        if (account == null || this._findAccountByUsername(friend) == null || account.hasFriend(friend)) {
            return false;
        } else {
            account.addFriend(friend);
            this._storeData();
            return true;
        }
    }

    /**
     * Removes a friend from the list of friends of the account.
     * @param username A string represents the username of the account.
     * @param friend A string represents the username of the friend account.
     * @return true iff the account exist, the friend exists and exist in the account's friend list,
     * and removes friend successfully, false if the either accounts does not exist or the friend account is not in
     * the friend list of the account.
     */
    removeFriend(username, friend){
        let account = this._findAccountByUsername(username);

        if (account == null || this._findAccountByUsername(friend) == null || !account.hasFriend(friend)) {
            return false;
        } else {
            account.removeFriend(friend);
            this._storeData();
            return true;
        }
    }

    /**
     * Gets the account's friend list.
     * @param username A string represents the username of the account.
     * @return list of strings representing the usernames of the account's friends if this account exists,
     * null if the account does not exist.
     */
    getFriendList(username){
        let account = this._findAccountByUsername(username);

        if (account == null) {
            return null;
        }
        return account.friends;
    }

    /**
     * Gets the message list with given username and given key
     * @param username A String representation of the username
     * @param key A String representation of message status
     * @return messages represented by IDs
     */
    getMessageList(username, key){
        let account = this._findAccountByUsername(username);

        if (account == null) {
            return null;
        }

        return account.getMessageList(key);
    }

    /**
     * Adds the message id to the message list with given username and given key
     * @param username A String representation of the username
     * @param key A String representation of the message status
     * @param messageId A String representation of the message id
     */
    updateMessageList(username, key, messageId){
        let account = this._findAccountByUsername(username);
        console.log(username);
        if (account == null) {
            return null;
        }

        account.updateMessageList(key, messageId);
        this._storeData();
    }

    /**
     * Removes the message id from a message list with given username and given key
     * @param username A String representation of the username
     * @param messageId A String representation of the message id
     */
    removeFromMessageList(username, messageId){
        let account = this._findAccountByUsername(username);

        if (account == null) {
            return null;
        }

        account.removeFromMessageList(messageId);
        this._storeData();
    }

    /**
     * Check if the message id is a valid id in the message list
     * @param username A String representation of the username
     * @param messageId A String representation of the message id
     * @param key A String representation of the message status
     * @return true iff the message id is a valid message id in the message list
     */
    isValidMessageId(username, messageId, key){
        let account = this._findAccountByUsername(username);

        if (account == null) {
            return false;
        }
        return account.getMessageList(key).includes(messageId);
    }

    /**
     * Gets the collection of events that are specialized regarding to the type of the account.
     * @param username A string represents the username of this account.
     * @return list of event id represents all the specialized events operating by this account.
     */
    getSpecialList(username){
        let account = this._findAccountByUsername(username);

        if (account == null) {
            return null;
        }
        return account.getSpecialList();
    }

    /**
     * Adds a specialized event into the collection of all specialized events operating by this account.
     * @param eventId A string represents the id of this event.
     * @param username A string represents the username of this account.
     */
    addToSpecialList(eventId, username){
        let account = this._findAccountByUsername(username);

        if (account == null) {
            return null;
        }

        account.addToSpecialList(eventId);
        this._storeData();
    }

    /** Removes an event from the list of events that the organizer organized.
     * @param eventId A string represents the unique ID of this event.
     * @param username the username of the target event
     */
    removeFromSpecialList(eventId, username){
        let account = this._findAccountByUsername(username);

        if (account != null) {
            let res = account.removeFromSpecialList(eventId);
            this._storeData();
            return res;
        }
    }

    /**
     * Sets a new password for an account.
     * @param newPassword A string represents the new password.
     * @param username A string represents the username of this account.
     */
    setPassword(newPassword, username){
        let account = this._findAccountByUsername(username);

        if (account != null) {
            account.password = newPassword;
            this._storeData();
        }
    }

    /**
     * Gets password of an account.
     * @param username A string represents the username of this account.
     */
    getPassword(username){
        let account = this._findAccountByUsername(username);

        if (account != null) {
            return account.password;
        }else return null;
    }

    /**
     * Finds all speakers that are free at the given time interval
     * @param eventDuration Time intervals where start time is at index 0 and end time is index 1
     * @return list of speaker IDs that corresponds to speakers that are free at this time interval
     */
    getAvailableSpeakers(eventDuration){
        let result = [];

        if (!this._allAccounts.hasOwnProperty('speaker')) {
            return [];
        }
        let speakers = Object.values(this._allAccounts['speaker']);

        if (speakers != null && speakers !== []){
            for (let i = 0; i < speakers.length; i++){
                if (speakers[i].isAvailable(eventDuration[0], eventDuration[1])){
                    result.push(speakers[i].username);
                }
            }
        }
        return result;
    }

    /**
     * Gets all account types
     * @return list of all possible account types represented by Strings
     */
    getAllTypes(){
        return Array.from(this._accountTypes);
    }

    /**
     * Checks if a given existing user is VIP
     * @param username The username of the target user
     * @return True iff the user is VIP
     */
    checkVIP(username){
        let account = this._findAccountByUsername(username);
        return account != null && account.isVIP();
    }

    /** Checks if the invitation code is correct for the given type
     * @param type of  accounts the target invitation code corresponds to
     * @param invitationCode that belongs to the given type
     * @return true iff the code is correct
     */
    checkInvitation(type, invitationCode){
        return this._invitationCode.hasOwnProperty(type) && this._invitationCode[type].includes(invitationCode);
    }

    /**
     * Gets a message that describes what kind of events are special to the account
     * @param username the target account's username
     * @return string that represents the message
     */
    getSpecialDescription(username){
        let account = this._findAccountByUsername(username);

        if (account != null) {
            return account.specialDescription();
        }else return null;
    }
}