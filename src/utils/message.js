const genmsg=(username,text)=>{
    return{
        username,
        text,
        createdAt:new Date().getTime()
    }
}

const genloc=(username,text)=>{
    return{
        username,
        text,
        createdAt:new Date().getTime()
    }
}

module.exports={
    genmsg,
    genloc
}