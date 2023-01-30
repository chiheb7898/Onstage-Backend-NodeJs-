const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Story =  mongoose.model("Story")


router.get('/allstory',(req,res)=>{
    Story.find()
    .populate("postedBy","_id name")
    .sort('-createdAt')
    .then((stories)=>{
        res.json({stories})
    }).catch(err=>{
        console.log(err)
    })
    
})



const {upload} = require('../middleware/uploadVideo');
router.post('/createstory',upload.single('video'),async(req,res)=>{
    const {title,description} = req.body 
    if(!title ){
      return  res.status(422).json({error:"Plase add all the fields"})
    }
    try{
    const story = new Story({
        title:req.body.title,
        description:req.body.description,
        video:`http://localhost:8000/${req.file.path}`,
        postedBy:req.body.postedBy
    })
    await story.save().then(result=>{
        console.log(result)
        res.json({post:result})
    })
}
catch(err){
    return res.status(422).send({err})
}
})



router.put('/likeStory',(req,res)=>{
    Story.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.body.user_id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
router.put('/unlikeStory',(req,res)=>{
    Story.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.body.user_id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})



module.exports = router