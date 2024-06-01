const express = require('express')
const app = express()
const axios = require('axios')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const posts = {}
const handleEvents = (type,data)=>{
    if(type === 'post_created'){ 
        const {id,content} = data
        posts[id] = {id,content,comments:[]}
   }else  
   if(type === 'Comment_Created'){
        const {postId,id,comment,status} = data
        posts[postId].comments.push({id,comment,status})
   }else
   if(type === 'commentUpdated'){
    const {postId,id,comment,status} = data
    const comment_ =  posts[postId].comments.find((item)=>item.id ===  id)
    comment_.status = status
    comment_.comment = comment 
   }  
}


app.get('/posts',(req,res)=>{
    res.send(posts)
})
app.post('/event',(req,res)=>{
   const {type,data} =req.body
    handleEvents(type,data)
   res.send({})
})
app.listen(4002,async()=>{
    console.log('Query listening at port : 4002');
    const res = await axios.get('http://localhost:4005/event')
    for(let event of res.data)
        {
            console.log('Processing event :',event.type)
            handleEvents(event.type,event.data)
        }
}) 