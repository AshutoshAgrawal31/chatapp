const socket=io()

//Elements

const $msgform = document.querySelector('#msgform')
const $msgformInput=$msgform.querySelector('input')
const $msgformButton=$msgform.querySelector('button')
const $location=document.querySelector('#location')
const $msg=document.querySelector('#msg')


//Template
const msgtemplate=document.querySelector('#msg-template').innerHTML
const locationtemplate=document.querySelector('#location-template').innerHTML
const sidebartemplate=document.querySelector('#sidebar-template').innerHTML

//Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix: true})

const autoscroll=()=>{
    //new message
    const $newmsg=$msgformInput.lastElementChild

    //height of new msg
    const style=getComputedStyle($newmsg)
    const margin=parseInt(style.marginBottom)
    const height=$newmsg.offsetHeight+margin

    //visible height
    const vheight=$msg.offsetHeight

    //Height of message container
    const cheight=$msg.scrollHeight

    //How far have i scrolled
    const sheight=$msg.scrollTop+vheight

    if(cheight-height <=sheight){
        $msg.scrollTop=$msg.scrollHeight
    }

}

socket.on('welcome',(msg)=>{
    console.log(msg);

    const html= Mustache.render(msgtemplate,{
        User:msg.username,
        msg:msg.text,
        time:moment(msg.createdAt).format('h:mm a')
    })
    $msg.insertAdjacentHTML('beforeend',html)
    autoscroll()

})

socket.on('locationmessage',(msg)=>{
    // console.log(msg);

    const html=Mustache.render(locationtemplate,{
        User:msg.username,
        loc:msg.text,
        time:moment(msg.createdAt).format('h:mm a')
    })

    $msg.insertAdjacentHTML('beforeend',html)
    autoscroll()

})

socket.on('roomdata',({room, users})=>{
    const html=Mustache.render(sidebartemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})

$msgform.addEventListener('submit',(e)=>{
    e.preventDefault()

    //disable
    $msgformButton.setAttribute('disabled','disabled')


    message=e.target.elements.msg.value
    socket.emit('submitted',message,(error)=>{
        //enable
        $msgformButton.removeAttribute('disabled')
        $msgformInput.value=''
        $msgformInput.focus()
        
        
        if(error){
            return console.log(error);
        }
        console.log('the message was delivered');
    })
})

$location.addEventListener('click',()=>{
    //Disable
    $location.setAttribute('disabled','disabled')


    if(!navigator.geolocation){
        return alert('Geolocation is not supported')
    }

    navigator.geolocation.getCurrentPosition((pos)=>{
        socket.emit('location',{
            latitude:pos.coords.latitude,
            longitude:pos.coords.longitude
        },()=>{
            //Enable
            $location.removeAttribute('disabled')

            console.log('location shared')
        })
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})

// socket.on('countUpdated',(count)=>{
//     console.log('count is updated',count);
// })

// document.querySelector('#inc').addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('inc')
// })