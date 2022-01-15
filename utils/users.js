const users = [];
const rooms = [];

// Join user to chat
function joinRoom(userId, roomId) {
  for (let i = 0; i < rooms.length; i++) {
    if(rooms[i][0]==roomId){
      if(rooms[i][1][0]!== userId && rooms[i][1][1]!== userId){
      rooms[i][1].push(userId);
    }
      break;
    }; 
  }
}
function rand(length, current) {
    current = current ? current : '';
    return length ? rand(--length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 60)) + current) : current;
}

// User leaves chat
function userLeave(roomId) {
  for (let i = 0; i < rooms.length; i++) {
    if(rooms[i][0]==roomId){
      rooms.splice(i,1);
      break;
    }; 
  }
}
function userExist(userId){
  for (let i = 0; i < users.length; i++) {
    if(users[i]==userId){
      return true;
    }; 
  }
  return false;
}

function roomExist(roomId){
  for (let i = 0; i < rooms.length; i++) {
    if(rooms[i][0]==roomId){
      return true;
    }; 
  }
  return false;
}

function createUserId(){
    var uID = rand(8);
    if(userExist(uID)){
      return createUserId();
    }
    users.push(uID);
    return uID;
  }

function lookForARoom(userId,tags){
  return new Promise((resolve, reject) => {
    var b = false;
    let tags2 = tags.split(',');
    for (let i = 0; i < rooms.length; i++) {
      let roomTags = rooms[i][2].split('%2C');
      for (let j = 0; j < tags2.length; j++) {
        for (let k = 0; k < roomTags.length; k++) {
          if(tags2[j]==roomTags[k]){
            if(!rooms[i][1][1]){
            joinRoom(userId,rooms[i][0]);
            b = true;
            resolve(rooms[i][0]);
          }
          }
        }
      }
    }
    if(!b){
        resolve("404");
  }
  });
}

function createRoom(userId,tags) {
  return new Promise((resolve, reject) => {
    let roomId;
    do{
      roomId = rand(10);
  }while(roomExist(roomId))
    const room = [roomId,[userId],tags];
    rooms.push(room);
    resolve(roomId);

  });
}

function getFirstRoomId() {
  for (let i = 0; i < rooms.length; i++) {
      if(rooms[i][1][1]){
        continue;
      }else{
      return rooms[i][0];
      }
  }
  return '404';
}
function roomIsReady(roomId) {
  for (let i = 0; i < rooms.length; i++) {
    if(rooms[i][0]==roomId){
      if(rooms[i][1][1]){
        return true;
      }
      return false;
    }; 
  }
} 
// Get room users
function getRoomOfUser(userId) {
  for (let i = 0; i < rooms.length; i++) {
    if(rooms[i][1][1]==userId | rooms[i][1][0]==userId){
      return rooms[i][0];
    }
  }
}

module.exports = {
  joinRoom,
  userLeave,
  getRoomOfUser,
  createRoom,
  createUserId,
  lookForARoom,
  roomIsReady,
  getFirstRoomId,
  rooms
};