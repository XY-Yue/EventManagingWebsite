import AccountManager from "./model/account/AccountManager.js";

/**
 * Handles events from views that only relates to accounts
 */
export default class{
    constructor() {
        this._accountManager = new AccountManager();
    }
    /**
     * Validates the password of the account given by the username
     * @param username username of the target account
     * @param password provided by user as the target password to be validated
     * @return string representing type of this account, or null if password incorrect
     */
    checkPassword(username, password){
        return this._accountManager.checkPassword(username, password);
    }

    /**
     * Checks if the given username exists as an account
     * @param username of the target account to be checked
     * @return boolean to indicate existence of the username
     */
    checkUsername(username){
        return this._accountManager.checkUser(username);
    }

    /**
     * Checks if the given username exists as an account
     * @param type of the target accounts
     * @param invitationCode corresponds to the target type
     * @return boolean to indicate correctness of the invitation code
     */
    checkInvitation(type, invitationCode){
        return this._accountManager.checkInvitation(type, invitationCode);
    }

    /**
     * Creates a new account with the given information, assume all information are valid
     * @param type of the account to be created
     * @param username of the new account
     * @param password of the new account
     */
    createAccount(type, username, password){
        this._accountManager.addAccount(type, username, password);
    }

    /**
     * Finds all existing types of accounts
     * @return string of type names formatted as <option> elements in HTML containing the type names
     */
    accountTypes(){
        let types = this._accountManager.getAllTypes();
        let output = "";

        for (let i = 0; i < types.length; i++){
            output += "<option value='" + types[i] + "'>" + types[i] + "</option>";
        }
        return output;
    }
}