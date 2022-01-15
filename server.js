const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const cookieParser = require('cookie-parser');
const {
    joinRoom,
    userLeave,
    getRoomOfUser,
    createRoom,
    createUserId,
    lookForARoom,
    roomIsReady,
    getFirstRoomId,
    rooms
  } = require('./utils/users');
const e = require('cors');

const app = express();
app.use(cookieParser());
const server = http.createServer(app);
const io = socketio(server);

function rand(length, current) {
    current = current ? current : '';
    return length ? rand(--length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 60)) + current) : current;
}

app.get("/rr", (req, res) => {
  res.send(rooms);
});


app.get("/", (req, res) => {
  if(!req.cookies.userid){
    res.setHeader("Set-Cookie", "userid="+createUserId()+";");
    console.log("created new userId");
  }
res.sendFile(__dirname + '/public/index2.html')
});

function doStuff(req,socket,roomId) {
  if(roomId!=="404"){
    console.log("joined room of id "+roomId);
    socket.join(roomId);
    io.to(roomId).emit('events', 'connected');
}else{
  createRoom(req.cookies.userid,req.cookies.tags).then(a => {
    console.log("created room of id "+a);
    var b = false;
    var intervalId = setInterval(function(){
      if(roomIsReady(a)){
        clearInterval(intervalId);
        b = true;
        socket.join(a);
        io.to(a).emit('events', 'connected');
      }
    }, 500);

    setTimeout(function () {
      if(!b){
      clearInterval(intervalId);
      console.log("got first room id after waiting 5 secs");
      userLeave(a);

      let roomToJoin = getFirstRoomId();
        if(roomToJoin == '404'){
          socket.emit("events","noRoom");
        }else{
      joinRoom(req.cookies.userid,roomToJoin);
      socket.join(roomToJoin);
      io.to(roomToJoin).emit('events', 'connected');
      console.log("");
    }
  }
    }, 5500);
  });
}
}
app.get("/search", (req, res) => {
    
    if(!req.cookies.userid){
      res.redirect("/");
    }
    res.sendFile(__dirname + '/public/index.html');
    
    io.once('connection', socket => {
      lookForARoom(req.cookies.userid,req.cookies.tags).then(roomId => {
        
      doStuff(req,socket,roomId);
    roomId = getRoomOfUser(req.cookies.userid);
    //sending messages
    socket.on('chatMessage', a => {
      socket.broadcast.to(roomId).emit('message', a);
    })
    socket.on('events',e => {
      if(e=="disconnecting"){
        b = true;
        io.to(roomId).emit('events', 'disconnected');
        userLeave(roomId);
        socket.leave(roomId);
      }
      if(e=="reconecting"){
        lookForARoom(req.cookies.userid,req.cookies.tags).then(roomId => {
          doStuff(req,socket,roomId);
        }
        );
      }
    });
    socket.on('disconnect', () => {
      io.to(roomId).emit('events', 'disconnected');
      userLeave(roomId);
      socket.leave(roomId);
      socket.disconnect();
  });

      });
  });
  
  
});
  app.use(express.static(path.join(__dirname, 'public')));





server.listen(3000, () => console.log(`Server running on port 3000`));
