 const express = require('express')
 const app = express()
 const port = 4000
 const cors = require('cors')
 const axios =  require('axios')
 const {randomBytes} = require('crypto')
 app.use(cors())
 app.use(express.json())
 app.use(express.urlencoded({extended:true}))
 const posts = {}
 app.get('/posts',(req,res)=>{
    res.send(posts)
 })
 app.post('/posts',async (req,res)=>{
    const id = randomBytes(4).toString('hex') 
    const {content} = req.body
    posts[id] = {id,content}
   try {
      
   await axios.post('http://localhost:4005/event',{type:'post_created',data:{id,content}})
   res.json(posts) 
   } catch (error) { 
      console.log(error);  
   } 
 })

 app.post('/event',(req,res)=>{ 
   console.log('i got an event : ',req.body.type);
   res.send({}) 
 })
 app.listen(port,()=>{ 
    console.log('post service listening at 4000');
 })  