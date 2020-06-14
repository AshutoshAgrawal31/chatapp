const path=require('path')
const http=require('http')
const express = require('express')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {genmsg, 
    genloc} = require('./utils/message')
const { adduser,
     removeuser,
     getuser,
     getusers}=require('./utils/users')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const pub=path.join(__dirname,'../public')

app.use(express.static(pub))


io.on('connection',(socket)=>{
    console.log('new webserver')

    socket.on('join',({username , room},cb)=>{
        const {error , user}=adduser({id:socket.id,username,room})

        if(error){
            return cb(error)
        }

        socket.join(user.room)

        socket.emit('welcome',genmsg('Admin','Welcome to the server'))
        socket.broadcast.to(user.room).emit('welcome',genmsg(user.username,`${user.username} has joined.`))

        io.to(user.room).emit('roomdata',{
            room:user.room,
            users:getusers(user.room)
        })

        cb()
    })

    socket.on('submitted',(msg,cb)=>{
        const user=getuser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(msg)){
            return cb('Profanity is not allowed')
        }
        io.to(user.room).emit('welcome',genmsg(user.username,msg))
        cb()
    })
    // socket.emit('countUpdated',count)

    // socket.on('inc',()=>{
    //     count++
    //     io.emit('countUpdated',count)
    // })
    socket.on('location',(msg,cb)=>{
        const user=getuser(socket.id)
        io.to(user.room).emit('locationmessage',genloc(user.username,`https://google.com/maps?q=${msg.latitude},${msg.longitude}`))
        cb()
    })
    socket.on('disconnect',()=>{
        const user=removeuser(socket.id)

        if(user){
            io.to(user.room).emit('welcome',genmsg(user.username,`${user.username} has left`))
            
            io.to(user.room).emit('roomdata',{
                room:user.room,
                users:getusers(user.room)
            })
        }
    })
})


const port=process.env.PORT
server.listen(port,()=>{
    console.log('Server is up on '+port)
})
