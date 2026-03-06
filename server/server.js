const express = require("express")
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io")

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server,{
cors:{ origin:"*" }
})

let rooms = {}

io.on("connection",(socket)=>{

console.log("User connected:",socket.id)

/* CREATE ROOM */

socket.on("create_room",({room,name},callback)=>{

console.log("Create room request:",room,name)

if(rooms[room]){
return callback({ok:false,message:"Room already exists"})
}

rooms[room] = 1

socket.join(room)
socket.data.room = room

io.to(room).emit("room_users",rooms[room])

callback({ok:true})

})

/* JOIN ROOM */

socket.on("join_room",({room,name},callback)=>{

console.log("Join room request:",room,name)

if(!rooms[room]){
return callback({ok:false,message:"Room does not exist"})
}

if(rooms[room] >= 2){
return callback({ok:false,message:"Room is full"})
}

rooms[room]++

socket.join(room)
socket.data.room = room

io.to(room).emit("room_users",rooms[room])

callback({ok:true})

})

/* SEND MESSAGE */

socket.on("send_message",(data)=>{

io.to(data.room).emit("receive_message",data)

})

/* TYPING INDICATOR */

socket.on("typing",(data)=>{

socket.to(data.room).emit("user_typing",data)

})

/* DISCONNECT */

socket.on("disconnect",()=>{

console.log("User disconnected:",socket.id)

const room = socket.data?.room

if(!room || !rooms[room]) return

rooms[room]--

if(rooms[room] <= 0){

delete rooms[room]

}else{

io.to(room).emit("room_users",rooms[room])

}

})

})

const PORT = process.env.PORT || 5000

server.listen(PORT,()=>{
console.log("Server running on port " + PORT)
})
