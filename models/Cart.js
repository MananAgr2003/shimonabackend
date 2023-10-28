import mongoose from "mongoose";

const CartSchema = mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Image:{
        type:String,
        required:true
    },
    Price:{
        type:String,
        required:true
    },
    Quantity:{
        type:Number,
        required:true
    },
    Id:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    Index:{
        type:Number,
        required:true
    },
    svj:{
        type:String,
        required:true
    }
})

export default mongoose.model("Cartnow", CartSchema);