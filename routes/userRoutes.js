const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post =  mongoose.model("Post")
const User = mongoose.model("User")

//getAllUsers
router.get('/allusers',(req,res)=>{
    User.find()
    .then((users)=>{
        res.json({users})
    }).catch(err=>{
        console.log(err)
    })
    
})


//getUer
router.get('/user',(req,res)=>{
    User.findOne({_id:req.body.id})
    .then(user=>{
         Post.find({postedBy:req.params.id})
         .populate("postedBy","_id name")
         .exec((err,posts)=>{
             if(err){
                 return res.status(422).json({error:err})
             }
             res.json({user,posts})
         })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

//getUserAndPost
router.post('/getUser',(req,res)=>{
    User.findById(req.body._id)
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

router.post('/updateInfo',(req,res)=>{
    User.findByIdAndUpdate(req.body._id,{
        name:req.body.name,
        currentPosition:req.body.currentPosition,
        companyName:req.body.companyName,
        currentlyWorking:req.body.currentlyWorking,
        educationTitle:req.body.educationTitle,
        school:req.body.school,
        student:req.body.student
        
    }).then(data=>{
        console.log(data)
        res.send(data)
    })
    .catch(err=>{
      console.log(err)
    })
  
  })






module.exports = router