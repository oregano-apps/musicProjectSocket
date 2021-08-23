const User = require('./classes/User')
const Room = require('./classes/Room')

let users = [];
let rooms = [];



// Room Functions //

const addRoom = (room) => {
    if (checkIfRoomExist(room.code).length > 0) {
        room.code = room.getCode()
        return addRoom(room)
    }
    rooms.push(room)
    return room
}

const checkIfRoomExist = (roomCode) => {
    return rooms.map(existRoom => existRoom?.code === roomCode ? alreadyExist = true : alreadyExist = false)
}

const createRoom = (user) => {
    if (user.room) {
        console.log('the user already have a room')
    } else {
        let newRoom = new Room(user)
        user.room = newRoom.code
        addRoom(newRoom)
    }
}

const findRoomByCode = (code) => {
    let room = null
    rooms.map((object) => object.code == code ? room = object.printData() : null)
    return room
}

// Room Functions //












// User Functions //

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


// user Functions//








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
        console.log(data)
        const room = findRoomByCode(data.code)
        room.roomName = data.title
        console.log("users: " +  users + "rooms: " + rooms)
        room.users.map(user => io.to(user.socketId).emit('newRoomData'))
    })

  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
    });
  });