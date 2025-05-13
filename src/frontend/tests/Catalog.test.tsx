import { describe, expect, it, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithRouter } from "./utils/RenderWithRouter";

describe("📦 Полный сценарий покупки", () => {
  const login = `testCatalog_${Math.floor(Math.random() * 10000)}`;
  const password = "testpassword";

  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/");
    console.log("\n🔄 Очистка localStorage и возврат на /");
  });

  it("Ошибка при попытке входа с несуществующим логином", async () => {
    const fakeLogin = `wronguser_${Math.floor(Math.random() * 10000)}`;
    const password = "wrongpass";

    console.log(
      `❌✅ [Негативный тест] Попытка входа с несуществующим логином: ${fakeLogin}`
    );
    renderWithRouter("/auth");

    fireEvent.change(screen.getAllByPlaceholderText("Логин")[0], {
      target: { value: fakeLogin },
    });
    fireEvent.change(screen.getAllByPlaceholderText("Пароль")[0], {
      target: { value: password },
    });
    fireEvent.click(screen.getByRole("button", { name: /Войти/i }));

    const error = await screen.findByText(
      (text) =>
        text.toLowerCase().includes("ошибка") ||
        text.toLowerCase().includes("неверный логин") ||
        text.toLowerCase().includes("не найден")
    );
    expect(error).toBeInTheDocument();
    console.log("❌✅ Ошибка входа корректно отображена");
  });

  it("Ошибка при регистрации с уже существующим логином", async () => {
    const login = `existing_user_${Math.floor(Math.random() * 10000)}`;
    const password = "testpassword";

    renderWithRouter("/auth");

    console.log(`🧾 Первая регистрация пользователя: ${login}`);
    // Первая регистрация
    fireEvent.change(screen.getAllByPlaceholderText("Логин")[1], {
      target: { value: login },
    });
    fireEvent.change(screen.getAllByPlaceholderText("Пароль")[1], {
      target: { value: password },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Зарегестрироваться/i })
    );

    await screen.findByText((t) => t.includes("Вы успешно зарегестрированы"));
    console.log("✅ Первая регистрация успешна");

    // Повторная регистрация
    console.log(
      "❌✅ [Негативный тест] Повторная регистрация с тем же логином"
    );
    fireEvent.change(screen.getAllByPlaceholderText("Логин")[1], {
      target: { value: login },
    });
    fireEvent.change(screen.getAllByPlaceholderText("Пароль")[1], {
      target: { value: password },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Зарегестрироваться/i })
    );

    const error = await screen.findByText(
      (text) =>
        text.toLowerCase().includes("ошибка") ||
        text.toLowerCase().includes("логин занят")
    );
    expect(error).toBeInTheDocument();
    console.log(
      "✅[Негативный тест] Ошибка при повторной регистрации отображена"
    );
  });

  it("Входит, добавляет товары в корзину и оформляет покупку", async () => {
    console.log("🚀 Старт теста — переход на /auth");
    renderWithRouter("/auth");

    // 1. Регистрация
    console.log(`🧾 Регистрация нового пользователя: ${login}`);
    fireEvent.change(screen.getAllByPlaceholderText("Логин")[1], {
      target: { value: login },
    });
    fireEvent.change(screen.getAllByPlaceholderText("Пароль")[1], {
      target: { value: password },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Зарегестрироваться/i })
    );

    await screen.findByText((t) => t.includes("Вы успешно зарегестрированы"));
    console.log("✅ Успешная регистрация");

    // 2. Вход
    console.log("🔐 Вход под только что созданным пользователем");
    fireEvent.change(screen.getAllByPlaceholderText("Логин")[0], {
      target: { value: login },
    });
    fireEvent.change(screen.getAllByPlaceholderText("Пароль")[0], {
      target: { value: password },
    });
    fireEvent.click(screen.getByRole("button", { name: /Войти/i }));

    // 3. Переход в каталог
    await screen.findByTestId("search-input");
    console.log("📂 Переход в каталог — компонент поиска загружен");

    // 4. Добавление товаров
    const addButtons = await screen.findAllByRole("button", {
      name: /добавить в корзину/i,
    });
    expect(addButtons.length).toBeGreaterThan(1);
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[1]);
    console.log(`🛒 Добавлены товары в корзину (всего: ${addButtons.length})`);

    // 5. Переход в корзину
    const cartLink = screen.getByText((text) => text.includes("🛒"));
    fireEvent.click(cartLink);
    console.log("🧺 Переход в корзину");

    // 6. Оформление заказа
    const checkoutBtn = await screen.findByRole("button", {
      name: /Оформить покупку/i,
    });
    fireEvent.click(checkoutBtn);
    console.log("📦 Оформление заказа");

    // 7. Подтверждение
    await screen.findByText(/Вы успешно оформили заказ!/i);
    console.log("✅ Заказ успешно оформлен!");
  });
});
