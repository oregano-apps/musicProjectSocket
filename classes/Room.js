class Room{
    constructor(dj, socketId) {
        this.roomName = "Oregano Music",
        this.code = this.getCode(),
        this.users = [{username: dj, socketId: socketId}]
        this.active = false
        
    }

    getCode = () => {
        let code = ''
        for(let i = 0; i < 8; i++) {
            let newNumber = Math.floor(Math.random() * 10)
            code += newNumber.toString()
        }
        return code
    }
    
    printData = () => {
        let roomData = {
            roomName: this.roomName,
            code: this.code,
            users: this.users,
            active: this.active
        }
        return roomData
    }
}

module.exports = Room