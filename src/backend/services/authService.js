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
exports.logoutCustomerService = exports.loginCustomerService = exports.registerCustomerService = void 0;
const prisma_1 = require("../generated/prisma");
const jwt_1 = require("../utils/jwt");
const prisma = new prisma_1.PrismaClient();
const registerCustomerService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ login, password }) {
    const existUser = yield prisma.user.findUnique({ where: { login: login } });
    if (existUser) {
        throw new Error("Пользователь с таким именем существует");
    }
    const roleCustomer = yield prisma.role.findUnique({
        where: {
            roleName: "customer",
        },
    });
    if (!roleCustomer) {
        throw new Error("Роль не найдена!!!");
    }
    const addUser = yield prisma.user.create({
        data: {
            login,
            password,
            roleId: roleCustomer.id,
        },
    });
    const createCart = yield prisma.cart.create({
        data: {
            userId: addUser.id,
        },
    });
});
exports.registerCustomerService = registerCustomerService;
const loginCustomerService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ login, password }) {
    const userExist = yield prisma.user.findUnique({
        select: {
            id: true,
            login: true,
            password: false,
            role: {
                select: {
                    roleName: true,
                },
            },
        },
        where: {
            login: login,
            password: password,
            deletedAt: null,
        },
    });
    if (!userExist) {
        throw new Error("Неправильный логин или пароль");
    }
    const token = (0, jwt_1.generateToken)(userExist);
    return { userExist, token };
});
exports.loginCustomerService = loginCustomerService;
const logoutCustomerService = () => {
    return { message: "Вы успешно вышли из системы!" };
};
exports.logoutCustomerService = logoutCustomerService;
