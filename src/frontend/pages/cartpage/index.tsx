import { createSale } from "@api/admin/sale";
import { deleteCartItem, getCartByUserId } from "@api/cart";
import {
  Box,
  Button,
  Callout,
  Container,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";
import useUserStore from "@store/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CardProduct } from "@widgets/card";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export const CartPage: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const token = useUserStore((state) => state.token);

  const user = useUserStore((state) => state.user);

  const queryClient = useQueryClient();

  // получение товара
  const { data, isLoading } = useQuery({
    queryKey: ["cart", token],
    queryFn: getCartByUserId,
  });

  // оформление заявки
  const createMutation = useMutation({
    mutationFn: ({ token }: { token: string }) => createSale(token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  useEffect(() => {
    if (createMutation.isSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [createMutation.isSuccess]);

  // удаление товара
  const deleteMutation = useMutation({
    mutationFn: ({ productId, token }: { productId: number; token: string }) =>
      deleteCartItem(productId, token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  if (!user) {
    return (
      <Heading align="center" as="h2">
        Войдите в систему для просмотра корзины.
      </Heading>
    );
  }

  if (data?.items.length === 0) {
    return (
      <>
        {showSuccess && (
          <Callout.Root
            style={{
              position: "absolute",
              bottom: 0,
              margin: "24px",
            }}
            color="lime"
          >
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>Вы успешно оформили заказ!</Callout.Text>
          </Callout.Root>
        )}
        <Heading align="center" as="h2">
          Корзина пуста.
        </Heading>
      </>
    );
  }

  return (
    <Box>
      {isLoading ? (
        <Heading mb="2" align="center" size="8" as="h1">
          Корзина
        </Heading>
      ) : (
        <>
          <Heading mb="2" align="center" size="8" as="h1">
            Корзина
          </Heading>
          <Text as="p" align="center" weight="medium">
            Ваши покупки, {user?.login}
          </Text>
          <Box>
            <Container size="4">
              <Flex gap="5" align="center" justify="center" p="5" wrap="wrap">
                {data?.items.map((product: any) => (
                  <Flex key={product.id} direction="column" gap="2">
                    <CardProduct
                      title={product.name}
                      description={product.description}
                      price={product.price}
                      quantity={product.quantity}
                      image={product.image}
                    />

                    <Button
                      onClick={() => {
                        if (product.id && token) {
                          deleteMutation.mutate({
                            productId: product.productId,
                            token: token,
                          });
                        }
                      }}
                      color="red"
                      variant="classic"
                    >
                      Удалить
                    </Button>
                  </Flex>
                ))}
              </Flex>
            </Container>
            <Button
              variant="classic"
              style={{
                position: "fixed",
                bottom: "0",
                width: "100%",
                padding: "24px",
              }}
              onClick={() => {
                if (token) {
                  createMutation.mutate({ token: token });
                }
              }}
            >
              Оформить покупку
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};
