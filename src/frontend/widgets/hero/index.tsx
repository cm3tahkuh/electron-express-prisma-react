import { Heading, Text, Button, Flex } from "@radix-ui/themes";
import styles from "./hero.module.scss";
import { useNavigate } from "react-router-dom";

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Flex
      direction="column"
      align="center"
      gap="4"
      style={{ position: "relative", padding: "200px 20px" }}
      pb="9"
    >
      <div className={`${styles.info__background} ${styles.ibg}`}>
        <img src="images/backgroundHero.jpg" alt="Фон" />
      </div>
      <Heading size="9" style={{ color: "white" }} as="h1">
        Винил - это круто.
      </Heading>
      <Text as="p" size="5" style={{ color: "white" }}>
        Лучшие и качественные записи в нашем магазине
      </Text>
      <Flex gap="4">
        <Button
          size="3"
          onClick={() => {
     
            navigate("/catalog");
          }}
          variant="classic"
        >
          Купить
        </Button>
        {/* <Button size="3" style={{ color: "white" }} variant="soft">
          Подробнее
        </Button> */}
      </Flex>
    </Flex>
  );
};
