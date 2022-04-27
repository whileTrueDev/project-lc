import { ArrowUpIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import { motion, useTransform, useViewportScroll } from 'framer-motion';

export function GoodsViewFloatingButtons(): JSX.Element {
  const onUpClick = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { scrollYProgress } = useViewportScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05, 1], [0, 1, 1]);
  return (
    <motion.div style={{ opacity }}>
      <Flex
        display={{ base: 'none', md: 'flex' }}
        flexDir="column"
        pos="fixed"
        bottom={20}
        right={4}
        gap={2}
        zIndex="sticky"
      >
        <IconButton
          variant="solid"
          rounded="full"
          size="lg"
          aria-label="scroll-up"
          icon={<ArrowUpIcon fontSize="2xl" />}
          onClick={onUpClick}
        />
      </Flex>
    </motion.div>
  );
}
