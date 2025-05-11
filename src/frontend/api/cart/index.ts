import apiConfig from "@api/routes";
import { QueryFunctionContext } from "@tanstack/react-query";

export const getCartByUserId = async ({ queryKey }: QueryFunctionContext) => {
  const [, token] = queryKey as [string, string];
  const response = await fetch(apiConfig.carts.getUserCart, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Произошла ошибка загрузки корзины пользователя");
  }

  return response.json();
};

export const addNewCartItem = async (productId: number, token: string) => {
  const response = await fetch(apiConfig.carts.addToCart, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `${token}`,
    },
    body: JSON.stringify({ productId: productId }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    const errorMessage =
      errorData.message || `Ошибка с кодом ${response.status}`;

    throw new Error(errorMessage);
  }

  return response.json();
};

export const deleteCartItem = async (productId: number, token: string) => {
  const response = await fetch(apiConfig.carts.deleteFromCart, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `${token}`,
    },
    body: JSON.stringify({ productId: productId }),
  });
  if (!response.ok) {
    throw new Error("Произошла ошибка при удалении товара из корзины");
  }

  return response.json();
};
