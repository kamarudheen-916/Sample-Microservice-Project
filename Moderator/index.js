const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
 
app.post('/event',async(req,res)=>{
    const {type,data} = req.body 
    console.log('moderation test :',type);
    if(type==='Comment_Created'){
        if(data.comment.includes('orange')){ 
             data.status = 'rejected'
        }else {
            data.status = 'approved' 
        }
 await axios.post('http://localhost:4005/event',{type:'comment_moderated',data})

    }
    res.send({})
})   
app.listen(4003,()=>{
    console.log('Modereator listenig at 4003');
})