const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Chat =  mongoose.model("Chat")

router.post('/sendMsg',async(req,res)=>{

  try{
  const chat = new Chat({
    sender:req.body.sender,
    receiver:req.body.receiver,
    message:req.body.message,
  })
  await chat.save()
  .then(result=>{
      res.json({chat:result})
  })
}
catch(err){
  return res.status(422).send({err})
}
})

router.post('/msgSent',(req,res)=>{
  Chat.find({sender:{$in:req.body.sender}}&&{receiver:{$in:req.body.receiver}}) 
  .then((chats)=>{
      res.json({chats})
  }).catch(err=>{
      console.log(err)
  })
  
})

module.exports = router