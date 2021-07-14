import {isAvailable} from '../Available.js';

/** An abstract class represents all type of accounts.
 * An account can store this user account's username, password, friends list, associated events，and whether
 * this user account can do messaging operations.
 */
export default class {
    /**
     * Creates an account with the specified username and password.
     * @param name The username of this account.
     * @param password The password to log in this account.
     * @param type records the type of this account
     */
    constructor(name, password, type) {
        this._name = name;
        this._password = password;
        this._friends = [];
        this._schedule = {}; // will be the same format as the one in Room
        this._message = {}; // will be in format {messageStatus: [all messageID with this status], ...}
        this._type = type; // This helps decode JSON data into a correct account type
    }

    /** Gets a string represents the type of this account.
     * @return type which records the type of this account.
     */
    get type() {
        return this._type;
    }

    /**
     * Gets the password of this account.
     * @return password of this account
     */
    get password(){
        return this._password;
    }

    get username(){
        return this._name;
    }

    /**
     * Sets the password of this account.
     * @param password A String containing the new password for this account.
     */
    set password(password){
        this._password = password;
    }

    /**
     * Checks if the account is free at this time interval.
     * @param startTime Represents the start time of the time interval
     * @param endTime Represents the end time of the time interval
     * @return true iff the account is available at the given time interval, false if this account cannot.
     */
    isAvailable(startTime, endTime){
        return isAvailable(this._schedule, startTime, endTime);
    }

    /**
     * Adds an event with given duration into the collection of all signed events of this account.
     * @param startTime Represents the start time of the event
     * @param endTime Represents the end time of the event
     * @param id A String representing the id of the new event.
     * @param name name of the event
     */
    addEvent(startTime, endTime, id, name){
        // Assume everything is valid and checked before this call and the id is not already in schedule
        this._schedule[id] = [startTime, endTime, name];
    }

    /**
     * Cancels the given event at the given time interval.
     * @param startTime Represents the start time of the event
     * @param endTime Represents the end time of the event
     * @param id A String representing the id of event want to be canceled.
     */
    removeEvent(startTime, endTime, id){
        if (this._schedule.hasOwnProperty(id) && this._schedule[id] != null){
            if (this._schedule[id][0].getTime() === startTime &&
                this._schedule[id][1].getTime() === endTime){
                delete this._schedule[id];
            }
        }
    }

    /**
     * Gets all the signed up events of this account.
     * @return array of [current events, expired events], each is a map {eventID : [start time, end time, event name]}
     * representing all events this user registered
     */
    get schedule(){
        let current = {}, expired = {};
        let output = [current, expired];
        for (const [key, value] of Object.entries(this._schedule)){
            if (value[0].getTime() > new Date().getTime()){
                current[key] = Array.from(value);
            }else {
                expired[key] = Array.from(value);
            }
        }
        return output;
    }

    /**
     * Gets all the friends of this account.
     * @return friends which is a List of usernames representing all the friends of this account.
     */
    get friends(){
        return Array.from(this._friends);
    }

    /**
     * Checks if this account has a friend with username given
     * @param username A String representing the username of the friend account going to be checked.
     * @return true iff this account has a friend of the given username, false otherwise.
     */
    hasFriend(username) {
        for (let i = 0; i < this._friends.length; i++){
            if (this._friends[i].toString() === username.toString()){
                return true;
            }
        }
        return false;
    }

    /**
     * Adds this account has a friend with username given
     * @param username A String representing the username of the friend account going to be added.
     */
    addFriend(username) {
        this._friends.push(username);
    }

    /**
     * Removes the given friend from this account's friend list
     * @param username A String representing the username of the friend account going to be removed.
     */
    removeFriend(username) {
        for (let i = 0; i < this._friends.length; i++){
            if (this._friends[i] === username) {
                this._friends.splice(i, 1);
            }
        }
    }

    /**
     * Gets the message list with a given key
     * @param key A String representation of the message status
     * @return list of message ids with given key
     */
    getMessageList(key){
        if (this._message.hasOwnProperty(key) && this._message[key] != null){
            return Array.from(this._message[key]);
        }
        return [];
    }

    /**
     * Adds a message into a message list with a given key
     * @param key A String representation of the message status
     * @param messageId A String representation of the message id
     */
    updateMessageList(key, messageId){
        if (this._message.hasOwnProperty(key) && this._message[key] != null){
            this._message[key].push(messageId);
        }else {
            this._message[key] = [messageId];
        }
    }

    /**
     * Removes all occurrence of a message from a message list
     * @param messageId A String representation of the message id
     */
    removeFromMessageList(messageId){
        for (let [key, value] of Object.entries(this._message)){
            for (let i = 0; i < value.length; i++){
                console.log()
                if (value[i] === messageId) {
                    value.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * Add a new list of messages of a new status
     * @param key The String representation of the message status
     * @param lst The iterator of message id list
     */
    setMessageList(key, lst){
        if (this._message.hasOwnProperty(key) && this._message[key] != null){
            this._message[key].concat(lst);
        }else {
            this._message[key] = Array.from(lst);
        }
    }

    /**
     * Gets the number of up coming events of this account
     * @return number of up coming events
     */
    numberOfEvents(){
        let upComing = 0;
        let expired = 0;
        for (const [key, value] of Object.entries(this._schedule)){
            if (value[0] > new Date().getTime()){
                upComing++;
            }else {
                expired++;
            }
        }
        return [upComing, expired];
    }
}