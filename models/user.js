const Seeker = require("../seeker");

class User {
    constructor(username, id, name) {
        this.username = username;
        this.id = id;
        this.name = name;
        this.seekers = [];

        console.log("New user added: " + this.toString())
    }

    newSeeker(url) {
        const seeker = new Seeker(url);
        this.seekers.push(seeker);
        return seeker;
    }

    clear() {
        for(let i = 0; i < this.seekers.length; i++) {
            clearInterval(this.seekers.pop().scheduleRef)
        }
    }

    toString() {
        return `@${this.username}:${this.id}`;
    }
}

module.exports = User;