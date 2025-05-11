"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
// логика админки
router.get("/", productController_1.getAllProducts);
router.post("/createProduct", productController_1.addProduct);
router.put("/updateProductById", productController_1.updateProduct);
router.delete("/deleteProductById", productController_1.deleteProduct);
// фильтрация для пользователей
router.get("/getProducts", productController_1.getProductsBySorting);
exports.default = router;
