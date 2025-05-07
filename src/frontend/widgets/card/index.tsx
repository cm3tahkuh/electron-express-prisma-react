import { Card, Text, Heading, Flex } from "@radix-ui/themes";

interface CardProps {
  title: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

export const CardProduct: React.FC<CardProps> = ({
  title,
  description,
  price,
  quantity,
  image,
}) => {
  return (
    <Card style={{height: "100%"}} variant="classic">
      <Flex direction="column" height="100%" justify="center" maxWidth="200px">
        <img
          style={{
            maxWidth: "300px",
            maxHeight: "300px",
            marginBottom: "20px",
          }}
          src={image}
          alt={title}
        />
        <Heading style={{ marginBottom: "10px" }}>{title}</Heading>
        <Text truncate as="p">
          {description}
        </Text>
        <Text as="span" color="green">
          Цена: {price} {"₽"}
        </Text>
        <Text as="span">Количество: {quantity}</Text>
      </Flex>
    </Card>
  );
};
