import React from "react";
import { Flex, Box, Container, Text } from "@radix-ui/themes";
import { Link, useLocation } from "react-router-dom";
import styles from "./header.module.scss";
import { motion } from "framer-motion";

import useUserStore from "@store/userStore";

export const Header: React.FC = () => {
  const { pathname } = useLocation();

  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <Box>
        <Container size="4">
          <Flex gap="5" align="center" justify="between" p="5">
            <ul style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <li>
                {pathname !== "/" ? (
                  <Link to="/">
                    <img
                      style={{ width: "32px" }}
                      className={styles.header__logo}
                      src="logos/vinylLogo.png"
                      alt="Логотип Винил"
                    />
                  </Link>
                ) : (
                  <img
                    style={{ width: "32px" }}
                    className={styles.header__logo}
                    src="logos/vinylLogo.png"
                    alt="Логотип Винил"
                  />
                )}
              </li>
              <li>
                <Link
                  className={`${styles.header__link} ${
                    pathname === "/" ? styles.active : ""
                  }`}
                  to="/"
                >
                  Главная
                </Link>
              </li>
              <li>
                <Link
                  className={`${styles.header__link} ${
                    pathname === "/catalog" ? styles.active : ""
                  }`}
                  to="/catalog"
                >
                  Каталог
                </Link>
              </li>
            </ul>
            <ul style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              {user !== null ? (
                <>
                  <li>
                    <Link
                      className={`${styles.header__link} ${
                        pathname === "/cart" ? styles.active : ""
                      }`}
                      to="/cart"
                    >
                      🛒
                    </Link>
                  </li>
                  <li>
                    <Text
                      className={`${styles.header__link} `}
                      style={{ cursor: "pointer" }}
                      onClick={() => logout()}
                    >
                      Выйти
                    </Text>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    className={`${styles.header__link} ${
                      pathname === "/login" ? styles.active : ""
                    }`}
                    to="/auth"
                  >
                    Вход / Регистрация
                  </Link>
                </li>
              )}
            </ul>
          </Flex>
        </Container>
      </Box>
    </motion.div>
  );
};
