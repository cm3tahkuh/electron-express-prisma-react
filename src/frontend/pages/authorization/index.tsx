import { Box, Flex, Heading } from "@radix-ui/themes";
import useUserStore from "@store/userStore";
import { SignIn } from "@widgets/signin";
import { SignUp } from "@widgets/signup";

export const Authorization: React.FC = () => {
  const user = useUserStore((state) => state.user);

  if (user) {
    return (
      <Heading as="h1" align="center" size="8">
        Вы уже вошли в систему.
      </Heading>
    );
  }

  return (
    <Box>
      <Flex
        direction="column"
        justify="center"
        gap="6"
        height="80vh"
        align="center"
      >
        <Heading as="h1" size="8">
          Авторизация
        </Heading>
        <Flex gap="4">
          <SignIn />
          <SignUp />
        </Flex>
      </Flex>
    </Box>
  );
};
