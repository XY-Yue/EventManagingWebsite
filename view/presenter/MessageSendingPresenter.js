import MessageManager from "./model/message/MessageManager.js";
import AccountManager from "./model/account/AccountManager.js";
import {messageStatus} from "./MessageStatus.js";
import {formatToCheckbox} from "./FormatToCheckbox.js";

export default class {
    constructor() {
        this._messageManager = new MessageManager();
        this._accountManager = new AccountManager();
    }

    sendMessage(sender, receivers, receiverFriends, subject, content){
        let allReceivers = this._parseReceivers(receivers, receiverFriends);

        if (allReceivers.length === 0) {
            return "Receiver cannot be empty!";
        }

        if (subject === "") {
            return "Subject cannot be empty!";
        }

        let invalidReceivers = [];
        for (let i = 0; i < allReceivers.length; i++){
            if (!this._accountManager.checkUser(allReceivers[i])){
                invalidReceivers.push(allReceivers[i]);
            }
        }

        if (invalidReceivers.length !== 0){
            return "The receivers " + invalidReceivers.toString() + " does not exist!";
        }

        let newMessageID = this._messageManager.sendWordMessage(sender, allReceivers, subject, content);

        this._accountManager.updateMessageList(sender, messageStatus.sent, newMessageID);

        for (let i = 0; i < allReceivers.length; i++){
            this._accountManager.updateMessageList(allReceivers[i], messageStatus.received, newMessageID);
            console.log(11);
        }

        return "";
    }

    _parseReceivers(receivers, receiverFriends){
        let set = new Set();

        if (receivers !== ""){
            receivers = receivers.split(",");

            for (let i = 0; i < receivers.length; i++){
                set.add(receivers[i].toString());
            }
        }
        for (let i = 0; i < receiverFriends.length; i++){
            set.add(receiverFriends[i].toString());
        }

        return Array.from(set);
    }

    getAllFriends(username){
        let friends = this._accountManager.getFriendList(username);
        let output = "";

        for (let i = 0; i < friends.length; i++){
            output += formatToCheckbox(friends[i], "friend");
        }

        return output;
    }
}