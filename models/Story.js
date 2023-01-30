const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const storySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    video:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId,unique:true,ref:"User"}],
    postedBy:{
       type:ObjectId,
       ref:"User"
    }
},{timestamps:true})
mongoose.model("Story",storySchema);