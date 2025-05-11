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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const userService_1 = require("../services/userService");
const authorize_1 = require("../utils/authorize");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, authorize_1.authorize)(req, res, ["admin"]);
        if (!decoded) {
            return;
        }
        const users = yield (0, userService_1.getAllUsersService)();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Ошибка при получении пользователей" });
    }
});
exports.getAllUsers = getAllUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { login, password, roleName } = req.body;
        const decoded = (0, authorize_1.authorize)(req, res, ["admin"]);
        if (!decoded) {
            return;
        }
        const user = yield (0, userService_1.createUserService)(login, password, roleName);
        res.status(201).json(user);
        res.json();
    }
    catch (error) {
        res.status(500).json({ message: "Ошибка при создании пользователя" });
        console.log(error);
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, login, password, roleName } = req.body;
        const decoded = (0, authorize_1.authorize)(req, res, ["admin"]);
        if (!decoded) {
            return;
        }
        const user = yield (0, userService_1.updateUserService)(id, login, password, roleName);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Ошибка при обновлении пользователя" });
        console.log(error);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const decoded = (0, authorize_1.authorize)(req, res, ["admin"]);
        if (!decoded) {
            return;
        }
        const user = yield (0, userService_1.deleteUserService)(id);
        res.status(201).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ошибка при удалении пользователя" });
    }
});
exports.deleteUser = deleteUser;
