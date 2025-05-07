import {
  Card,
  Heading,
  Table,
  Text,
  ContextMenu,
  Button,
  Dialog,
  TextField,
  Flex,
  Select,
  AlertDialog,
  Box,
  Spinner,
} from "@radix-ui/themes";
import { useState } from "react";
import {
  addNewUser,
  deleteUserById,
  getAllUsers,
  updateUserById,
} from "@api/admin/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useUserStore from "@store/userStore";
import { Callout } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";

interface User {
  id: number;
  login: string;
  password: string;
  role: {
    roleName: string;
  };
}

export const UsersPanel: React.FC = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [addUser, setAddUser] = useState<any | null>({
    login: "",
    password: "",
    roleName: "customer",
  });
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [userDeleteId, setUserDeleteId] = useState<number | null>(null);

  const token = useUserStore((state) => state.token);

  const queryClient = useQueryClient();

  // получение пользователей
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", token],
    queryFn: getAllUsers,
  });

  // удаление пользователей
  const deleteMutation = useMutation({
    mutationFn: ({ id, token }: { id: number; token: string }) =>
      deleteUserById(id, token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // обновление пользователей
  const updateMutation = useMutation({
    mutationFn: ({ editUser, token }: { editUser: object; token: string }) =>
      updateUserById(editUser, token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] }); // обновляем кэш после изменения
    },
  });

  const addMutation = useMutation({
    mutationFn: ({ addUser, token }: { addUser: object; token: string }) =>
      addNewUser(addUser, token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (isLoading) {
    return <Spinner size="3" />;
  }

  if (isError) {
    return (
      <Callout.Root color="red">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>{error.message}</Callout.Text>
      </Callout.Root>
    );
  }

  return (
    <Box>
      <Flex gap="4" mb="2" justify="between">
        <Heading as="h2">Панель пользователей</Heading>
        <Dialog.Root>
          <Dialog.Trigger>
            <Button variant="classic">Добавить</Button>
          </Dialog.Trigger>

          <Dialog.Content maxWidth="450px">
            <Dialog.Title mb="4">Добавить нового пользователя</Dialog.Title>
            <Dialog.Description></Dialog.Description>
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Логин
                </Text>
                <TextField.Root
                  variant="classic"
                  value={addUser?.login}
                  onChange={(event) => {
                    setAddUser((prev: any) => ({
                      ...prev,
                      login: event.target.value,
                    }));
                  }}
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Пароль
                </Text>
                <TextField.Root
                  variant="classic"
                  value={addUser?.password}
                  onChange={(event) => {
                    setAddUser((prev: any) => ({
                      ...prev,
                      password: event.target.value,
                    }));
                  }}
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Роль
                </Text>
                <Select.Root
                  value={addUser?.roleName}
                  onValueChange={(newRole) => {
                    setAddUser((prev: any) => ({ ...prev, roleName: newRole }));
                  }}
                >
                  <Select.Trigger variant="classic" />
                  <Select.Content variant="solid">
                    <Select.Group>
                      <Select.Label>Роль</Select.Label>
                      <Select.Item value="customer">Пользователь</Select.Item>

                      <Select.Item value="manager">Менеджер</Select.Item>

                      <Select.Item value="admin">Администратор</Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </label>
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="classic" color="gray">
                  Отменить
                </Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button
                  variant="classic"
                  onClick={() => {
                    if (addUser && token) {
                      addMutation.mutate({ addUser, token });
                      setAddUser(null);
                    }
                  }}
                >
                  Сохранить
                </Button>
              </Dialog.Close>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
        <Dialog.Root open={modal} onOpenChange={setModal}>
          <Dialog.Content aria-label="Изменить пользователя" maxWidth="450px">
            <Dialog.Title mb="4">
              Изменить существующего пользователя
            </Dialog.Title>
            <Dialog.Description></Dialog.Description>
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Логин
                </Text>
                <TextField.Root
                  variant="classic"
                  value={editUser?.login}
                  onChange={(event) =>
                    setEditUser((prev: any) => ({
                      ...prev,
                      login: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Пароль
                </Text>
                <TextField.Root
                  variant="classic"
                  value={editUser?.password}
                  onChange={(event) =>
                    setEditUser((prev: any) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Роль
                </Text>
                <Select.Root
                  value={editUser?.roleName}
                  onValueChange={(newRole) =>
                    setEditUser((prev: any) => ({
                      ...prev,
                      roleName: newRole,
                    }))
                  }
                >
                  <Select.Trigger variant="classic" />
                  <Select.Content variant="solid">
                    <Select.Group>
                      <Select.Label>Роль</Select.Label>
                      <Select.Item value="customer">Покупатель</Select.Item>

                      <Select.Item value="manager">Менеджер</Select.Item>

                      <Select.Item value="admin">Администратор</Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </label>
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="classic" color="gray">
                  Отменить
                </Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button
                  onClick={() => {
                    if (editUser && token) {
                      updateMutation.mutate({ editUser, token });
                      setEditUser(null);
                    }
                  }}
                  variant="classic"
                >
                  Добавить
                </Button>
              </Dialog.Close>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
        <AlertDialog.Root open={deleteModal} onOpenChange={setDeleteModal}>
          <AlertDialog.Content maxWidth="450px">
            <AlertDialog.Title>Удаление пользователя</AlertDialog.Title>
            <AlertDialog.Description size="2">
              Вы уверены что хотите удалить пользователя?
            </AlertDialog.Description>

            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel>
                <Button variant="classic" color="gray">
                  Отменить
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button
                  variant="classic"
                  color="red"
                  onClick={() => {
                    if (userDeleteId && token) {
                      deleteMutation.mutate({ id: userDeleteId, token });
                      setUserDeleteId(null);
                      setDeleteModal(false);
                    }
                  }}
                >
                  Удалить
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </Flex>
      <Card style={{ padding: "24px" }} variant="classic">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>
                <Text weight="bold">Идентификатор</Text>
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <Text weight="bold">Логин</Text>
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <Text weight="bold">Пароль</Text>
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <Text weight="bold">Роль</Text>
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data?.map((user: User) => (
              <ContextMenu.Root key={user.id}>
                <ContextMenu.Trigger>
                  <Table.Row>
                    <Table.RowHeaderCell>{user.id}</Table.RowHeaderCell>
                    <Table.Cell>{user.login}</Table.Cell>
                    <Table.Cell>{user.password}</Table.Cell>
                    <Table.Cell>{user.role.roleName}</Table.Cell>
                  </Table.Row>
                </ContextMenu.Trigger>

                <ContextMenu.Content variant="solid">
                  <Text>{user.id}</Text>
                  <ContextMenu.Item
                    onClick={() => {
                      setEditUser({
                        id: user.id,
                        login: user.login,
                        password: user.password,
                        roleName: user.role.roleName,
                      });
                      setModal(true);
                    }}
                    shortcut="✎"
                  >
                    Изменить
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    onClick={() => {
                      setUserDeleteId(user.id);
                      setDeleteModal(true);
                    }}
                    shortcut="⌫"
                    color="red"
                  >
                    Удалить
                  </ContextMenu.Item>
                </ContextMenu.Content>
              </ContextMenu.Root>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
};
