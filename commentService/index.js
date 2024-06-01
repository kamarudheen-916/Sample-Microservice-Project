const  express = require('express')
const app = express()
const {randomBytes} = require('crypto')
const cors = require('cors')
const axios = require('axios')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const postComments = {}

app.get('/posts/:id/comment',(req,res)=>{
    // console.log('comment id:',req.params.id);
    res.send(postComments[req.params.id]||[])
})
app.post('/posts/:id/comment',async(req,res)=>{
    const commentId = randomBytes(4).toString('hex')
    const {comment}= req.body  
    console.log(req.body);
    const comments = postComments[req.params.id] || []
    comments.push({id:commentId,comment})
    postComments[req.params.id] =comments
    await axios.post('http://localhost:4005/event',{type:'Comment_Created',data:{postId:req.params.id,id:commentId,comment,status:'pending'}})
    res.status(200).send(comments)
})
  
app.post('/event',async(req,res)=>{ 
    console.log('i got an event in the comment service:',req.body.type);
    const {type,data} = req.body
    if(type === 'comment_moderated'){
        const {postId,id,comment,status} = data  
        console.log(data);
        const comments = postComments[data.postId] 
        const comment_ =  comments.find(item => item.id === id)
        comment_.status === status
        await axios.post('http://localhost:4005/event',{type:'commentUpdated',data:{postId,id,comment,status}})
    }
   res.send({})

  })   
app.listen(4001,()=>{  
    console.log('comments running on 4001');
})  