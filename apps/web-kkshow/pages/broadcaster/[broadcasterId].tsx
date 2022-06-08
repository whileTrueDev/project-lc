import {
  Avatar,
  Box,
  Center,
  Text,
  Image,
  SimpleGrid,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import KkshowLayout from '@project-lc/components-web-kkshow/KkshowLayout';
import { useBroadcaster } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function BroadcasterPromotionPage(): JSX.Element {
  const router = useRouter();
  const broadcasterId = router.query.broadcasterId as string;
  const bc = useBroadcaster({ id: broadcasterId });
  return (
    <Box>
      <KkshowLayout>
        <Box m="auto" maxW="5xl" p={2} minH="80vh" mt={20}>
          <Center>
            <Box>
              <Avatar size="2xl" src={bc.data?.avatar} />
              <Text>{bc.data?.userNickname}</Text>
              <Text>트위치</Text>
              <Text>방송국링크</Text>
              <Text>간략설명</Text>
            </Box>
          </Center>

          <Tabs variant="line" align="center" mt={30}>
            <TabList>
              <Tab>상품</Tab>
              <Tab isDisabled>방송</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <SimpleGrid mt={30} minChildWidth={200} spacing={4}>
                  <Box p={2}>
                    <Image
                      w="100%"
                      rounded="md"
                      draggable={false}
                      src="https://picsum.photos/302/302"
                    />
                    <Text>상품명</Text>
                  </Box>
                  <Box p={2}>
                    <Image
                      w="100%"
                      rounded="md"
                      draggable={false}
                      src="https://picsum.photos/302/303"
                    />
                    <Text>상품명</Text>
                  </Box>
                  <Box p={2}>
                    <Image
                      w="100%"
                      rounded="md"
                      draggable={false}
                      src="https://picsum.photos/302/304"
                    />
                    <Text>상품명</Text>
                  </Box>
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </KkshowLayout>
    </Box>
  );
}

export default BroadcasterPromotionPage;
