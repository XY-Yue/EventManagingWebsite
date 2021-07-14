import Message from './Message.js';

/**
 * An entity class for messaging feature.
 * A class extends abstract class Message.
 * Represents messages which have their subject and content in words. Hence this class is called WordMessage.
 * All the constructed messages are already sent by its sender.
 * For most of the attributes in this class there is no setter method because the sent message should not be changed.
 */
export default class extends Message{
    /**
     * Constructs a WorldMessage object
     * @param sender A String representation of the sender username
     * @param receiver A String representation of the receiver username
     * @param id A String representation of the message id
     * @param time Time of this message constructed
     * @param subject A String representation of the subject of this message
     * @param wordContent A String representation of the content of this message
     */
    constructor(sender, receiver, id, time, subject, wordContent) {
        super(sender, receiver, id, time);
        this._subject = subject;
        this._wordContent = wordContent;
    }

    get subject(){
        return this._subject;
    }
}