import { Box, Grid, GridItem, Stack, Text } from '@chakra-ui/react';

export function GoodsViewRelatedGoods(): JSX.Element {
  return (
    <Box h="50vh" maxW="5xl" m="auto">
      <Text fontSize="2xl">다른 상품 보기</Text>
      <Grid gap={2} templateColumns="repeat(4, 1fr)">
        <GridItem colSpan={{ base: 4, sm: 2, md: 4 }}>
          <Stack>
            <Box rounded="md" bgColor="gray.300" maxW={400} h={250} w="100%" />
            <Box bgColor="gray.300" maxW={250} h="26px" />
            <Box bgColor="gray.300" maxW={200} h="26px" />
          </Stack>
        </GridItem>
        <GridItem colSpan={{ base: 4, sm: 2, md: 4 }}>
          <Stack>
            <Box rounded="md" bgColor="gray.300" maxW={400} h={250} w="100%" />
            <Box bgColor="gray.300" maxW={250} h="26px" />
            <Box bgColor="gray.300" maxW={200} h="26px" />
          </Stack>
        </GridItem>
        <GridItem colSpan={{ base: 4, sm: 2, md: 4 }}>
          <Stack>
            <Box rounded="md" bgColor="gray.300" maxW={400} h={250} w="100%" />
            <Box bgColor="gray.300" maxW={250} h="26px" />
            <Box bgColor="gray.300" maxW={200} h="26px" />
          </Stack>
        </GridItem>
        <GridItem colSpan={{ base: 4, sm: 2, md: 4 }}>
          <Stack>
            <Box rounded="md" bgColor="gray.300" maxW={400} h={250} w="100%" />
            <Box bgColor="gray.300" maxW={250} h="26px" />
            <Box bgColor="gray.300" maxW={200} h="26px" />
          </Stack>
        </GridItem>
      </Grid>
    </Box>
  );
}
