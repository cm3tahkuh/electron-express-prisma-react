import { Box, Heading, Flex, Tabs, Text } from "@radix-ui/themes";
import useUserStore from "@store/userStore";
import { ProductsPanel } from "@widgets/panels/productspanel";
import { SalesPanel } from "@widgets/panels/salespanel";
import { UsersPanel } from "@widgets/panels/userspanel";
import { useNavigate } from "react-router-dom";

export const AdminPanel: React.FC = () => {
  const logout = useUserStore((state) => state.logout);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
    // очищаем кэщ
  };

  if (!user || user.role.roleName === "customer") {
    return (
      <Heading style={{ padding: "70px 15px" }} size="9" align="center">
        Доступ запрещен.
      </Heading>
    );
  }

  const isAdmin = user.role.roleName === "admin";


  return (
    <Box p="4">
      <Flex mb="4" justify="between" align="center">
        <Heading>Админ-Панель</Heading>
        {user !== null ? (
          <Text onClick={handleLogout} style={{ cursor: "pointer" }}>
            Выйти
          </Text>
        ) : (
          <Text style={{ cursor: "pointer" }}>Войти</Text>
        )}
      </Flex>

      <Tabs.Root defaultValue={isAdmin ? "users" : "products"}>
        <Tabs.List>
        <Tabs.Trigger value="products">Товары</Tabs.Trigger>
        <Tabs.Trigger value="sales">История продаж</Tabs.Trigger>
          {isAdmin && <Tabs.Trigger value="users">Пользователи</Tabs.Trigger>}
        </Tabs.List>

        <Box pt="3">
          <Box>
          <Tabs.Content value="products">
              <ProductsPanel />
            </Tabs.Content>

            <Tabs.Content value="sales">
              <SalesPanel />
            </Tabs.Content>

            {isAdmin && (
              <Tabs.Content value="users">
                <UsersPanel />
              </Tabs.Content>
            )}
          </Box>
        </Box>
      </Tabs.Root>
    </Box>
  );
};
