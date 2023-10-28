import BuyModel from "../models/buydata.js";
import ProductModel from "../models/ProductM.js";
import CartModel from "../models/Cart.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
// import lg from '';
dotenv.config();
// import stripe from 'stripe';
// const secretKey = process.env.STRIPE_SECRET_TEST;
// const stripeInstance = stripe(secretKey);

export const mailsend = async (req, res) => {
  try {
    const { email,firstName ,QuantityData ,address,ItemsData, stripe_order_id } = req.body;
    // console.log(ItemsArray);
    const currentDate = new Date();
console.log(currentDate);
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: "nipunk860@gmail.com", // Sender's email address
        pass: process.env.Pass, // Sender's email password or app password (if using Gmail)
      },
    });

    const mailOptions = {
      from: "nipunk860@gmail.com", // Sender's email address
      to: email, // Recipient's email address
      subject: "Order Placement Email", // Email subject
      text: "Thank You for Placing Your Order with us",
      html: `
      <html>
      <head>
        <style>
        body{
          display: flex;
          width: 100%;
          justify-content: center;
          align-items: start;
          flex-direction: column;
        }
        h1 {
          color: #333;
          font-size: 31px;
          color: green;
          width: 100%;
          text-align: center;
          /* justify-content: center; */
          letter-spacing: 1px;
          margin-bottom: 16px;
          margin-bottom: 20px;
        }
        p {
          color: #2b2b2b;
          font-size: 18px;
          width:100%;
          margin: 4px 4px;
          /* text-align: center; */
          /* margin-top: 60px; */
        }
        img {
          /* max-width: 100%; */
          height: 600px;
          /* margin-bottom: 16px; */
        }
        h2{
          font-size: 22px;
          /* text-align: center; */
          font-style: italic;
          color: black;
        }
        h3{
          font-size: 20px;
          /* text-align: center; */
          /* font-style: italic; */
          color: black;
        }
        .item{
            height: 180px;
            width: 100%;
            border: 2px solid black;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        img{
            height: 80%;
            width: 80%;
        }
        h5{
            font-size: 17px;
            margin: 0px 0px;
        }
        .onee{
            height: 100%;
            width: 33%;
            margin-left: 12px;
        }
        h6{
            font-size: 17px;
            margin-right: 12px;
        }
        </style>
      </head>
      <body>
          <h2>Dear ${firstName}</h2>
          <p>Thank you for choosing shimonaagrawal.com for your latest fashion purchase! We are delighted to confirm that your order has been successfully placed and is now being processed with utmost care and attention to detail.
          </p>
          <h3>Here are the details of your order:</h3>
          <p>Order Number: [${stripe_order_id}]</p>
          <p>Order Date: [${currentDate}]</p>
          <p>Shipping Address: [${address}]</p>
          <h3>Item(s) Ordered:</h3>
          ${Array.isArray(ItemsData)
            ? ItemsData
                .map((ele, index) => `
                  <div class="item" key=${index}>
                    <div class="onee">
                      <img src=${ele.Image} alt=""/>
                      <h5>Quantity: ${ele.Quantity}</h5>
                    </div>
                    <div class="onee">
                      <h6>Name: ${ele.Name}</h6>
                    </div>
                    <div class="onee">
                      <h6>Price: ${ele.Price}</h6>
                    </div>
                  </div>
                `)
                .join('')
            : ''}
          <br>
          <p>
              <br>
              Shipping Method: [Home Delivery] <br>
              Estimated Delivery Date: 10-15 Business Days. <br>
              <br>
              Please note that your items will be carefully packaged and shipped to you using our trusted shipping partner. Once your order has been dispatched, you will receive a separate email containing the tracking information, allowing you to conveniently monitor the progress of your shipment.
              <br>
              <br>
              Should you have any questions or concerns regarding your order, our dedicated customer support team is always here to assist you. Feel free to reach out to us via email at info.labelsa@gmail.com or by calling our helpline at 9919101106.
              <br>
              <br>
              We would like to express our heartfelt gratitude for choosing shimonaagrawal.com. We take immense pride in offering high-quality fashion products and ensuring a seamless shopping experience for our valued customers like you. We hope that the products you've selected will bring joy and style to your wardrobe.
              <br>
              <br>
              Thank you once again for your order. We truly appreciate your trust in our brand. We look forward to serving you and exceeding your expectations.
              <br>
              <br>
              Wishing you a fashionable and delightful experience with shimonaagrawal.com!</p>
              </p>
              <br>
              Warm regards,
              <br>
              Team - SHIMONA AGRAWAL
      </body>
  </html>
            `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent:", info.response);
        res.status(200).json("Email send successfully");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const AdminLogin = async (req, res) => {
  try {
    const { User, Pass } = req.body;
    // Admin#6543
    if (User == "Admin#6543" && Pass == "Abc908X765") {
      res.status(200).json("Login Successfull");
    } else {
      res.status(400).json("You are not admin");
    }
  } catch (error) {
    console.log(error);
  }
};

export const stripePay = async (req,res) =>{
  let { amount, id } = req.body;
  console.log("stripe-routes.js 10 | amount and id", amount, id);
  const timestamp = Date.now();
  const stripe_order_id = `${id}_${timestamp}`;
  console.log(stripe_order_id);
  try {
    const payment = await stripeInstance.paymentIntents.create({
      amount: amount,
      currency: "USD",
      description: "Your Company Description",
      payment_method: id,
      confirm: true,
    });
    console.log("stripe-routes.js 19 | payment", payment);
    res.json({
      message: "Payment Successful",
      stripe_order_id:stripe_order_id,
      success: true,
    });
  } catch (error) {
    console.log("stripe-routes.js 17 | error", error);
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
}

// Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi aperiam sed similique neque ipsam sunt ab. Modi, molestias eligendi perferendis quis corporis possimus minus itaque quia veniam labore vero beatae iusto fugiat ad, facilis rem facere, quo assumenda omnis unde nostrum? Totam atque perspiciatis magni. Sit magni possimus voluptatem ducimus, voluptatibus labore quis doloribus corporis numquam recusandae laborum tempore accusamus ullam velit praesentium dolorum, placeat ipsa consectetur ipsum eos deleniti optio. Labore numquam magni asperiores harum libero incidunt cupiditate ad laudantium, quaerat itaque veritatis! Deleniti non nemo facilis id perferendis sed! Voluptatum id impedit dolore quibusdam facilis omnis molestias sint, delectus quisquam assumenda at quis numquam accusamus commodi ipsa aut quia? Nesciunt, ipsam ipsa saepe maiores molestiae praesentium quod non perferendis repudiandae dolorem repellendus laboriosam inventore ea repellat facilis autem ab explicabo magni at alias, ex facere, possimus architecto! Cum reiciendis quaerat natus dolores alias temporibus perspiciatis dolor quos itaque, error vel sed veritatis iure debitis eaque enim exercitationem nisi assumenda, beatae iste architecto laborum libero dicta labore. Esse in voluptate cumque qui magnam ea blanditiis inventore labore, dolores a nihil quidem totam aspernatur ab dolor, perferendis doloribus illum asperiores, mollitia accusamus! Reiciendis molestias nostrum amet tempore culpa rem dolores doloremque quisquam, vel similique autem iusto soluta, eum ea iste magni quaerat rerum asperiores. Delectus repudiandae amet dicta, reprehenderit veniam inventore tenetur quidem minus quod odit, accusantium magnam ratione vero incidunt cupiditate beatae non quas nam perferendis assumenda. Qui nam voluptatem in ad sit, unde quas. Ex earum saepe repellat a. Eligendi aliquid quas inventore aspernatur maxime esse iusto eveniet facere repellendus quo nostrum ipsa, excepturi veniam. Quaerat hic adipisci nisi laudantium corporis quas possimus eligendi inventore illum molestiae ex quidem rem, quasi saepe eum aliquam doloribus veritatis enim, debitis ipsam est fugit asperiores? Ipsam, necessitatibus? Aut cupiditate eveniet vel!


export const GetBuyId = async (req, res) => {
  try {
    const Productlist = await BuyModel.find();
    res.status(200).json(Productlist);
  } catch (error) {
    console.log(error);
  }
};

export const SingleProductId = async (req, res) => {
  try {
    console.log(req.params.id);
    const stripe_order_id = req.params.id;
    console.log(stripe_order_id);
    const data = await BuyModel.find({ stripe_order_id });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

export const StripeProductId = async (req, res) => {
  try {
    const razorpay_payment_id = req.params.id;
    console.log(razorpay_payment_id);
    const data = await BuyModel.find({ razorpay_payment_id });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

export const deleteproductid = async (req, res) => {
  try {
    const { _id } = req.body;
    console.log(_id);
    const resdata = await ProductModel.findByIdAndDelete(_id);
    res.status(200).json("Item deleted !!");
  } catch (error) {
    console.log(error);
  }
};



export const UpdateBuy = async (req, res) => {
  try {
    const {stripe_id} = req.body;
    const updatedData = await BuyModel.findOneAndUpdate(
      { stripe_order_id: stripe_id },
      {
        Purchased: true,
      },
      { new: true }
    );
    console.log(updatedData);
    res.json(updatedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the data" });
  }
};

export const Paycart = async (req, res) => {
  console.log(req.body);
  const {
    email,
    SizeArray,
    QuantityArray,
    ItemsArray,
    firstName,
    lastName,
    address,
    phoneNumber,
    stripe_order_id
  } = req.body;
  const data = await new BuyModel({
    ItemsData: ItemsArray,
    SizesData: SizeArray,
    QuantityData: QuantityArray,
    Purchased: "false",
    email: email,
    stripe_order_id:stripe_order_id,
    firstName:firstName,
    lastName:lastName,
    address:address,
    phoneNumber:phoneNumber
  });

  console.log(data);
  try {
    await data.save();
    res.status(200).json("Added buy data successfully");
  } catch (error) {
    console.log(error);
  }
};
