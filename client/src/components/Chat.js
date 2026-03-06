import React,{useRef,useEffect} from "react"

function Chat({
chat,
name,
room,
onlineUsers,
message,
setMessage,
sendMessage,
typingUser,
socket
}){

const chatEndRef = useRef(null)

useEffect(()=>{

chatEndRef.current?.scrollIntoView({
behavior:"smooth"
})

},[chat])

return(

<div className="container">

<div className="title">
Room {room}
</div>

<div className="status">
{onlineUsers} user online
</div>

<div className="chatBox">

{chat.map((msg,index)=>{

if(msg.type==="system"){
return(
<div key={index} className="system">
{msg.message}
</div>
)
}

const me = msg.author === name

return(

<div
key={index}
className={`message ${me ? "me":"other"}`}
>

<div className="author">
{msg.author}
</div>

<div>
{msg.message}
</div>

<div className="time">
{msg.time}
</div>

</div>

)

})}

<div ref={chatEndRef}></div>

</div>

<div className="typing">
{typingUser}
</div>

<div className="messageInput">

<input
value={message}
placeholder="Type message..."
onChange={(e)=>{

setMessage(e.target.value)

socket.emit("typing",{
room:room,
author:name
})

}}
onKeyDown={(e)=>{

if(e.key==="Enter") sendMessage()

}}
/>

<button onClick={sendMessage}>
Send
</button>

</div>

</div>

)

}

export default Chat