import { Router } from "express";
import {
  addToCart,
  createSaleFromCart,
  deleteFromCartByProductId,
  getUserCart,
} from "../controllers/cartController";

const router = Router();

router.get("/", getUserCart);

router.post("/addToCartByProductId", addToCart);

router.post("/createSaleFromCart", createSaleFromCart);

router.delete("/deleteFromCartByProductId", deleteFromCartByProductId);

export default router;
