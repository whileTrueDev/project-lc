import { ChevronDownIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Input,
  Select,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { GoGift } from 'react-icons/go';
import { MdOutlineShoppingCart } from 'react-icons/md';

export function GoodsViewBottomMenu(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  return (
    <Flex
      display={{ base: 'flex', md: 'none' }}
      width="100%"
      height="70px"
      pos="fixed"
      bottom={0}
      right={0}
      bgColor={useColorModeValue('white', 'gray.900')}
      borderTopWidth="thin"
      borderTopColor={useColorModeValue('gray.200', 'gray.700')}
      zIndex="banner"
      alignItems="center"
      justify="space-between"
      px={2}
      gap={2}
    >
      <Button isFullWidth variant="outline" colorScheme="blue" onClick={onOpen}>
        장바구니
      </Button>
      <Button isFullWidth variant="solid" colorScheme="blue" onClick={onOpen}>
        구매
      </Button>

      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent borderTopRadius="lg">
          <DrawerBody p={2} fontSize="sm">
            <Box
              borderTopRadius="lg"
              w="40px"
              pos="absolute"
              top={-5}
              left="calc(50% - 20px)"
              background="white"
              textAlign="center"
            >
              <IconButton
                size="xs"
                w="100%"
                variant="unstyled"
                onClick={onClose}
                icon={<ChevronDownIcon />}
                aria-label="close-button"
              />
            </Box>
            {/* 옵션 선택 */}
            <Box>
              <Select size="sm" placeholder="옵션 선택창이 들어갈 공간">
                <option>옵션1</option>
                <option>옵션2</option>
              </Select>
            </Box>
            {/* 선택된 옵션 목록 */}
            <Stack mt={2} maxH={200} overflowY="scroll">
              <Flex py={1} px={2} w="100%" borderWidth="thin" justify="space-between">
                <Box>
                  <Text>간장 깐새우장</Text>
                  <Text>1개</Text>
                </Box>
                <IconButton
                  size="xs"
                  variant="unstyled"
                  aria-label="delete-option"
                  icon={<CloseIcon />}
                />
              </Flex>
              <Flex py={1} px={2} w="100%" borderWidth="thin" justify="space-between">
                <Box>
                  <Text>양념 깐새우장</Text>
                  <Text>1개</Text>
                </Box>
                <IconButton
                  size="xs"
                  variant="unstyled"
                  aria-label="delete-option"
                  icon={<CloseIcon />}
                />
              </Flex>
            </Stack>
            {/* 후원 방송인 선택 */}
            <Accordion allowToggle mt={2}>
              <AccordionItem>
                <AccordionButton px={0}>
                  <Flex justify="space-between" w="100%">
                    <Text fontSize="md">방송인 후원하기</Text>
                    <AccordionIcon />
                  </Flex>
                </AccordionButton>

                <AccordionPanel px={0}>
                  <Flex gap={2} justify="space-between">
                    <Box>
                      <Text>응원방송인</Text>
                      <Avatar />
                      <Text>방송인명</Text>
                    </Box>
                    <Box>
                      방송인 후원 메시지
                      <Input
                        placeholder="방송인 후원 메시지 도네이션 표시글"
                        maxW={300}
                      />
                    </Box>
                  </Flex>
                  <Box textAlign="right">
                    <Button leftIcon={<GoGift />} variant="outline">
                      방송인에게 선물하기
                    </Button>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Grid templateColumns="1fr 1fr" pt={4}>
              <GridItem>
                <Text>총 개수</Text>
              </GridItem>
              <GridItem textAlign="right">
                <Text>8 개</Text>
              </GridItem>

              <GridItem>
                <Text>합계</Text>
              </GridItem>
              <GridItem textAlign="right">
                <Text fontWeight="bold" fontSize="xl" color="blue.500">
                  {(32000).toLocaleString()}원
                </Text>
              </GridItem>
            </Grid>

            <Flex gap={2}>
              <Button isFullWidth variant="outline" mr={3} onClick={onClose}>
                취소
              </Button>
              <Button isFullWidth colorScheme="blue" leftIcon={<MdOutlineShoppingCart />}>
                장바구니 담기
              </Button>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default GoodsViewBottomMenu;
