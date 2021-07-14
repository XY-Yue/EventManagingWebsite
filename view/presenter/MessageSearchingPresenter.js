import MessageManager from "./model/message/MessageManager.js";
import AccountManager from "./model/account/AccountManager.js";
import {messageStatus} from "./MessageStatus.js";

export default class {
    constructor(username) {
        this._username = username;

        this._messageManager = new MessageManager();
        this._accountManager = new AccountManager();
    }

    /**
     * Searches the messages with the given input
     * @param status the status of the messages, should be one of the elements in MessageStatus object
     * @param keywordUsername a full username of some user that should be included in sender or receiver of message
     * @param keywordSubject keyword in the subject of desired messages
     * @return string representing the first 10 results from the search formatted so that they can be directly inserted
     * into an HTML <dl> element
     */
    searchMessage(status, keywordUsername, keywordSubject){
        let messageIDs = this._accountManager.getMessageList(this._username, status);
        let output = "";
        this._messages = [];
        this._curCount = 0;
        this._needReceivers = false;


        if (keywordUsername === ""){
            this._messages = this._messageManager.getMessages(messageIDs, keywordSubject);
        }else {
            if (status === messageStatus.sent){
                this._messages = this._messageManager.getSentMessageToSpecificAccount(keywordUsername,
                    messageIDs, keywordSubject);
                this._needReceivers = true;
            }else if (status === messageStatus.received){
                this._messages = this._messageManager.getReceivedMessagesFromSpecificAccount(keywordUsername,
                    messageIDs, keywordSubject);
                this._needReceivers = false;
            }
        }

        return this.getMoreMessages();
    }

    /**
     * Loads more message content formatted correctly as inner HTML of <dl> elements
     * @return string containing contents of messages that can be inserted into <dl> elements
     */
    getMoreMessages(){
        let output = "";
        for (let i = this._curCount; i < Math.min(this._messages.length, this._curCount + 10); i++){
            if (this._needReceivers){
                output += formatMessageToHTMLWithReceivers(this._messages[i]);
            }else {
                output += formatMessageToHTMLWithoutReceivers(this._messages[i]);
            }
        }
        this._curCount += 10;
        return output;
    }
}

/**
 * format the output of the given message, return its information with all receivers included
 * @param message the target message object
 * @return toString of message, with sender, receiver and time sent
 */
function formatMessageToHTMLWithReceivers(message) {
    let result = "<dt id='" + message._id + "'>" + message._subject + "</dt>";
    result += "<dd>" + 'sender: ' + message._sender + ';' + "</dd>";
    result += "<dd>" + 'receiver: ';

    for (let i = 0; i < message._receiver.length; i++) {
        result += message._receiver[i] + '; ';
    }
    result += "</dd>";
    result += "<dd>" + 'sent at: ' + message._time.toLocaleString() + ';' + "</dd><br>";
    return result;
}

/**
 * format the output of the given message, return its information without all receivers included
 * @param message the target message object
 * @return toString of message, with sender and time sent
 */
function formatMessageToHTMLWithoutReceivers(message) {
    let result = "<dt id='" + message._id + "'>" + message._subject + "</dt>";
    result += "<dd>" + 'sender: ' + message._sender + ';' + "</dd>";

    result += "<dd>" + 'sent at: ' + message._time.toLocaleString() + ';' + "</dd><br>";
    return result;
}