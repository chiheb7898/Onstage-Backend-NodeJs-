const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:String,
    email:{
        type: String,
        unique:true,
        required:true
     },
    currentPosition:String,
    companyName:String,
    currentlyWorking:String,
    educationTitle:String,
    school:String,
    student:String,
    picture:String,
    savedPosts:[{type:ObjectId,unique:true,ref:"Post"}],

})

mongoose.model('User',userSchema);