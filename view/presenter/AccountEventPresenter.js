import AccountManager from "./model/account/AccountManager.js";
import EventManager from "./model/event/EventManager.js";
import {_formatEventsIntoHTML} from "./EventParserToHTML.js";

export default class {
    constructor(username) {
        this._accountManager = new AccountManager();
        this._eventManager = new EventManager();
        this._username = username;
    }

    getFullSchedule(){
        let schedule = this._accountManager.viewSignedUpEvents(this._username);
        this._numCurrent = 1;
        this._numExpired = 1;

        let current = Object.keys(schedule[0]);
        let expired = Object.keys(schedule[1]);

        for (let i = 0; i < current.length; i++){
            current[i] = this._eventManager.getEvent(current[i]);
        }
        for (let i = 0; i < expired.length; i++){
            expired[i] = this._eventManager.getEvent(expired[i]);
        }
        this._schedule = [current, expired];
    }

    getMoreCurrent(){
        this._numExpired = 1;
        let output = _formatEventsIntoHTML(this._schedule[0].slice(this._numCurrent - 1, this._numCurrent + 9));
        this._numCurrent += 10;

        return output;
    }

    getMoreExpired(){
        this._numCurrent = 1;
        let output = _formatEventsIntoHTML(this._schedule[1].slice(this._numExpired - 1, this._numExpired + 9));
        this._numExpired += 10;

        return output;
    }
}