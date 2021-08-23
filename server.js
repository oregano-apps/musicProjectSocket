const User = require('./classes/User')
const Room = require('./classes/Room')

let users = [];
let rooms = [];

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

const addUser = (username, isDJ, socket) => {
    newUser = new User(username, isDJ, socket)
    if (checkIfUserExist(username, users)) {
        console.log('user exists already')
        return newUser
    }
    users.push(newUser)
    return newUser
}

const addRoom = (room) => {
    let alreadyExist = false
    rooms.map(existRoom => existRoom?.code === room.code ? alreadyExist = true : alreadyExist = false)
    if (alreadyExist) {
        room.code = room.getCode()
        return addRoom(room)
    }
    rooms.push(room)
    return room
}

const createRoom = (user) => {
    if (user.room) {
        console.log('the user already have a room')
    } else {
        let newRoom = new Room(user.username, user.socketId)
        user.room = newRoom.printData()
        addRoom(newRoom)
    }
}

const checkIfUserExist = (username, list) => {
    let exits = false
    list.map(object => {
        object.username === username ? exits = true : null
    })
    return exits
}

const findUserByName = (username, list) => {
    let user = null
    list.map(object => {
        if (object.username === username) {
            user = object
        }
    })
    return user
}

const findRoomByCode = (code) => {
    let room = null
    rooms.map((object) => object.code == code ? room = object.printData() : null)
    return room
}

const io = require("socket.io")(8900, {
    cors: {
      origin: "http://localhost:3000",
    },
  });


  
  
  io.on("connection",  (socket) => {
    //when ceonnect
    console.log(socket.id);
    socket.on("openParty", (username) => {
        const newUser = addUser(username, true, socket.id)
        createRoom(newUser)
    })

    socket.on('requestForUserData', (username) => {
        const user = findUserByName(username, users)
        socket.emit('getUserData', user.sendAllData())
    })

    socket.on('changeRoomName', (data) => {
        const room = findRoomByCode(data.code)
        room.roomName = data.title
        room.users.map(user => io.to(user.socketId).emit('newRoomData'))
    })

  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
    });
  });