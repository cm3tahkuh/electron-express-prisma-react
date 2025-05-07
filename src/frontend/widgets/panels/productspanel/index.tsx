import {
  addNewProduct,
  deleteProductById,
  updateProductById,
} from "@api/admin/product";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  DataList,
  Dialog,
  TextField,
  Text,
  AlertDialog,
  ContextMenu,
} from "@radix-ui/themes";
import useUserStore from "@store/userStore";
import { getAllProducts } from "@api/admin/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

export const ProductsPanel: React.FC = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<any | null>({
    id: null,
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    image: "",
  });
  const [addProduct, setAddProduct] = useState<any>({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    image: "",
  });
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const token = useUserStore((state) => state.token);

  const queryClient = useQueryClient();

  // получение товара
  const { data } = useQuery({
    queryKey: ["products", token],
    queryFn: getAllProducts,
  });

  // удаление товара
  const deleteMutation = useMutation({
    mutationFn: ({ id, token }: { id: number; token: string }) =>
      deleteProductById(id, token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // обновление товара
  const updateMutation = useMutation({
    mutationFn: ({
      editProduct,
      token,
    }: {
      editProduct: object;
      token: string;
    }) => updateProductById(editProduct, token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] }); // обновляем кэш после изменения
    },
  });

  // добавление товара
  const addMutation = useMutation({
    mutationFn: ({
      addProduct,
      token,
    }: {
      addProduct: object;
      token: string;
    }) => addNewProduct(addProduct, token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return (
    <>
      <Flex gap="5" align="center" mb="5" justify="between">
        <Heading as="h2">Панель товаров</Heading>
        <Dialog.Root>
          <Dialog.Trigger>
            <Button variant="classic">Добавить</Button>
          </Dialog.Trigger>

          <Dialog.Content maxWidth="450px">
            <Dialog.Title mb="4">Добавить новый товар</Dialog.Title>
            <Dialog.Description></Dialog.Description>
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Название
                </Text>
                <TextField.Root
                  variant="classic"
                  value={addProduct?.name}
                  onChange={(event) =>
                    setAddProduct((prev: any) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Описание
                </Text>
                <TextField.Root
                  variant="classic"
                  value={addProduct?.description}
                  onChange={(event) =>
                    setAddProduct((prev: any) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Цена
                </Text>
                <TextField.Root
                  type="number"
                  variant="classic"
                  value={addProduct?.price}
                  onChange={(event) =>
                    setAddProduct((prev: any) => ({
                      ...prev,
                      price: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Количество
                </Text>
                <TextField.Root
                  type="number"
                  variant="classic"
                  value={addProduct?.quantity}
                  onChange={(event) =>
                    setAddProduct((prev: any) => ({
                      ...prev,
                      quantity: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Изображение
                </Text>
                <TextField.Root
                  variant="classic"
                  value={addProduct?.image}
                  onChange={(event) =>
                    setAddProduct((prev: any) => ({
                      ...prev,
                      image: event.target.value,
                    }))
                  }
                />
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
                    if (addProduct && token) {
                      addMutation.mutate({ addProduct, token });
                      setAddProduct({
                        name: "",
                        description: "",
                        price: 0,
                        quantity: 0,
                        image: "",
                      });
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
            <Dialog.Title mb="4">Изменить существующий товар</Dialog.Title>
            <Dialog.Description></Dialog.Description>
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Название
                </Text>
                <TextField.Root
                  variant="classic"
                  value={editProduct?.name}
                  onChange={(event) =>
                    setEditProduct((prev: any) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Описание
                </Text>
                <TextField.Root
                  variant="classic"
                  value={editProduct?.description}
                  onChange={(event) =>
                    setEditProduct((prev: any) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Цена
                </Text>
                <TextField.Root
                  variant="classic"
                  value={editProduct?.price}
                  onChange={(event) =>
                    setEditProduct((prev: any) => ({
                      ...prev,
                      price: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Количество
                </Text>
                <TextField.Root
                  variant="classic"
                  value={editProduct?.quantity}
                  onChange={(event) =>
                    setEditProduct((prev: any) => ({
                      ...prev,
                      quantity: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Изображение
                </Text>
                <TextField.Root
                  variant="classic"
                  value={editProduct?.image}
                  onChange={(event) =>
                    setEditProduct((prev: any) => ({
                      ...prev,
                      image: event.target.value,
                    }))
                  }
                />
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
                    if (editProduct && token) {
                      updateMutation.mutate({ editProduct, token });
                      setEditProduct({
                        name: "",
                        description: "",
                        price: 0,
                        quantity: 0,
                        image: "",
                      });
                    }
                  }}
                >
                  Изменить
                </Button>
              </Dialog.Close>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
        <AlertDialog.Root open={deleteModal} onOpenChange={setDeleteModal}>
          <AlertDialog.Content maxWidth="450px">
            <AlertDialog.Title>Удаление товара</AlertDialog.Title>
            <AlertDialog.Description size="2">
              Вы уверены что хотите удалить товар?
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
                    if (deleteProductId && token) {
                      deleteMutation.mutate({ id: deleteProductId, token });
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
      <Box style={{ overflowY: "auto" }}>
        <Flex gap="4" direction="column">
          {data?.map((product: Product) => (
            <ContextMenu.Root key={product.id}>
              <ContextMenu.Trigger>
                <Card>
                  <Flex
                    style={{ padding: "24px" }}
                    gap="8"
                    justify="center"
                    align="center"
                  >
                    <img
                      style={{ maxWidth: "20%", objectFit: "cover" }}
                      src={product.image}
                    />
                    <Card style={{ padding: "24px" }}>
                      <DataList.Root>
                        <DataList.Item>
                          <DataList.Label minWidth="122px">
                            Название
                          </DataList.Label>
                          <DataList.Value>{product.name}</DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                          <DataList.Label minWidth="122px">
                            Описание
                          </DataList.Label>
                          <DataList.Value>{product.description}</DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                          <DataList.Item>
                            <DataList.Label minWidth="122px">
                              Цена
                            </DataList.Label>
                            <DataList.Value>{product.price}</DataList.Value>
                          </DataList.Item>
                          <DataList.Label minWidth="122px">
                            Количество
                          </DataList.Label>
                          <DataList.Value>{product.quantity}</DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                          <DataList.Label minWidth="122px">
                            Изображение
                          </DataList.Label>
                          <DataList.Value>{product.image}</DataList.Value>
                        </DataList.Item>
                      </DataList.Root>
                    </Card>
                  </Flex>
                </Card>
              </ContextMenu.Trigger>
              <ContextMenu.Content variant="solid">
                <Text>{product.id}</Text>
                <ContextMenu.Item
                  onClick={() => {
                    setEditProduct({
                      id: product.id,
                      name: product.name,
                      description: product.description,
                      price: product.price,
                      quantity: product.quantity,
                      image: product.image,
                    });
                    setModal(true);
                  }}
                  shortcut="✎"
                >
                  Изменить
                </ContextMenu.Item>
                <ContextMenu.Item
                  onClick={() => {
                    setDeleteModal(true);
                    setDeleteProductId(product.id);
                  }}
                  shortcut="⌫"
                  color="red"
                >
                  Удалить
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu.Root>
          ))}
        </Flex>
      </Box>
    </>
  );
};
