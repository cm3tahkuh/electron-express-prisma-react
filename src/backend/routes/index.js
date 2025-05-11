"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const productRoutes_1 = __importDefault(require("./productRoutes"));
const cartRoutes_1 = __importDefault(require("./cartRoutes"));
const saleRoutes_1 = __importDefault(require("./saleRoutes"));
const router = (0, express_1.Router)();
router.use("/users", userRoutes_1.default);
router.use("/auth", authRoutes_1.default);
router.use("/products", productRoutes_1.default);
router.use("/carts", cartRoutes_1.default);
router.use("/sales", saleRoutes_1.default);
exports.default = router;
