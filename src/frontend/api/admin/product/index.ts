import apiConfig from "@api/routes";
import { QueryFunctionContext } from "@tanstack/react-query";

export const getAllProducts = async ({ queryKey }: QueryFunctionContext) => {
  const [, token] = queryKey as [string, string];
  const response = await fetch(apiConfig.products.get, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Произошла ошибка получения товаров");
  }

  return response.json();
};

export const deleteProductById = async (id: number, token: string) => {
  const response = await fetch(apiConfig.products.delete, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `${token}`,
    },
    body: JSON.stringify({ id: id }),
  });
  if (!response.ok) {
    throw new Error("Произошла ошибка при удалении пользователя");
  }

  return response.json();
};

export const updateProductById = async (user: object, token: string) => {
  const response = await fetch(apiConfig.products.update, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `${token}`,
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Произошла ошибка при обновлении товара");
  }

  return response.json();
};

export const addNewProduct = async (user: object, token: string) => {
  const response = await fetch(apiConfig.products.create, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `${token}`,
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Произошла ошибка при добавлении товара");
  }

  return response.json();
};
