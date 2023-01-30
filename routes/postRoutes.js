const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post =  mongoose.model("Post")


router.get('/allpost',(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then((posts)=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
    
})

router.post('/searchPosts',(req,res,next)=>{
    const searchedField = req.body.name;
    Post.find({$or: [
        {
      $and: [{title:{$regex: `${searchedField}`,$options: '$i'},description:{$regex: `${searchedField}`,$options: '$i'}}]
    
    } ]
})
        .then(posts=>{
            res.send({posts});
        })

})

const {upload} = require('../middleware/upload');
router.post('/createpost',upload.single('photo'),async(req,res)=>{
    const {title,description} = req.body 
    if(!title ){
      return  res.status(422).json({error:"Plase add all the fields"})
    }
    try{
    const post = new Post({
        title:req.body.title,
        description:req.body.description,
        photo:`http://localhost:8000/${req.file.path}`,
        postedBy:req.body.postedBy
    })
    console.log(post.photo)
    await post.save().then(result=>{
        console.log(result)
        res.json({post:result})
    })
}
catch(err){
    return res.status(422).send({err})
}
})

router.get('/mypost',(req,res)=>{
    Post.find({postedBy:req.body._id})
    .populate("PostedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like',(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
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
router.put('/unlike',(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
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
router.post('/getComments',async(req,res)=>{
    const {_id} = req.body
    const post = await Post.findOne({_id})
    try{
      res.json({
      comments: post.comments
  })
    }
    catch(err){
        console.log(err)
    return res.status(422).send({error :"error"})
}
})

router.put('/addComment',(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.body.user_id,
        username:req.body.username,
        userpicture:req.body.userpicture
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            console.log(err)
            return res.status(422).json({error:err})
        }else{
           console.log(result)
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',(req,res)=>{
    Post.findOne({_id:req.body.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})

module.exports = router