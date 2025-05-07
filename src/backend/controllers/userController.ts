import { Request, Response } from "express";
import {
  createUserService,
  deleteUserService,
  getAllUsersService,
  updateUserService,
} from "../services/userService";
import { authorize } from "../utils/authorize";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const decoded = authorize(req, res, ["admin"]);
    if (!decoded) {
      return;
    }

    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении пользователей" });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { login, password, roleName } = req.body;
    const decoded = authorize(req, res, ["admin"]);
    if (!decoded) {
      return;
    }

    const user = await createUserService(login, password, roleName);

    res.status(201).json(user);
    res.json();
  } catch (error) {
    res.status(500).json({ message: "Ошибка при создании пользователя" });
    console.log(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, login, password, roleName } = req.body;

    const decoded = authorize(req, res, ["admin"]);
    if (!decoded) {
      return;
    }

    const user = await updateUserService(id, login, password, roleName);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении пользователя" });
    console.log(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body;

    const decoded = authorize(req, res, ["admin"]);
    if (!decoded) {
      return;
    }
    const user = await deleteUserService(id);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ошибка при удалении пользователя" });
  }
};
