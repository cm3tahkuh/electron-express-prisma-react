import { Request, Response } from "express";
import {
  loginCustomerService,
  logoutCustomerService,
  registerCustomerService,
} from "../services/authService";

export const registerCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { login, password } = req.body;
    const user = await registerCustomerService({ login, password });
    res.status(200).json({ message: "Вы успешно зарегестрированы в системе!" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при регистрации пользователя" });
    console.log(error);
  }
};

export const loginCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { login, password } = req.body;

  try {
    const { userExist, token } = await loginCustomerService({
      login,
      password,
    });
    res.status(200).json({ message: "Авторизация успешна", token });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const logoutCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  await logoutCustomerService();
  res.status(200).json({ message: "Вы успешно вышли из системы" });
};
