import React,{useState,useEffect} from "react"
import "./App.css"

import { socket } from "./socket"

import Landing from "./components/Landing"
import Chat from "./components/Chat"

function App(){

const [name,setName] = useState("")
const [room,setRoom] = useState("")
const [joined,setJoined] = useState(false)

const [message,setMessage] = useState("")
const [chat,setChat] = useState([])

const [typingUser,setTypingUser] = useState("")
const [onlineUsers,setOnlineUsers] = useState(1)

const createRoom = (userName)=>{

if(!userName.trim()){
alert("Enter your name")
return
}

const randomRoom = Math.random().toString(36).substring(2,8)

socket.emit("create_room",{room:randomRoom,name:userName},(res)=>{

if(!res.ok){
alert(res.message)
return
}

setName(userName)
setRoom(randomRoom)
setJoined(true)

})

}

const joinRoom = (userName,roomCode)=>{

if(!userName.trim()){
alert("Enter your name")
return
}

if(!roomCode.trim()){
alert("Enter room code")
return
}

socket.emit("join_room",{room:roomCode,name:userName},(res)=>{

if(!res.ok){
alert(res.message)
return
}

setName(userName)
setRoom(roomCode)
setJoined(true)

})

}

const sendMessage = ()=>{

if(message==="") return

const msgData = {

room:room,
author:name,
message:message,
time:new Date().toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
})

}

socket.emit("send_message",msgData)

/* IMPORTANT FIX */
setMessage("")

}

useEffect(()=>{

const receiveMessage = (data)=>{
setChat((list)=>[...list,data])
}

const typingListener = (data)=>{

setTypingUser(data.author+" is typing...")

setTimeout(()=>{
setTypingUser("")
},2000)

}

const userCount = (count)=>{
setOnlineUsers(count)
}

socket.on("receive_message",receiveMessage)
socket.on("user_typing",typingListener)
socket.on("room_users",userCount)

return ()=>{

socket.off("receive_message",receiveMessage)
socket.off("user_typing",typingListener)
socket.off("room_users",userCount)

}

},[])

return(

<div>

{!joined ?

<Landing
createRoom={createRoom}
joinRoom={joinRoom}
/>

:

<Chat
chat={chat}
name={name}
room={room}
onlineUsers={onlineUsers}
message={message}
setMessage={setMessage}
sendMessage={sendMessage}
typingUser={typingUser}
socket={socket}
/>

}

</div>

)

}

export default App