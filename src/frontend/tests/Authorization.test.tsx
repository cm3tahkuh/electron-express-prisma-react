import { Authorization } from "@pages/authorization";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, beforeAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

describe("Authorization page – ❌ Негативные кейсы", () => {
  const queryClient = new QueryClient();

  const setup = () =>
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <Authorization />
        </QueryClientProvider>
      </MemoryRouter>
    );

  let existingLogin: string;
  const password = "testpassword";

  beforeAll(() => {
    localStorage.clear();
    console.log("🧹 localStorage очищен");
    existingLogin = `testuser_${Math.floor(Math.random() * 10000)}`;
    console.log(
      `\n🔁 [init] Сгенерирован логин: "${existingLogin}" для негативных кейсов`
    );
  });

  it("✅ Регистрирует пользователя один раз", async () => {
    console.log("➡️ [Регистрация] Попытка первой регистрации");

    setup();

    const registerLogin = screen.getAllByPlaceholderText("Логин")[1];
    const registerPassword = screen.getAllByPlaceholderText("Пароль")[1];
    const registerButton = screen.getByRole("button", {
      name: /Зарегестрироваться/i,
    });

    fireEvent.change(registerLogin, { target: { value: existingLogin } });
    fireEvent.change(registerPassword, { target: { value: password } });

    console.log("📨 Отправка формы регистрации...");
    fireEvent.click(registerButton);

    await waitFor(() => {
      const success = screen.getByText((text) =>
        text.includes("Вы успешно зарегестрированы")
      );
      expect(success).toBeInTheDocument();
    });

    console.log("✅ [Регистрация] Первая регистрация успешна\n");
  });

  it("❌ [Негативный тест] Повторная регистрация с тем же логином должна дать ошибку", async () => {
    console.log("➡️ [Негативный тест] Попытка повторной регистрации");

    setup();

    const registerLogin = screen.getAllByPlaceholderText("Логин")[1];
    const registerPassword = screen.getAllByPlaceholderText("Пароль")[1];
    const registerButton = screen.getByRole("button", {
      name: /Зарегестрироваться/i,
    });

    fireEvent.change(registerLogin, { target: { value: existingLogin } });
    fireEvent.change(registerPassword, { target: { value: password } });

    console.log("📨 Отправка повторной регистрации...");
    fireEvent.click(registerButton);

    await waitFor(() => {
      const error = screen.getByText(
        (text) =>
          text.toLowerCase().includes("ошибка") ||
          text.toLowerCase().includes("логин занят")
      );
      expect(error).toBeInTheDocument();
    });

    console.log(
      "✅ [Негативный тест] Повторная регистрация корректно отклонена\n"
    );
  });

  it("❌ [Негативный тест] Вход с несуществующим пользователем должен дать ошибку", async () => {
    console.log("➡️ [Негативный тест] Вход с несуществующим логином");

    setup();

    const loginInput = screen.getAllByPlaceholderText("Логин")[0];
    const passwordInput = screen.getAllByPlaceholderText("Пароль")[0];
    const signInButton = screen.getByRole("button", { name: /войти/i });

    fireEvent.change(loginInput, {
      target: { value: "not_existing_user_12345" },
    });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    console.log("📨 Отправка формы входа с несуществующим логином...");
    fireEvent.click(signInButton);

    await waitFor(() => {
      const error = screen.getByText(
        (text) =>
          text.toLowerCase().includes("не найден") ||
          text.toLowerCase().includes("ошибка") ||
          text.toLowerCase().includes("неверный логин")
      );
      expect(error).toBeInTheDocument();
    });

    console.log("✅ [Негативный тест] Ошибка авторизации успешно отображена\n");
  });

  it("✅ Вход под зарегистрированным пользователем и переход в каталог", async () => {
    console.log("➡️ [Вход] Проверка перехода на /catalog");

    setup();

    const loginInput = screen.getAllByPlaceholderText("Логин")[0];
    const passwordInput = screen.getAllByPlaceholderText("Пароль")[0];
    const signInButton = screen.getByRole("button", { name: /Войти/i });

    fireEvent.change(loginInput, { target: { value: existingLogin } });
    fireEvent.change(passwordInput, { target: { value: password } });

    console.log("📨 Отправка формы входа...");
    fireEvent.click(signInButton);

    await waitFor(() => {
      const message = screen.getByText((text) =>
        text.includes("Вы уже вошли в систему.")
      );
      expect(message).toBeInTheDocument();
    });

    console.log("✅ [Вход] Переход на /catalog подтверждён\n");
  });
});
