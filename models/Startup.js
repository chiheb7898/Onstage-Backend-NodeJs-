const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const startupSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:"empty",
        required:true
    },
    logo:{
        type:String,
        required:true
    },
    rates:[{
        rate:String,
        postedBy:{type:ObjectId,ref:"User"},
    }],
},{timestamps:true})

mongoose.model("Startup",startupSchema);