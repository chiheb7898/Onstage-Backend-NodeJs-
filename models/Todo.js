const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const TodoSchema = new mongoose.Schema({
    description: {
        type: String
    },
    postedBy:{
        type: String
     },
    finished: {
        type: String,
        default: "false"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});
mongoose.model("Todo",TodoSchema);

