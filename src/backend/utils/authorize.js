"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const jwt_1 = require("./jwt");
const authorize = (req, res, allowedRoles) => {
    var _a, _b;
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "Токен не предоставлен" });
    }
    const decoded = (0, jwt_1.verifyToken)(token);
    if (!decoded) {
        return res.status(403).json({ message: "Неверный токен" });
    }
    const userRole = (_b = (_a = decoded.user) === null || _a === void 0 ? void 0 : _a.role) === null || _b === void 0 ? void 0 : _b.roleName;
    if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({
            message: `У вас нет прав для выполнения этой операции. Доступ разрешён только: ${allowedRoles.join(", ")}`,
        });
    }
    return decoded;
};
exports.authorize = authorize;
