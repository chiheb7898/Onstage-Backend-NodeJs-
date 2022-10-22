const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId,unique:true,ref:"User"}],
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"},
        username:String,
        userpicture:String
    }],
    postedBy:{
       type:ObjectId,
       ref:"User"
    }
},{timestamps:true})

mongoose.model("Post",postSchema);