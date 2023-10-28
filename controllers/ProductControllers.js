import ProductModel from "../models/ProductM.js"
import Razorpay from 'razorpay';
import dotenv from "dotenv";
import multer from 'multer';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
const upload = multer();

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret 
  });

// export const addProduct = async (req,res) =>{
//     const  { collection , headline , images, heading1 , heading2 , price , svj} = req.body;
    
//     const imageUrls = [];

//     for (const imageString of images) {
//       // Decode Base64 image string
//       const buffer = Buffer.from(imageString, 'base64');

//       // Upload image to Cloudinary
//       const result = await cloudinary.uploader.upload(buffer, {
//         folder: imageset, // Set the desired folder name in Cloudinary
//       });

//       // Get the URL of the uploaded image
//       const imageUrl = result.secure_url;
//       imageUrls.push(imageUrl);
//     }

//     const product  =  new ProductModel({
//         images:imageUrls,
//         headline1:heading1,
//         headline2:heading2,
//         collect:collection,
//         headline:headline,
//         Price:price,
//         svj : svj
//     })

//     try {
//         await product.save();
//         res.status(200).json("posted succesfully");
//     } catch (error) {
//         console.log(error)
//     }
// }

export const UpdatedProduct = async (req,res) =>{
    try {
        console.log(req.body);
        const  { id , collection , headline , heading1 , heading2 , images , price } = req.body;

        const updatedData = await ProductModel.findOneAndUpdate(
            {_id : id},
            {
                images:images,
                headline1:heading1,
                headline2:heading2,
                collect:collection,
                headline:headline,
                Price:price
            },
            {new:true}
        );
        
        console.log(updatedData);
        res.status(200).json("Updated successfully");
    } catch (error) {
        console.log(error)
    }
}

export const fetchProduct = async (req,res) =>{
    try {
        const Productlist = await ProductModel.find();
        console.log(Productlist);
        res.status(200).json(Productlist);
    } catch (error) {
        console.log(error);
    }
}   

export const GetProductId = async(req,res) =>{
    try {
        const id = req.params.id;
        // console.log(id);
        const data  = await ProductModel.findById(id);
        // console.log(data);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
}

export const GetByName = async (req,res) =>{
    try {
        const {name1} = req.body;
        console.log(name1);
        const data = await ProductModel.findOne({headline:name1});
        console.log(data);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
}

export const PaymentControllers = (req,res) =>{
var instance = new Razorpay({ key_id: process.env.key_id, key_secret: process.env.key_secret })

var options = {
  amount: req.body.amount*100,  
  currency: "INR",
};
instance.orders.create(options, function(err, order) {
    if(err){
        return res.send({code:500,message:"Server Err"});
    }
    return res.send({code:200 , message:'order created' , data:order})
  console.log(order);
});
}

export const verifyControllers = (req,res) =>{

}

export const collectNamedata = async (req,res) =>{
    try {
        const {name} = req.body;
        console.log(name)
        const resdata = await ProductModel.find({collect : name});
        res.status(200).json(resdata);
    } catch (error) {
        console.log(error)
    }
}