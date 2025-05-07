import { Request, Response } from "express";
import {
  addToCartService,
  createSaleFromCartService,
  deleteFromCartByProductIdService,
  getUserCartService,
} from "../services/cartService";
import { verifyToken } from "../utils/jwt";

export const getUserCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.headers.authorization as string;

    if (!token) {
      res.status(401).json({ message: "Необходима авторизация" });
    }

    const verify = verifyToken(token);

    if (!verify) {
      res.status(403).json({ message: "Не валидный токен" });
    }

    const cart = await getUserCartService(token);
    res.json(cart);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: error.message || "Ошибка при получении корзины" });
  }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization as string;

  if (!token) {
    res.status(401).json({ message: "Необходима авторизация" });
  }

  const { productId } = req.body;

  if (!productId) {
    res.status(400).json({ message: "productId обязателен" });
  }

  try {
    const cartItem = await addToCartService({
      token,
      productId: Number(productId),
    });

    res.status(200).json(cartItem);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Ошибка добавления товара" });
  }
};

export const deleteFromCartByProductId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.headers.authorization as string;

  if (!token) {
    res.status(401).json({ message: "Необходима авторизация" });
  }

  const { productId } = req.body;

  if (!productId) {
    res.status(400).json({ message: "productId обязателен" });
  }

  try {
    const cartItem = await deleteFromCartByProductIdService({
      productId: Number(productId),
      token,
    });

    res.json(cartItem);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Ошибка добавления товара" });
  }
};

export const createSaleFromCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.headers.authorization as string;

  if (!token) {
    res.status(401).json({ message: "Необходима авторизация" });
  }

  try {
    const cartItem = await createSaleFromCartService(token);
    res.status(201).json(cartItem);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Ошибка добавления товара" });
  }
};
