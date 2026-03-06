import React,{useState} from "react"

function Landing({createRoom,joinRoom}){

const [name,setName] = useState("")
const [room,setRoom] = useState("")

return(

<div className="container">

<div className="title">
OurRoom
</div>

<div className="subtitle">
Private chat room
</div>

<input
placeholder="Your Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Room Code"
value={room}
onChange={(e)=>setRoom(e.target.value)}
/>

<div className="buttons">

<button onClick={()=>joinRoom(name,room)}>
Join Room
</button>

<button onClick={()=>createRoom(name)}>
Create Room
</button>

</div>

</div>

)

}

export default Landing