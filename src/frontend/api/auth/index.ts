import apiConfig from "@api/routes";

export const register = async (credentials: {
  login: string;
  password: string;
}) => {
  const response = await fetch(apiConfig.auth.register, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Произошла ошибка регистрации");
  }

  return response.json();
};

export const login = async (credentials: {
  login: string;
  password: string;
}) => {
  const response = await fetch(apiConfig.auth.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Произошла ошибка авторизации");
  }

  return response.json();
};
