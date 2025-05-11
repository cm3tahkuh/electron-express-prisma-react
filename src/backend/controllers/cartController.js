"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSaleFromCart = exports.deleteFromCartByProductId = exports.addToCart = exports.getUserCart = void 0;
const cartService_1 = require("../services/cartService");
const jwt_1 = require("../utils/jwt");
const getUserCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ message: "Необходима авторизация" });
        }
        const verify = (0, jwt_1.verifyToken)(token);
        if (!verify) {
            res.status(403).json({ message: "Не валидный токен" });
        }
        const cart = yield (0, cartService_1.getUserCartService)(token);
        res.json(cart);
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: error.message || "Ошибка при получении корзины" });
    }
});
exports.getUserCart = getUserCart;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: "Необходима авторизация" });
    }
    const { productId } = req.body;
    if (!productId) {
        res.status(400).json({ message: "productId обязателен" });
    }
    try {
        const cartItem = yield (0, cartService_1.addToCartService)({
            token,
            productId: Number(productId),
        });
        res.status(200).json(cartItem);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addToCart = addToCart;
const deleteFromCartByProductId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: "Необходима авторизация" });
    }
    const { productId } = req.body;
    if (!productId) {
        res.status(400).json({ message: "productId обязателен" });
    }
    try {
        const cartItem = yield (0, cartService_1.deleteFromCartByProductIdService)({
            productId: Number(productId),
            token,
        });
        res.json(cartItem);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: error.message || "Ошибка добавления товара" });
    }
});
exports.deleteFromCartByProductId = deleteFromCartByProductId;
const createSaleFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: "Необходима авторизация" });
    }
    try {
        const cartItem = yield (0, cartService_1.createSaleFromCartService)(token);
        res.status(201).json(cartItem);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: error.message || "Ошибка добавления товара" });
    }
});
exports.createSaleFromCart = createSaleFromCart;
