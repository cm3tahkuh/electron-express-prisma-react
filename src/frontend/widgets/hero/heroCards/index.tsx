import { Flex } from "@radix-ui/themes";
import React from "react";
import styles from "./herocards.module.scss";

export const HeroCards: React.FC = () => {
  return (
    <Flex wrap="wrap" justify="center" style={{ gap: "22px" }} width="100%">
      <div className={styles.cards__column}>
        <img src="images/heroCards/1.jpg" />
        <div className={styles.cards__name}>
          <h2>Лучший выбор</h2>
        </div>
      </div>
      <div className={styles.cards__column}>
        <img src="images/heroCards/2.jpg" />
        <div className={styles.cards__name}>
          <h2>Редкие пластинки</h2>
        </div>
      </div>
      <div className={styles.cards__column}>
        <img src="images/heroCards/3.jpg" />
        <div className={styles.cards__name}>
          <h2>Подарочные издания</h2>
        </div>
      </div>
    </Flex>
  );
};
