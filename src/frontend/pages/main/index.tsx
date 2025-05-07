import { Container, Box, Flex } from "@radix-ui/themes";
import { Hero } from "@widgets/hero";
import { HeroCards } from "@widgets/hero/heroCards";

export const Main: React.FC = () => {
  return (
    <Box>
      <Hero />
      <Container size="4">
        <Flex py="9">
          <HeroCards />
        </Flex>
      </Container>
    </Box>
  );
};
