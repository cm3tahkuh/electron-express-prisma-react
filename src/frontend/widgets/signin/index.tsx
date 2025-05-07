import { Button, Flex, Heading, TextField, Callout } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { login } from "@api/auth";
import { useState } from "react";
import useUserStore from "@store/userStore";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface LoginData {
  login: string;
  password: string;
}

interface DecodedUser {
  id: number;
  login: string;
  role: {
    roleName: string;
  };
}

export const SignIn: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    login: "",
    password: "",
  });

  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.login);

  const { mutate, error, data, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data: { message: string; token: string }) => {
      try {
        const decoded: { user: DecodedUser } = jwtDecode(data.token);
        switch (decoded.user.role.roleName) {
          case "customer":
            navigate("/catalog");
            break;
          case "admin":
          case "manager":
            navigate("/admin");
            break;
        }

        setUser(decoded.user, data.token);
      } catch (err) {
        console.error("Ошибка декодирования токена:", err);
      }
    },
  });

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    mutate(loginData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex
        direction="column"
        gap="2"
        style={{
          border: "1px solid #ededed",
          borderRadius: "10px",
          padding: "24px",
          boxShadow: "1px 4px 16px -7px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Heading as="h2" weight="medium">
          Вход
        </Heading>

        <TextField.Root
          size="3"
          placeholder="Логин"
          variant="classic"
          value={loginData.login}
          onChange={(event) =>
            setLoginData({ ...loginData, login: event.target.value })
          }
          required
        />
        <TextField.Root
          size="3"
          placeholder="Пароль"
          variant="classic"
          value={loginData.password}
          onChange={(event) =>
            setLoginData({ ...loginData, password: event.target.value })
          }
          required
        />
        <Button type="submit" variant="classic" disabled={isPending}>
          {isPending ? "Вход..." : "Войти"}
        </Button>

        {error && (
          <Callout.Root color="red">
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>{error.message}</Callout.Text>
          </Callout.Root>
        )}
        {data && (
          <Callout.Root color="green">
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>{data.message}</Callout.Text>
          </Callout.Root>
        )}
      </Flex>
    </form>
  );
};
