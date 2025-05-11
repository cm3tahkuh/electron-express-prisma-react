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
exports.createSaleFromCartService = exports.deleteFromCartByProductIdService = exports.addToCartService = exports.getUserCartService = void 0;
const prisma_1 = require("../generated/prisma");
const jwt_1 = require("../utils/jwt");
const prisma = new prisma_1.PrismaClient();
const getUserCartService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        const userId = decoded.user.id;
        const cart = yield prisma.cart.findUnique({
            where: { userId },
            include: {
                CartItem: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!cart) {
            return { items: [] };
        }
        return {
            items: cart.CartItem.map((item) => ({
                id: item.id,
                productId: item.product.id,
                name: item.product.name,
                price: item.product.price,
                image: item.product.image,
                quantity: item.quantity,
            })),
        };
    }
    catch (error) {
        console.log(error);
        throw new Error("Ошибка получения корзины");
    }
});
exports.getUserCartService = getUserCartService;
const addToCartService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ productId, token, }) {
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        const userId = decoded.user.id;
        let cart = yield prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            throw new Error("Пользователь не имеет права совершать покупки");
        }
        const existingItem = yield prisma.cartItem.findFirst({
            where: {
                productId: productId,
                cartId: cart.id,
            },
        });
        const existingProduct = yield prisma.product.findUnique({
            where: { id: productId },
        });
        if (existingItem && existingProduct) {
            if (existingItem.quantity + 1 > existingProduct.quantity) {
                throw new Error("Вы добавили предел товара в вашу корзину");
            }
            const updatedItem = yield prisma.cartItem.update({
                where: {
                    id: existingItem.id,
                },
                data: {
                    quantity: existingItem.quantity + 1,
                },
            });
            return updatedItem;
        }
        const cartItem = yield prisma.cartItem.create({
            data: {
                productId: productId,
                cartId: cart.id,
                quantity: 1,
            },
        });
        return cartItem;
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
});
exports.addToCartService = addToCartService;
const deleteFromCartByProductIdService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ productId, token, }) {
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        const userId = decoded.user.id;
        console.log(decoded);
        const cart = yield prisma.cart.findFirst({ where: { userId: userId } });
        if (!cart) {
            throw new Error("Корзины не существует");
        }
        const cartItem = yield prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: productId,
            },
        });
        if (!cartItem) {
            throw new Error("Товар не найден в корзине");
        }
        return yield prisma.cartItem.delete({
            where: {
                id: cartItem.id,
            },
        });
    }
    catch (error) {
        console.log(error);
        throw new Error("Ошибка при удалении товара из корзины");
    }
});
exports.deleteFromCartByProductIdService = deleteFromCartByProductIdService;
const createSaleFromCartService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        const userId = decoded.user.id;
        const cart = yield prisma.cart.findUnique({
            where: { userId },
            include: {
                CartItem: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!cart || cart.CartItem.length === 0) {
            throw new Error("Корзина пуста или не найдена");
        }
        const totalPrice = cart.CartItem.reduce((total, item) => total + item.quantity * item.product.price, 0);
        // Создаем запись о продаже
        const sale = yield prisma.sale.create({
            data: {
                userId,
                totalPrice,
                SaleItem: {
                    create: cart.CartItem.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
        });
        for (const item of cart.CartItem) {
            yield prisma.product.update({
                where: { id: item.productId },
                data: { quantity: { decrement: item.quantity } },
            });
        }
        yield prisma.cart.update({
            where: { userId },
            data: { CartItem: { deleteMany: {} } },
        });
        return sale;
    }
    catch (error) {
        console.log(error);
        throw new Error("Ошибка при оформлении заказа");
    }
});
exports.createSaleFromCartService = createSaleFromCartService;
