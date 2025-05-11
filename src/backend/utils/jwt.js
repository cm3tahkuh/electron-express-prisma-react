"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = "secretkeyhere";
function generateToken(user) {
    return jsonwebtoken_1.default.sign({ user }, SECRET_KEY, { expiresIn: "1h" });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, SECRET_KEY);
    }
    catch (err) {
        return null;
    }
}
