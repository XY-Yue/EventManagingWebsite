import WordMessage from "./WordMessage.js";
import reviver from "../reviver.js";

/**
 * format the output of the given message, return its information with all receivers included
 * @param message the target message
 * @return toString of message, with sender, receiver and time sent
 */
function formatMessageOutputWithReceivers(message) {
    let result = "";
    result += 'sender: ' + message.sender + ';\n';
    result += 'receiver: '
    let receiver;
    for (receiver in message.receiver) {
        result += receiver + '; ';
    }
    result += '\n';
    result += 'sent at: ' + message.time.toLocaleString() + ';\n';
    result += message.toString();
    return result;
}

/**
 * format the output of the given message, return its information without all receivers included
 * @param message the target message
 * @return toString of message, with sender and time sent
 */
function formatMessageOutputWithoutReceivers(message) {
    let result = "";
    result += 'sender: ' + message.sender + ';\n';

    result += 'sent at: ' + message.time.toLocaleString() + ';\n';
    result += message.toString();
    return result;
}

/**
 * An use case class of messaging feature.
 * Stores all sent messages in a Map, which has username of all users map to their sent messages.
 * Contains constructor of Message, this class should be used to construct new message.
 * Methods in this class contains all the operations to a message.
 * Input information is given by Message controller system.
 */
export default class{
    // Initialize related variables
    constructor() {
        // Format: {ID: Message Object, ...}
        this._messageList = this._readData();
        this._numMessage = localStorage.getItem("numMessages"); // record the total number of messages
        if (this._numMessage == null)
            this._numMessage = 0;
    }

    // This method writes the messageList to storage as a JSON string
    // Every time something is updated, this method should be called
    _storeData(){
        localStorage.setItem("allMessages", JSON.stringify(this._messageList));
        localStorage.setItem("numMessages", this._numMessage);
    }

    // This method reads the message information from local storage and parse them to message objects with methods
    _readData(){
        let messageList = localStorage.getItem("allMessages");

        if (messageList == null) return {};
        else {
            messageList = JSON.parse(messageList, reviver);

            for (const [ID, message] of Object.entries(messageList)){
                messageList[ID] = new WordMessage(message._sender, message._receiver,
                    message._id, message._time, message._subject,
                    message._wordContent);
            }
            return messageList;
        }
    }

    /**
     * Returns the all the messages sent by the user with given IDs.
     * Get a list of messages by getting the list of messages the given IDs corresponds to in messageList.
     * The result should be in view of user with given username, so the toString should contain all receivers
     * @param messageSent a list of message sent by a user
     * @return list of toString of messages with IDs contained in the given list
     */
    getSentMessages(messageSent){
        let output = [];

        for (let id in messageSent){
            if (this._messageList.hasOwnProperty(id) && this._messageList[id] != null){
                output.push(formatMessageOutputWithReceivers(
                    JSON.parse(JSON.stringify(this._messageList[id]), reviver)));
            }
        }
        return output;
    }

    /**
     * Gets the message sent to a specific user
     * @param receiverUsername A String representation of receiver username
     * @param messageSent a list of message ids sent by the current user
     * @return list of String representation of the message sent to the given username
     */
    getSentMessageToSpecificAccount(receiverUsername, messageSent){
        let output = [];
        let id;

        for (id in messageSent){
            if (this._messageList.hasOwnProperty(id) && this._messageList[id] != null){
                if (this._messageList[id].receiver.includes(receiverUsername)){
                    output.push(formatMessageOutputWithReceivers(
                        JSON.parse(JSON.stringify(this._messageList[id]), reviver)));
                }
            }
        }
        return output;
    }

    /**
     * Gets the message received from a specific account
     * @param senderUsername A String representation of the sender username
     * @param messageReceived A list of message id received by current user
     * @return list of received messages from the sender, without the receiver information
     */
    getReceivedMessagesFromSpecificAccount(senderUsername, messageReceived){
        let output = [];
        let id;

        for (id in messageReceived){
            if (this._messageList.hasOwnProperty(id) && this._messageList[id] != null){
                if (this._messageList[id].sender === senderUsername){
                    output.push(formatMessageOutputWithoutReceivers(
                        JSON.parse(JSON.stringify(this._messageList[id]), reviver)));
                }
            }
        }
        return output;
    }

    /**
     * Gets the message received from a user, based on the provided list
     * @param messageReceived A list of message id received by current user
     * @return list of received messages from all other accounts
     */
    getReceivedMessages(messageReceived){
        let output = [];
        let id;

        for (id in messageReceived){
            if (this._messageList.hasOwnProperty(id) && this._messageList[id] != null){
                output.push(formatMessageOutputWithoutReceivers(
                    JSON.parse(JSON.stringify(this._messageList[id]), reviver)));
            }
        }
        return output;
    }

    /**
     * Gets the archived message of current account
     * @param messageArchived A list of message id archived
     * @return list of archived messages
     */
    getArchivedMessages(messageArchived){
        let output = [];
        let id;

        for (id in messageArchived){
            let status = id.charAt(0);
            id = id.substring(1);
            if (this._messageList.hasOwnProperty(id) && this._messageList[id] != null){
                if (status === '0'){ // 0 means the message was received by this user before being archived
                    output.push(formatMessageOutputWithoutReceivers(
                        JSON.parse(JSON.stringify(this._messageList[id]), reviver)));
                }else if (status === '1'){ // 1 means this message was sent by this user before being archived
                    output.push(formatMessageOutputWithReceivers(
                        JSON.parse(JSON.stringify(this._messageList[id]), reviver)));
                }
            }
        }
        return output;
    }

    /**
     * Build the message object and record it in the list
     * @param senderUsername A String representation of sender username
     * @param receivers A List of String representation of receiver username
     * @param subject Subject of this message
     * @param content Content of this message
     * @return ID of the new message
     */
    sendWordMessage(senderUsername, receivers, subject, content){
        let id = 'M' + this._numMessage;
        this._messageList[id] = new WordMessage(senderUsername, Array.from(receivers), id,
            new Date(), subject, content);
        this._numMessage++;

        this._storeData();

        return id;
    }
}
