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
        student:req.body.student,
        
    }).then(data=>{
        console.log(data)
        res.send(data)
    })
    .catch(err=>{
      console.log(err)
    })
  
  })
//update photo
  const {upload} = require('../middleware/upload');
  router.put('/updatephoto',upload.single('photo'),async(req,res)=>{
      let userId=req.body._id
        User.findByIdAndUpdate(req.body._id,{
      picture:`http://localhost:8000/${req.file.path}` 
      }).then(()=>{
        usertmp=User.findById(userId).then((exuser)=>{
            res.json(exuser)
        })
    })
    .catch(err=>{
      console.log(err)
    })
  
  })
      /*.then(data=>{
            usertmp=User.findOne(result._id)
            res.json(usertmp)           
        }.catch(err=>{
            console.log(err)
          })
            
        })*/


  router.put('/addFavourite',(req,res)=>{

    User.findByIdAndUpdate(req.body.user_id,{
        $push:{savedPosts:req.body.postId}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json({savedposts:result.savedPosts})
        }
    })
})

router.put('/removeFavourite',(req,res)=>{
    User.findByIdAndUpdate(req.body.user_id,{
        $pull:{savedPosts:req.body.postId}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
           // res.json({savedposts: user.savedPosts})
           res.json({savedposts:result.savedPosts})
        }
    })
})

router.post('/userbookmarks',async(req,res)=>{
    const {_id} = req.body
    const user = await User.findOne({_id}).populate('savedPosts')
    try{
      res.json({
          user
  })
    }
    catch(err){
        console.log(err)
    return res.status(422).send({error :"error"})
}
})



module.exports = router