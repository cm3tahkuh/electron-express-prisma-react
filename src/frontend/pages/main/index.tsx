import { Container, Box, Flex } from "@radix-ui/themes";
import { Hero } from "@widgets/hero";
import { HeroCards } from "@widgets/hero/heroCards";
import { motion } from "framer-motion";

export const Main: React.FC = () => {
  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <Hero />
      </motion.div>
      <Container size="4">
        <Flex py="9">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <HeroCards />
          </motion.div>
        </Flex>
      </Container>
    </Box>
  );
};
