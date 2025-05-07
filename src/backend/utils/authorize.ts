import { Request, Response } from "express";
import { verifyToken } from "./jwt";

export const authorize = (
  req: Request,
  res: Response,
  allowedRoles: string[]
) => {
  const token = req.headers["authorization"] as string;

  if (!token) {
    return res.status(401).json({ message: "Токен не предоставлен" });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ message: "Неверный токен" });
  }

  const userRole = decoded.user?.role?.roleName;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return res.status(403).json({
      message: `У вас нет прав для выполнения этой операции. Доступ разрешён только: ${allowedRoles.join(
        ", "
      )}`,
    });
  }

  return decoded;
};
