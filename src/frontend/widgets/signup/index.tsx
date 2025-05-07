import { Button, Flex, Heading, TextField, Callout } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { register } from "@api/auth";
import { useState } from "react";

interface RegisterData {
  login: string;
  password: string;
}

export const SignUp: React.FC = () => {
  const [registerData, setRegisterData] = useState<RegisterData>({
    login: "",
    password: "",
  });

  const { mutate, data, error, isPending } = useMutation({
    mutationFn: register,
  });

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    mutate(registerData);
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
        <Heading as="h2" size="6" weight="medium">
          Регистрация
        </Heading>
        <TextField.Root
          value={registerData.login}
          size="3"
          placeholder="Логин"
          variant="classic"
          required
          onChange={(event) =>
            setRegisterData({ ...registerData, login: event.target.value })
          }
        />
        <TextField.Root
          value={registerData.password}
          size="3"
          placeholder="Пароль"
          variant="classic"
          required
          onChange={(event) =>
            setRegisterData({ ...registerData, password: event.target.value })
          }
        />
        <Button variant="classic" type="submit" disabled={isPending}>
          {isPending ? "Регистрирую..." : "Зарегестрироваться"}
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
