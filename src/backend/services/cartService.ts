import jwt from "jsonwebtoken";
import { PrismaClient } from "../generated/prisma";
import { verifyToken } from "../utils/jwt";

const prisma = new PrismaClient();

export const getUserCartService = async (token: string) => {
  try {
    const decoded = verifyToken(token) as {
      user: { id: number };
    };
    const userId = decoded.user.id;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        CartItem: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return { items: [] };
    }

    return {
      items: cart.CartItem.map((item: any) => ({
        id: item.id,
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
      })),
    };
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка получения корзины");
  }
};

export const addToCartService = async ({
  productId,
  token,
}: {
  productId: number;
  token: string;
}) => {
  try {
    const decoded = verifyToken(token) as {
      user: { id: number };
    };

    const userId = decoded.user.id;

    let cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      throw new Error("Пользователь не имеет права совершать покупки");
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        productId: productId,
        cartId: cart.id,
      },
    });

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (existingItem && existingProduct) {
      if (existingItem.quantity + 1 > existingProduct.quantity) {
        throw new Error("Вы добавили предел товара в вашу корзину");
      }

      const updatedItem = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + 1,
        },
      });
      return updatedItem;
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        productId: productId,
        cartId: cart.id,
        quantity: 1,
      },
    });

    return cartItem;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const deleteFromCartByProductIdService = async ({
  productId,
  token,
}: {
  productId: number;
  token: string;
}) => {
  try {
    const decoded = verifyToken(token) as {
      user: { id: number };
    };
    const userId = decoded.user.id;

    console.log(decoded);

    const cart = await prisma.cart.findFirst({ where: { userId: userId } });

    if (!cart) {
      throw new Error("Корзины не существует");
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (!cartItem) {
      throw new Error("Товар не найден в корзине");
    }

    return await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при удалении товара из корзины");
  }
};

export const createSaleFromCartService = async (token: string) => {
  try {
    const decoded = verifyToken(token) as {
      user: { id: number };
    };
    const userId = decoded.user.id;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        CartItem: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.CartItem.length === 0) {
      throw new Error("Корзина пуста или не найдена");
    }

    const totalPrice = cart.CartItem.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );

    // Создаем запись о продаже
    const sale = await prisma.sale.create({
      data: {
        userId,
        totalPrice,
        SaleItem: {
          create: cart.CartItem.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    for (const item of cart.CartItem) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    await prisma.cart.update({
      where: { userId },
      data: { CartItem: { deleteMany: {} } },
    });

    return sale;
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при оформлении заказа");
  }
};
