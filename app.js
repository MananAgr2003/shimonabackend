import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import ProductModel from "./models/ProductM.js"
import dotenv from "dotenv";
import userRouter from "./routers/product.js";
import multer from 'multer';
// import fileUpload from "express-fileupload";
import { genchecksum, verifychecksum } from "./Paytm/checksum.js";
import { PaytmConfig } from "./Paytm/config.js";
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios'
import fs from 'fs'
// const { v4: uuidv4 } = require('uuid');
import streamifier from 'streamifier'
const app = express();
app.use(morgan("dev"));


// const upload = multer();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
dotenv.config();

app.use(cors());
app.use("/api", userRouter); 

cloudinary.config({ 
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key, 
  api_secret: process.env.api_secret 
});
const storage = multer.memoryStorage();
// ---------------------------------------------------
const upload = multer({ dest: 'uploads/',  limits: { fieldSize: 25 * 1024 * 1024 },storage 
}); 

const PAYTM_MERCHANT_ID = 'mMBgcD76826858244954';
const PAYTM_MERCHANT_KEY = 'YOUR_PAYTM_MERCHANT_KEY';
const PAYTM_WEBSITE = 'DEFAULT';

import stripePackage from 'stripe';

const stripe = stripePackage(process.env.STRIPE_SECRET_TEST);
import sgMail from '@sendgrid/mail';

let endpointSecret;
// const endpointSecret = process.env.WEBHOOK;

const MERCHANT_ID = 'your_merchant_id';
const SECRET_KEY = 'your_secret_key';
const PAYU_API_URL = 'https://secure.payu.com/api/v2_1/orders';

app.post('/api/pay', async (req, res) => {
  try {
    const { amount } = req.body;
    const response = await axios.post(PAYU_API_URL, {
      merchantId: MERCHANT_ID,
      totalAmount: amount,
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


app.post('/upload-images',
upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  { name: 'image5', maxCount: 1 },
  // Add more fields as needed
]), async (req, res) => {
    const  { collection , headline ,heading1 , heading2 , price , svj} = req.body;
    try {
      // const imageUrls = [];
          const uploadedImages = [];
          // console.log(req.files);
          for (const fieldName in req.files) {
            const files = req.files[fieldName];
      
            for (const file of files) {
              await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                  if (error) {
                    console.error('Error uploading image to Cloudinary:', error);
                    reject(error);
                  } else {
                    console.log(result.secure_url);
                    uploadedImages.push(result.secure_url);
                    resolve();
                  }
                });
      
                streamifier.createReadStream(file.buffer).pipe(stream);
              });
            }
          }
      
      // Save the 'imageUrls' array to MongoDB or perform any additional operations
      console.log(uploadedImages);
      const dataa = JSON.parse(heading2);
      console.log(dataa);
      const product  =  new ProductModel({
                images:uploadedImages,
                headline1:heading1,
                headline2:dataa,
                collect:collection,
                headline:headline,
                Price:price,
                svj : svj
            })

            // console.log(product);

            try {
                await product.save();
                res.status(200).json("posted succesfully");
            } catch (error) {
                console.log(error)
            }
    //   res.json({ imageUrls });
    } catch (error) {
      console.error('Error uploading images to Cloudinary:', error);
      res.status(500).json({ error: 'Failed to upload images' });
    }
  });

app.post('/productUpdate',upload.array('images'), async (req,res) =>{

  const  { id , collection , headline , heading1 , heading2 ,images , price ,svj } = req.body;


  const data = req.files;
  console.log(data);
  console.log(images);
  const updatedImages = [];

  for (const image of data) {
    if (typeof image === 'string') {
      // If the image is already a URL, no need to process it
      updatedImages.push(image);
    } else {
      // Otherwise, it's a file. Upload the image to Cloudinary and get the URL
      try {
        const url = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
              console.error('Error uploading image to Cloudinary:', error);
              reject(error);
            } else {
              console.log(result.secure_url);
              resolve(result.secure_url);
            }
          });
          streamifier.createReadStream(image.buffer).pipe(stream);
        });

        updatedImages.push(url);
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        updatedImages.push('Failed to upload');
      }
    }
  }
        // Create a Readable Stream from the buffer
      //   const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      //     if (error) {
      //       console.error('Error uploading to Cloudinary:', error);
      //       return 'Failed to upload';
      //     }
      //     console.log(result);
      //     return result.secure_url;
      //   });

      //   streamifier.createReadStream(image.buffer).pipe(stream);

      //   // Return a promise for the result
      //   return await new Promise((resolve) => {
      //     stream.on('end', () => {
      //       resolve(stream.result);
      //     });
      //   });
      // } catch (error) {
      //   console.error('Error uploading to Cloudinary:', error);
      //   return 'Failed to upload';
      // }
    //  }
    // })
  // );
  console.log(updatedImages);

  // console.log(heading2);
  const dataa = JSON.parse(heading2);
      console.log(dataa);
  const updatedData = await ProductModel.findOneAndUpdate(
    {_id : id},
    {
        images:updatedImages,
        headline1:heading1,
        headline2:dataa,
        collect:collection,
        headline:headline,
        Price:price,
        svj:svj
    },
    {new:true}
);

console.log(updatedData);
res.status(200).json("Updated successfully");
})

app.post('/api/paytm/initiatePayment', (req, res) => {
  const { amount, email, phone } = req.body;
  const orderId = uuidv4(); // Generate a unique order ID for each transaction

  const params = {
    MID: 'mMBgcD76826858244954',
    WEBSITE: 'DEFAULT',
    ORDER_ID: orderId,
    CUST_ID: uuidv4(), // You can use customer's unique ID here
    INDUSTRY_TYPE_ID: 'Retail', // You can change this based on your industry type
    CHANNEL_ID: 'WEB',
    TXN_AMOUNT: amount.toString(),
    EMAIL: email,
    MOBILE_NO: phone,
    CALLBACK_URL: 'http://localhost:5000/api/paytm/response', // Replace this with your actual callback URL
  };

  // Generate checksum using Paytm provided method
  const checksum = generateChecksum(params, PAYTM_MERCHANT_KEY);
  params.CHECKSUMHASH = checksum;

  // Return the parameters to the frontend
  res.json(params);
});

app.post('/create-checkout-session', async (req, res) => {
  console.log(req.body.data);

  const customer = await stripe.customers.create({
    metadata:{
      // user_id:req.body.user.user_id,
      cart:JSON.stringify(req.body.data.cart),
      total:req.body.data.total
    }
  })

  const line_items = req.body.data?.cart?.map((items)=>{4
    const price = req.body.data.total;
    console.log(price);
    return{
      price_data: {
        currency: 'inr',
        product_data: {
          name: items.Name,
          images:[items.Image],
          metadata:{
            id:items._id,
            svj:items.svj,
          }
        },
        unit_amount: price*100,
      },
      quantity: items.Quantity,
    }
  })
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection:{
      allowed_countries:['IN']
    },
    shipping_options:[
      {
        shipping_rate_data:{
          type:"fixed_amount",
          fixed_amount:{
            amount:0,currency:"inr"
          },
          display_name:"Free shipping",
          delivery_estimate:{
            minimum:{unit:"business_day",value:10},
            maximum:{unit:"business_day",value:15},
          },
        },
      },
    ],
    line_items,
    customer: customer.id,
    mode: 'payment',
    success_url:'https://idyllic-fox-ee0951.netlify.app/email',
    cancel_url:'https://idyllic-fox-ee0951.netlify.app/',
  });

  console.log(session.url);
  res.send({url:session.url});
});


app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];

  let eventType;
  let data;
  
  if(endpointSecret){
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type;
  }else{
    data = req.body.data.object;
    eventType = req.body.type;
  }

  if(eventType == "checkout.session.completed"){
    stripe.customer.retrieve(data.customer).then(customer=>{
      console.log("Customer details",customer)
      console.log("Data",data)
    })
  }

  // Handle the event
  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     const paymentIntentSucceeded = event.data.object;
  //     // Then define and call a function to handle the event payment_intent.succeeded
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

app.post('/api/paytm/response', (req, res) => {
  const responseData = req.body;

  // Verify the checksum received from Paytm to ensure data authenticity
  const checksum = responseData.CHECKSUMHASH;
  delete responseData.CHECKSUMHASH;
  const isValidChecksum = verifyChecksum(responseData, PAYTM_MERCHANT_KEY, checksum);

  if (isValidChecksum) {
    // Check the payment status and update your database accordingly
    const paymentStatus = responseData.STATUS;
    // Handle success/failure and other response data as needed
    res.send('Payment response received successfully.');
  } else {
    // Handle invalid response
    res.status(400).send('Invalid payment response.');
  }
});


function generateChecksum(params, key) {
  const data = Object.values(params).join('|');
  return crypto.createHmac('sha256', key).update(data).digest('hex');
}

function verifyChecksum(params, key, checksum) {
  const data = Object.values(params).join('|');
  const generatedChecksum = crypto.createHmac('sha256', key).update(data).digest('hex');
  return generatedChecksum === checksum;
}


app.get("/",(req,res)=>{
    res.json({message:"Hello"})
})

const port = 5000;

mongoose
.connect(process.env.MONGODB_URL)
.then(() => {
app.listen(port,"0.0.0.0", () => console.log(`Server running on port ${port}`));
}) 
.catch((error) => console.log(`${error} did not connect`))
