import express  from "express"
import { UpdatedProduct , collectNamedata  , fetchProduct , GetProductId ,GetByName , PaymentControllers, verifyControllers} from "../controllers/ProductControllers.js";
import { AdminLogin , deleteproductid ,SingleProductId , GetBuyId ,UpdateBuy,  Paycart, mailsend, stripePay, StripeProductId} from "../controllers/BuyController.js";
import { deleteproduct ,AddCart , GetCart} from "../controllers/CartControllers.js";
const router = express.Router();

// router.post("/addProduct", addProduct);
router.get("/fetchProduct", fetchProduct);
router.get("/GetProductId/:id", GetProductId);
router.post("/GetByName",GetByName)
router.post("/orders",PaymentControllers);
router.post("/verify",verifyControllers);
// router.post("/BuyId",AddBuyId);
router.get("/GetBuyId",GetBuyId);
router.post("/UpdateBuyId",UpdateBuy);
router.post("/AddCart",AddCart);
router.get("/GetCart",GetCart);
router.post("/Paycart",Paycart);
router.post("/SingleProductId/:id",SingleProductId);
// router.get("/StripeProductId/:id",StripeProductId);
router.post("/deleteproduct/:id",deleteproduct);
router.post("/collectName",collectNamedata);
router.post("/deleteproductid",deleteproductid);
// router.post("/productUpdate",UpdatedProduct);
router.post("/loginnow",AdminLogin);
router.post("/send",mailsend);
router.post("/stripe",stripePay);

export default router;