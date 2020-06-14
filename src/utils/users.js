const users=[]

//add user
const adduser=({id,username,room})=>{
    //Clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()


    //Validate the data
    if(!username || !room){
        return {
            error:'Username and room are required'
        }
    }

    //Check for existing user
    const exist=users.find((user)=>{
        return user.room === room && user.username === username
    })

    //Validate user namne
    if(exist){
        return{
            error:'Username is taken'
        }
    }

    //store user
    const user={id,username,room}
    users.push(user)
    return {user}
}





//remove user
const removeuser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id === id
    })
    if(index!==-1)
    {
        return users.splice(index,1)[0]
    }
}




//get user
const getuser=(id)=>{
    const user=users.find((user)=>{
        return user.id === id
    })
    return user
}





//get users in room
const getusers=(room)=>{
    const user=users.filter((user)=>{
        return user.room===room
    })
    return user
}

module.exports={
    adduser,
    removeuser,
    getuser,
    getusers
}