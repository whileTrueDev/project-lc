import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useGoodsById } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { GoodsViewPurchaseBox } from './GoodsViewPurchaseBox';

export function GoodsViewBottomMenu(): JSX.Element | null {
  const bgColor = useColorModeValue('white', 'gray.900');
  const bgColor2 = useColorModeValue('white', 'gray.700');
  const borderTopColor = useColorModeValue('gray.200', 'gray.700');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);

  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useGoodsById(goodsId);

  if (goods.isLoading) return null;
  if (!goods.data) return null;

  return (
    <Flex
      display={{ base: 'flex', md: 'none' }}
      width="100%"
      height="70px"
      pos="fixed"
      bottom={0}
      right={0}
      bgColor={bgColor}
      borderTopWidth="thin"
      borderTopColor={borderTopColor}
      zIndex="banner"
      alignItems="center"
      justify="space-between"
      px={2}
      gap={2}
    >
      <Button isFullWidth variant="solid" colorScheme="blue" onClick={onOpen}>
        구매
      </Button>
      <Button isFullWidth variant="outline" colorScheme="blue" onClick={onOpen}>
        장바구니
      </Button>

      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent borderTopRadius="lg" borderTopWidth="thin">
          <DrawerBody p={2} fontSize="sm">
            {/* 닫기 버튼 */}
            <Box
              bgColor={bgColor2}
              borderTopRadius="lg"
              borderTopWidth="thin"
              w="40px"
              pos="absolute"
              top={-5}
              left="calc(50% - 20px)"
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
            {/* 구매 박스 */}
            <GoodsViewPurchaseBox goods={goods.data} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default GoodsViewBottomMenu;
