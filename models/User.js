const mongoose = require('mongoose')

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
    picture:String

})

mongoose.model('User',userSchema);