import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    headline:{
        type:String,
        required:true
    },
    headline1:{
        type:String,
        required:true
    },
    headline2:{
        type:[String],
        required:true
    },
    images:{
        type:[String],
        required:true
    },
    Price:{
        type:String,
        required:true
    },
    collect:{
        type:String,
        required:true
    },
    svj:{
        type:String,
        required:true
    }
})

export default mongoose.model("User", userSchema);
