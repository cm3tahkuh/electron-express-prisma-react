import { getAllSales } from "@api/admin/sale";
import {
  Box,
  Heading,
  Flex,
  Table,
  Card,
  Text,
  DataList,
} from "@radix-ui/themes";
import useUserStore from "@store/userStore";
import { useQuery } from "@tanstack/react-query";

export const SalesPanel: React.FC = () => {
  const token = useUserStore((state) => state.token);

  // получение пользователей
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sales", token],
    queryFn: getAllSales,
  });



  return (
    <>
      <Flex gap="5" align="center" mb="5" justify="between">
        <Heading as="h2">История продаж</Heading>
      </Flex>

      <Card style={{ padding: "24px" }} variant="classic">
        <Flex direction="column" gap="4">
          {data?.map((sale: any) =>
            sale.SaleItem.map((saleInfo: any) => (
              <Card key={saleInfo.id}>
                <Flex
                  style={{ padding: "24px" }}
                  gap="8"
                  justify="center"
                  align="center"
                >
                  <img
                    style={{ maxWidth: "20%", objectFit: "cover" }}
                    src={saleInfo.product.image}
                  />
                  <Card style={{ padding: "24px" }}>
                    <DataList.Root>
                      <DataList.Item>
                        <DataList.Label minWidth="122px">
                          Название виниловой пластинки
                        </DataList.Label>
                        <DataList.Value>{saleInfo.product.name}</DataList.Value>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.Label minWidth="122px">Цена</DataList.Label>
                        <DataList.Value>
                          <Text color="lime">{saleInfo.price} ₽</Text>
                        </DataList.Value>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.Label minWidth="122px">
                          Количество продаж
                        </DataList.Label>
                        <DataList.Value>{saleInfo.quantity}</DataList.Value>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.Label minWidth="122px">
                          Общая прибыль
                        </DataList.Label>
                        <DataList.Value>
                          <Text color="lime">
                            {saleInfo.quantity * saleInfo.price} ₽
                          </Text>
                        </DataList.Value>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.Label minWidth="122px">
                          Покупатель
                        </DataList.Label>
                        <DataList.Value>{sale.user.login}</DataList.Value>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.Label minWidth="122px">Время</DataList.Label>
                        <DataList.Value>
                          {new Date(sale.soldAt).toLocaleString()}
                        </DataList.Value>
                      </DataList.Item>
                    </DataList.Root>
                  </Card>
                </Flex>
              </Card>
            ))
          )}
        </Flex>
      </Card>
    </>
  );
};
