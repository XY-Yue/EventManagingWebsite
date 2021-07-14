import WordMessage from "./WordMessage.js";
import reviver from "../reviver.js";


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
     * The result should be in view of user with given username, so the output should contain all receivers
     * @param messageSent a list of message sent by a user
     * @param subjectKeyword A keyword in the subject of desired messages
     * @return list of toString of messages with IDs contained in the given list
     */
    getMessages(messageSent, subjectKeyword){
        let output = [];

        for (let i = 0; i < messageSent.length; i++){
            if (this._messageList.hasOwnProperty(messageSent[i]) && this._messageList[messageSent[i]] != null &&
            this._messageList[messageSent[i]].subject.includes(subjectKeyword)){
                output.push(JSON.parse(JSON.stringify(this._messageList[messageSent[i]]), reviver));
            }
        }
        return output;
    }

    /**
     * Gets the message sent to a specific user
     * @param receiverUsername A String representation of receiver username
     * @param messageSent a list of message ids sent by the current user
     * @param subjectKeyword A keyword in the subject of desired messages
     * @return list of String representation of the message sent to the given username
     */
    getSentMessageToSpecificAccount(receiverUsername, messageSent, subjectKeyword){
        let output = [];

        for (let i = 0; i < messageSent.length; i++){
            if (this._messageList.hasOwnProperty(messageSent[i]) && this._messageList[messageSent[i]] != null){
                if (this._messageList[messageSent[i]].receiver.includes(receiverUsername) &&
                    this._messageList[messageSent[i]].subject.includes(subjectKeyword)){
                    output.push(JSON.parse(JSON.stringify(this._messageList[messageSent[i]]), reviver));
                }
            }
        }
        return output;
    }

    /**
     * Gets the message received from a specific account
     * @param senderUsername A String representation of the sender username
     * @param messageReceived A list of message id received by current user
     * @param subjectKeyword A keyword in the subject of desired messages
     * @return list of received messages from the sender, without the receiver information
     */
    getReceivedMessagesFromSpecificAccount(senderUsername, messageReceived, subjectKeyword){
        let output = [];

        for (let i = 0; i < messageReceived.length; i++){
            if (this._messageList.hasOwnProperty(messageReceived[i]) && this._messageList[messageReceived[i]] != null &&
                this._messageList[messageReceived[i]].subject.includes(subjectKeyword)){
                if (this._messageList[messageReceived[i]].sender === senderUsername){
                    output.push(JSON.parse(JSON.stringify(this._messageList[messageReceived[i]]), reviver));
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

    getSingleMessage(messageID){
        return JSON.parse(JSON.stringify(this._messageList[messageID]), reviver);
    }
}
