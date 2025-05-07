import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductsBySorting,
  updateProduct,
} from "../controllers/productController";

const router = Router();

// логика админки

router.get("/", getAllProducts);

router.post("/createProduct", addProduct);

router.put("/updateProductById", updateProduct);

router.delete("/deleteProductById", deleteProduct);


// фильтрация для пользователей

router.get("/getProducts", getProductsBySorting);


export default router;
