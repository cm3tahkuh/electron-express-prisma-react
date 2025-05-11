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
exports.getProductsBySortingService = exports.deleteProductService = exports.updateProductService = exports.addProductService = exports.getAllProductsService = void 0;
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const getAllProductsService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.product.findMany({ where: { deletedAt: null } });
});
exports.getAllProductsService = getAllProductsService;
const addProductService = (product) => __awaiter(void 0, void 0, void 0, function* () {
    const addUser = prisma.product.create({ data: product });
    return addUser;
});
exports.addProductService = addProductService;
const updateProductService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, product, }) {
    const existUser = prisma.user.findUnique({
        where: {
            id: id,
        },
    });
    if (!existUser) {
        throw new Error("Пользователь не найден");
    }
    const updateProduct = yield prisma.product.update({
        where: { id: id },
        data: {
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            image: product.image,
        },
    });
    return updateProduct;
});
exports.updateProductService = updateProductService;
const deleteProductService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.product.update({
        where: {
            id: id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
});
exports.deleteProductService = deleteProductService;
const getProductsBySortingService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ searchString, sortBy, minPrice, maxPrice, }) {
    try {
        let orderByClause = { createdAt: "asc" };
        if (sortBy === "new")
            orderByClause = { createdAt: "desc" };
        const whereClause = {};
        whereClause.deletedAt = null;
        if (typeof minPrice === "number" && typeof maxPrice === "number") {
            whereClause.price = {
                gte: minPrice,
                lte: maxPrice,
            };
        }
        if (searchString && searchString.trim() !== "") {
            whereClause.name = {
                contains: searchString,
                // mode: 'insensitive',
            };
        }
        whereClause.quantity = {
            gt: 0,
        };
        whereClause.deletedAt = null;
        const products = yield prisma.product.findMany({
            where: whereClause,
            orderBy: orderByClause,
        });
        return products;
    }
    catch (error) {
        console.error(error);
        throw new Error("Ошибка при фильтрации");
    }
});
exports.getProductsBySortingService = getProductsBySortingService;
