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
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const roles = ["admin", "manager", "customer"];
    for (const roleName of roles) {
        const existingRole = yield prisma.role.findUnique({
            where: { roleName: roleName },
        });
        if (!existingRole) {
            yield prisma.role.create({
                data: {
                    roleName: roleName,
                },
            });
            console.log(`Роль "${roleName}" создана.`);
        }
    }
    const adminLogin = "admin";
    const adminPassword = "admin";
    const adminRole = yield prisma.role.findUnique({
        where: { roleName: "admin" },
    });
    const existingAdmin = yield prisma.user.findUnique({
        where: { login: adminLogin },
    });
    if (!existingAdmin && adminRole) {
        yield prisma.user.create({
            data: {
                login: adminLogin,
                password: adminPassword,
                roleId: adminRole.id,
            },
        });
        console.log("Админ создан.");
    }
});
exports.default = init;
