import { addNewCartItem } from "@api/cart";
import { getAllProductsByFilter } from "@api/product";
import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  Callout,
  Dialog,
  Heading,
} from "@radix-ui/themes";
import useUserStore from "@store/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CardProduct } from "@widgets/card";
import { Filters } from "@widgets/filters";
import { Search } from "@widgets/search";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export const Catalog: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const token = useUserStore((state) => state.token) as string;
  const user = useUserStore((state) => state.user);

  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    condition: "new",
    searchQuery: "",
  });

  const [debouncedFilters] = useDebounce(filters, 300);

  // Запрос с фильтрами
  const { data, isLoading } = useQuery({
    queryKey: ["products", token, debouncedFilters],
    queryFn: getAllProductsByFilter,
  });

  // Добавление товара
  const addMutation = useMutation({
    mutationFn: ({ productId, token }: { productId: number; token: string }) =>
      addNewCartItem(productId, token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  useEffect(() => {
    if (addMutation.isSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (addMutation.isError) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [addMutation.isSuccess, addMutation.isError]);

  const handleFilterChange = (
    newPriceRange: Array<number>,
    condition: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: newPriceRange,
      condition,
    }));
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: value,
    }));
  };

  return (
    <Box>
      <Container size="4">
        <Flex justify="between">
          <Box px="5">
            <Filters onChange={handleFilterChange} />
          </Box>
          <Flex direction="column" gap="20px" width="70%" px="5">
            <Search onChange={handleSearchChange} />
            {isLoading ? (
              <Heading>Загрузка</Heading>
            ) : (
              <Flex wrap="wrap" gap="37.6px">
                {data.length === 0 ? (
                  <Heading>Товары не найдены.</Heading>
                ) : (
                  data?.map((product: any) => {
                    return (
                      <Flex key={product.id} direction="column" gap="2">
                        <div>
                          <Dialog.Root>
                            <Dialog.Trigger>
                              <button
                                style={{
                                  background: "none",
                                  border: "none",
                                  outline: "none",
                                }}
                              >
                                <CardProduct
                                  title={product.name}
                                  description={product.description}
                                  price={product.price}
                                  quantity={product.quantity}
                                  image={product.image}
                                />
                              </button>
                            </Dialog.Trigger>

                            <Dialog.Content maxWidth="450px">
                              <img
                                style={{
                                  maxWidth: "100%",
                                  marginBottom: "20px",
                                }}
                                src={product.image}
                                alt={product.name}
                              />
                              <Dialog.Title>{product.name}</Dialog.Title>
                              <Dialog.Description size="3" mb="4">
                                {product.description}
                              </Dialog.Description>
                              <Flex direction="column">
                                <Text size="4">
                                  Количество:
                                  <Text size="5" weight="bold">
                                    {product.quantity} шт.
                                  </Text>
                                </Text>
                                <Text size="4">
                                  Цена:
                                  <Text size="5" weight="bold">
                                    {product.price} ₽
                                  </Text>
                                </Text>
                              </Flex>
                              <Flex gap="3" mt="4" justify="end">
                                <Dialog.Close>
                                  <Button variant="classic">Закрыть</Button>
                                </Dialog.Close>
                              </Flex>
                            </Dialog.Content>
                          </Dialog.Root>
                        </div>
                        {user && (
                          <Button
                            variant="classic"
                            onClick={() => {
                              if (product.id && token) {
                                addMutation.mutate({
                                  productId: product.id,
                                  token: token,
                                });
                              }
                            }}
                          >
                            Добавить в корзину
                          </Button>
                        )}
                      </Flex>
                    );
                  })
                )}
              </Flex>
            )}
          </Flex>
          <Flex
            direction="column"
            gap="2"
            style={{
              position: "absolute",
              bottom: 0,
              margin: "24px",
              transition: "all 0.2s ease",
            }}
          >
            {showSuccess && (
              <Callout.Root color="lime">
                <Callout.Icon>
                  <InfoCircledIcon />
                </Callout.Icon>
                <Callout.Text>Товар успешно добавлен в корзину</Callout.Text>
              </Callout.Root>
            )}
            {showError && (
              <Callout.Root color="red">
                <Callout.Icon>
                  <InfoCircledIcon />
                </Callout.Icon>
                <Callout.Text>{addMutation.error?.message}</Callout.Text>
              </Callout.Root>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
