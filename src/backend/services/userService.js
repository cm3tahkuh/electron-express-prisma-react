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
exports.deleteUserService = exports.updateUserService = exports.createUserService = exports.getAllUsersService = void 0;
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const getAllUsersService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.findMany({
        where: { deletedAt: null },
        select: {
            id: true,
            login: true,
            password: true,
            role: {
                select: {
                    roleName: true,
                },
            },
            Cart: true,
        },
    });
});
exports.getAllUsersService = getAllUsersService;
const createUserService = (login, password, roleName) => __awaiter(void 0, void 0, void 0, function* () {
    const role = yield prisma.role.findUnique({ where: { roleName: roleName } });
    if (!role) {
        throw new Error(`Роль ${roleName} не существует.`);
    }
    // 2. Создать пользователя
    const user = yield prisma.user.create({
        data: {
            login,
            password,
            roleId: role.id,
        },
    });
    console.log(user);
    const cart = yield prisma.cart.create({
        data: {
            userId: user.id,
        },
    });
    console.log(cart);
    return { user, cart };
});
exports.createUserService = createUserService;
const updateUserService = (id, login, password, roleName) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield prisma.user.findUnique({
        where: {
            id: id,
        },
    });
    const existRole = yield prisma.role.findUnique({
        where: {
            roleName: roleName,
        },
    });
    if (!existUser) {
        throw new Error("Пользователь не найден");
    }
    if (!existRole) {
        throw new Error("Роль не найдена");
    }
    const updatedUser = yield prisma.user.update({
        where: {
            id: id,
        },
        data: {
            login: login,
            password: password,
            roleId: existRole.id,
        },
    });
    return updatedUser;
});
exports.updateUserService = updateUserService;
const deleteUserService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const cartIdToDelete = yield prisma.cart.findFirst({ where: { userId: id } });
    const deletedCartItems = yield prisma.cartItem.updateMany({
        where: { cartId: cartIdToDelete === null || cartIdToDelete === void 0 ? void 0 : cartIdToDelete.id },
        data: {
            deletedAt: new Date(),
        },
    });
    const deletedCart = yield prisma.cart.update({
        where: { id: cartIdToDelete === null || cartIdToDelete === void 0 ? void 0 : cartIdToDelete.id },
        data: { deletedAt: new Date() },
    });
    const deletedUser = yield prisma.user.update({
        where: { id: id },
        data: { deletedAt: new Date() },
    });
    return deletedUser;
});
exports.deleteUserService = deleteUserService;
