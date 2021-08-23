class User{
    constructor(username, isDJ, socketId) {
        this.username = username,
        this.room = null,
        this.isDJ = isDJ,
        this.socketId = socketId
    }

    sendAllData = () => {
        return {
            username: this.username,
            room: this.room,
            isDJ: this.isDJ
        }
    }
}

module.exports = User