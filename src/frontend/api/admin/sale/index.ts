import apiConfig from "@api/routes";
import { QueryFunctionContext } from "@tanstack/react-query";

export const getAllSales = async ({ queryKey }: QueryFunctionContext) => {
  const [, token] = queryKey as [string, string];
  const response = await fetch(apiConfig.sales.get, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Произошла ошибка получения продаж");
  }

  return response.json();
};

export const createSale = async (token: string) => {
  const response = await fetch(apiConfig.sales.createSale, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Произошла ошибка при оформлении заказа");
  }

  return response.json();
};
