import CartModel from "../models/Cart.js"
import ProductModel from "../models/ProductM.js"

export const AddCart = async (req,res) =>{
    const {id , size , index} = req.body;
    // console.log(id,size,index);
    const user = await ProductModel.findById(id);
    // console.log(user);

    const data = await new CartModel({
        Name  : user.headline,
        Image : user.images[index],
        Price : user.Price,
        svj : user.svj,
        Quantity : 1,
        Id:id,
        size:size,
        Index:index
    })
    console.log(data)

    try {
        await data.save();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
}

export const GetCart = async (req,res) =>{
    try {
        const Productlist = await CartModel.find();
        res.status(200).json(Productlist);
    } catch (error) {
        console.log(error);
    }
}

export const deleteproduct = async (req,res) =>{
    try {
        const id = req.params.id;
        console.log(id);
        const data = await CartModel.findByIdAndDelete({_id : id});
        res.status(200).json("deleted successfully");
    } catch (error) {
        console.log(error);
    }
}
