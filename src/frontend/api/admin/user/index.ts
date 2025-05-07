import apiConfig from "@api/routes";
import { QueryFunctionContext } from "@tanstack/react-query";

export const getAllUsers = async ({ queryKey }: QueryFunctionContext) => {
  const [, token] = queryKey as [string, string];
  const response = await fetch(apiConfig.users.get, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `${token}`,
    },
  });
  

  if (!response.ok) {
    throw new Error("Произошла ошибка получения пользователей");
  }

  return response.json();
};

export const deleteUserById = async (id: number, token: string) => {
  const response = await fetch(apiConfig.users.delete, {
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

export const updateUserById = async (user: object, token: string) => {
  const response = await fetch(apiConfig.users.update, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `${token}`,
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Произошла ошибка при обновлении пользователя");
  }

  return response.json();
};

export const addNewUser = async (user: object, token: string) => {
  const response = await fetch(apiConfig.users.create, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `${token}`,
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Произошла ошибка при добавлении пользователя");
  }

  return response.json();
};
