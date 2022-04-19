const Seeker = require("../seeker");

class User {
    constructor(username, id, first_name) {
        this.username = username;
        this.id = id;
        this.first_name = first_name;
        this.seekers = [];

        console.log("New user added: " + this.toString())
    }

    newSeeker(url) {
        const existingSeekerId = this.seekers.findIndex(seeker => seeker.url === url);
        if(existingSeekerId === -1) {
            return null;
        }
        const seeker = new Seeker(url, this.id);
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