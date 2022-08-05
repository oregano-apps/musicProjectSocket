class User{
    constructor(username, isDJ, socketId, avatarSeed) {
        this.username = username,
        this.room = null,
        this.isDJ = isDJ,
        this.socketId = socketId
        this.avatarSeed = avatarSeed
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