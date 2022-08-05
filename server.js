const User = require('./classes/User')
const Room = require('./classes/Room')

let users = [];
let rooms = [];



// Room Functions //
const removeUserFromRoom = (user) => {
    let room = findRoomByCode(user.room.code)

      console.log(users)
      console.log(room)

      // 3. kicking him from the users list
      users = removeUserFromList(user.userName, users)

      // 4. kicking him from the rooms list
      room.users = removeUserFromList(user.userName, room.users)
}

const addRoom = (room) => {
    if (checkIfRoomExist(room.code)) {
        room.code = room.getCode()
        return addRoom(room)
    }
    rooms.push(room)
    return room
}

const checkIfRoomExist = (roomCode) => {
    return rooms.forEach(existRoom => {if(existRoom?.code === roomCode) return existRoom.code})
}

const createRoom = (user) => {
    if (user.room) {
        console.log('the user already have a room')
    } else {
        let newRoom = new Room(user)
        user.room = {roomName: newRoom.roomName, code: newRoom.code}
        addRoom(newRoom)
    }
}

const findRoomByCode = (code) => {
    let room = null
    rooms.map((object) => object.code == code ? room = object.printData() : null)
    return room
}

const send_broadcast = (room, signal_type, data_to_send) => {
    room.users.map(user => io.to(user.socketId).emit(signal_type, data_to_send))

}

// Room Functions //












// User Functions //
const removeUserFromList = (username, list) => {
    return list.filter((user) => user.username !== username);
  };

const addUser = (username, isDJ = false, socket, avatarSeed) => {
    newUser = new User(username, isDJ, socket, avatarSeed)
    if (checkIfUserExist(username, users)) {
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

const findUserBySocket = (socketId, list) => {
    let user = null
    list.map(object => {
        if (object.socketId === socketId) {
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
    socket.on("openParty", (userData) => {
        const newUser = addUser(userData.username, true, socket.id, userData.avatarSeed)
        createRoom(newUser)
        socket.emit('userJoinedTheParty', newUser)
    })

    socket.on("joinParty", (request) => {
        userData = request.userData
        code = request.code

        

        let room = findRoomByCode(code)
        if (!room) {
            socket.emit("error", "There is no room with this code")
        } else {
            const newUser = addUser(userData.username, false, socket.id, userData.avatarSeed)
            socket.emit("joinPartyResponse", room)
            room.users.map(user => io.to(user.socketId).emit('userJoinedTheParty', newUser))
        }
    })

    socket.on('requestForUserData', (username) => {
        const user = findUserByName(username, users)
        socket.emit('getUserData', user.sendAllData())
    })

    socket.on('changeRoomName', (roomData) => {
        const room = findRoomByCode(roomData.code)
        room.roomName = roomData.title
        room.users.map(user => io.to(user.socketId).emit('newRoomData', {title: room.roomName, code: room.code}))
    })


    socket.on("startParty", (room_code) => {
        console.log("Party start at ", room_code)
        let room = findRoomByCode(room_code)
        room.active = true
        send_broadcast(room, "startParty", {})

    })

  
    //when disconnect
    socket.on("disconnect", () => {
      // 1. Find that user with his socketId
      console.log("the user " + socket.id + " has been disconnected")
      const user = findUserBySocket(socket.id, users)

      // 2. Remove the user from the room.
      if (user) {
        removeUserFromRoom(user)
      } 

      console.log(users)

      // 5. sending for all the users in the room which user has been disconnected
    });
  });