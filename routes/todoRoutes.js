const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Todo =  mongoose.model("Todo")


router.get('/alltodo',(req,res)=>{
    Todo.find()
    .then((todos)=>{
        res.json({todos})
    }).catch(err=>{
        console.log(err)
    })
    
})
router.post('/addTodo',async(req,res)=>{
    try{
        const todo = new Todo({
            description:req.body.description,
            finished:req.body.finished,
            postedBy:req.body.postedBy
        })
        await todo.save()
        .then(result=>{
            console.log(result)
            res.json({todo:result})
        })
 }catch(err){
        return res.status(422).send({err})
    }
    })

    router.delete('/deletetodo',(req,res)=>{
        Todo.findOne({_id:req.body.todoId})
        .exec((err,todo)=>{
            if(err || !todo){
                return res.status(422).json({error:err})
            }
            todo.remove()
                  .then(result=>{
                      res.json(result)
                  }).catch(err=>{
                      console.log(err)
                  })
                })  
            })
module.exports = router