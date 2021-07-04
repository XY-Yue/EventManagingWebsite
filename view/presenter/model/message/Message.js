/**
 * This class is an entity class of messaging feature.
 * This is an abstract class of methods, all different kinds of message class will extend this class.
 * All the constructed messages are already sent by its sender.
 * For most of the attributes in this class there is no setter method because the sent message should not be changed.
 */
export default class{
    /**
     * Constructs a Message object
     * @param sender A String representation of sender username
     * @param receiver A String representation of receiver username
     * @param id A String representation of message id
     * @param time Time of this message constructed
     */
    constructor(sender, receiver, id, time) {
        this._sender = sender;
        this._receiver = Array.from(receiver);
        this._id = id;
        this._time = time;
    }

    /**
     * Gets sender's username of this message.
     * @return sender 's username of the message
     */
    get sender() {
        return this._sender;
    }

    /**
     * Gets the message constructed time
     * @return Time of this message constructed
     */
    get time() {
        return this._time;
    }

    /**
     * Gets receivers' usernames of this message.
     * @return receiver usernames
     */
    get receiver() {
        return Array.from(this._receiver);
    }

    /**
     * Gets the id of this message
     * @return Id of this message
     */
    getId() {
        return this._id;
    }
}