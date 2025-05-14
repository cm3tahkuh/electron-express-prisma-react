import { describe, expect, it, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithRouter } from "./utils/RenderWithRouter";
import useUserStore from "@store/userStore";

const adminLogin = "admin";
const adminPassword = "admin";

beforeEach(() => {
  localStorage.clear();
  useUserStore.getState().logout();
  window.history.pushState({}, "", "/");
  window.HTMLElement.prototype.scrollIntoView = () => {};
  console.log("\n🔄 Очистка localStorage и возврат на /");
});

describe("🛠️ Тесты админ-панели", () => {
  it("❌ [Негативный тест] Ошибка при неверном пароле", async () => {
    renderWithRouter("/auth");

    fireEvent.change(screen.getAllByPlaceholderText("Логин")[0], {
      target: { value: adminLogin },
    });
    fireEvent.change(screen.getAllByPlaceholderText("Пароль")[0], {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: /войти/i }));

    await screen.findByText((t) => t.toLowerCase().includes("ошибка"));
  });

  it("❌ [Негативный тест] Доступ к /admin без входа — запрещён", async () => {
    renderWithRouter("/admin");

    await screen.findByText(/доступ запрещен/i);
  });

  it("✅ Успешный вход админа и отображение вкладок", async () => {
    renderWithRouter("/auth");

    fireEvent.change(screen.getAllByPlaceholderText("Логин")[0], {
      target: { value: adminLogin },
    });
    fireEvent.change(screen.getAllByPlaceholderText("Пароль")[0], {
      target: { value: adminPassword },
    });
    fireEvent.click(screen.getByRole("button", { name: /войти/i }));

    await screen.findByText("Админ-Панель");

    await screen.findByRole("tab", { name: /Товары/i });
    await screen.findByRole("tab", { name: /История продаж/i });
    await screen.findByRole("tab", { name: /Пользователи/i });
  });

  it("✅ Добавление и изменение пользователя", async () => {
    renderWithRouter("/auth");

    // Вход под админом
    fireEvent.change(screen.getAllByPlaceholderText("Логин")[0], {
      target: { value: adminLogin },
    });
    fireEvent.change(screen.getAllByPlaceholderText("Пароль")[0], {
      target: { value: adminPassword },
    });
    fireEvent.click(screen.getByRole("button", { name: /войти/i }));

    // Ожидаем отображение панели
    await screen.findByText("Админ-Панель");

    const usersTab = await screen.findByRole("tab", { name: /Пользователи/i });
    fireEvent.click(usersTab);

    await screen.findByText("Панель пользователей");

    // Теперь находим кнопку "Добавить" в пределах панели пользователей
    const userAddBtn = await screen.findByRole("button", {
      name: /^добавить$/i,
    });
    fireEvent.click(userAddBtn);

    // Заполняем форму
    fireEvent.change(await screen.findByLabelText("Логин"), {
      target: { value: "testuser" },
    });
    fireEvent.change(await screen.findByLabelText("Пароль"), {
      target: { value: "12345" },
    });

    // Выбор роли через Radix Select
    const roleSelect = screen.getByRole("combobox");
    fireEvent.click(roleSelect);

    const managerOption = await screen.findByText((text) =>
      text.toLowerCase().includes("менеджер")
    );
    fireEvent.click(managerOption);

    // Сохраняем
    fireEvent.click(screen.getByRole("button", { name: /сохранить/i }));

    // Проверяем, что пользователь появился в таблице
    await screen.findByText("testuser");

    // Правый клик по строке и редактирование
    fireEvent.contextMenu(screen.getByText("testuser"));
    fireEvent.click(screen.getByText("Изменить"));

    await waitFor(() => {
      expect(screen.getByLabelText("Логин")).toHaveValue("testuser");
    });

    fireEvent.change(screen.getByLabelText("Пароль"), {
      target: { value: "54321" },
    });

    fireEvent.click(screen.getByRole("button", { name: /добавить/i }));

    // Проверяем обновление пароля (если отображается)
    await screen.findByText("54321");
  });
});
