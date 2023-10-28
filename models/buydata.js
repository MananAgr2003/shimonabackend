import mongoose from "mongoose";
import moment from 'moment-timezone'

const BuySchema = mongoose.Schema({
    ItemsData:{
        type:Object,
        required:true
    },
    SizesData:{
        type:[String],
        required:true
    },
    QuantityData:{
        type:[String],
        required:true
    },
    Purchased:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    stripe_order_id:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    timestamp: {type: Number,  default: () => moment().tz('Asia/Kolkata').valueOf()},
})

export default mongoose.model("Buynow", BuySchema);