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
exports.logoutCustomer = exports.loginCustomer = exports.registerCustomer = void 0;
const authService_1 = require("../services/authService");
const registerCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { login, password } = req.body;
        const user = yield (0, authService_1.registerCustomerService)({ login, password });
        res.status(200).json({ message: "Вы успешно зарегестрированы в системе!" });
    }
    catch (error) {
        res.status(500).json({ message: "Ошибка при регистрации пользователя" });
        console.log(error);
    }
});
exports.registerCustomer = registerCustomer;
const loginCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password } = req.body;
    try {
        const { userExist, token } = yield (0, authService_1.loginCustomerService)({
            login,
            password,
        });
        res.status(200).json({ message: "Авторизация успешна", token });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.loginCustomer = loginCustomer;
const logoutCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, authService_1.logoutCustomerService)();
    res.status(200).json({ message: "Вы успешно вышли из системы" });
});
exports.logoutCustomer = logoutCustomer;
