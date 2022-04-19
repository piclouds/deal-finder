const User = require('./models/user');

class UserServices {

    static INSTANCE = null;

    constructor() {
        this.users = [];
    }

    newUser(username, id, first_name) {
        const searchIndex = this.findUserIndex(id)
        if(searchIndex === -1) {
            console.log("Adding user:\tUser @" + username + " already exists.");
            return this.users[searchIndex]
        }
        return this.users[this.users.push(new User(username, id, first_name)) - 1];
    }

    findUserIndex(id) {
        this.users.findIndex(user => { user.id === id })
    }

    getUserById(id) {
        const searchIndex = this.findUserIndex(id);
        if(searchIndex === -1) {
            console.log("User search failed. ID: " + id);
            return null;
        }
        return this.users[searchIndex];
    }

    static getUserServices() {
        if(UserServices.INSTANCE == null) {
            UserServices.INSTANCE = new UserServices();
        }

        return UserServices.INSTANCE;
    }
}

module.exports = UserServices.getUserServices;