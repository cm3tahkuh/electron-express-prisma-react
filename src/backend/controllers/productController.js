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
exports.getProductsBySorting = exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getAllProducts = void 0;
const productService_1 = require("../services/productService");
const authorize_1 = require("../utils/authorize");
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, productService_1.getAllProductsService)();
        res.status(200).json(products);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ошибка при получении списка товаров" });
    }
});
exports.getAllProducts = getAllProducts;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, authorize_1.authorize)(req, res, ["manager", "admin"]);
        if (!decoded) {
            return;
        }
        const { name, description, price, quantity, image } = req.body;
        const product = yield (0, productService_1.addProductService)({
            name,
            description,
            price,
            quantity,
            image,
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ошибка при добавлении нового товара" });
    }
});
exports.addProduct = addProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, authorize_1.authorize)(req, res, ["manager", "admin"]);
        if (!decoded) {
            return;
        }
        const { id, name, description, price, quantity, image } = req.body;
        const product = yield (0, productService_1.updateProductService)({
            id,
            product: { name, description, price, quantity, image },
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Произошла ошибка при обновлении информации товара" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, authorize_1.authorize)(req, res, ["manager", "admin"]);
        if (!decoded) {
            return;
        }
        const { id } = req.body;
        const product = yield (0, productService_1.deleteProductService)(id);
        res.status(201).json(product);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Произошла ошибка при удалении товара" });
    }
});
exports.deleteProduct = deleteProduct;
const getProductsBySorting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sortBy, minPrice, maxPrice, q } = req.query;
    const sortString = (sortBy === null || sortBy === void 0 ? void 0 : sortBy.toString()) || "new";
    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : 10000;
    const searchString = (q === null || q === void 0 ? void 0 : q.toString()) || "";
    try {
        const products = yield (0, productService_1.getProductsBySortingService)({
            sortBy: sortString,
            minPrice: min,
            maxPrice: max,
            searchString: searchString.trim(),
        });
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Что-то пошло не так." });
    }
});
exports.getProductsBySorting = getProductsBySorting;
