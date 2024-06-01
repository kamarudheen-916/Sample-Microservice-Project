const express = require('express')
const axios = require('axios')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
let events = []
app.post('/event', (req,res)=>{ 
    // console.log('i am in the event bus :',req.body );
    const event = req.body
    events.push(event)
    try {   
            //post service
     axios.post('http://localhost:4000/event',event)
   //comment service  
    axios.post('http://localhost:4001/event',event)
   //query service    
    axios.post('http://localhost:4002/event',event) 
    //moderator service
    axios.post('http://localhost:4003/event',event) 
  res.json({status:'ok'}) 
    } catch (error) {  
        console.log(error);  
    }
})  
 
app.get('/event',(req,res)=>{
  res.send(events)
})
app.listen(4005,()=>{
    console.log('event bus is lintening at :4005');
})