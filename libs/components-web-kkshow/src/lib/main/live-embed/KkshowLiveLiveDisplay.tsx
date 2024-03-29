import { LinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { StreamingService } from '@prisma/client';
import { useDisplaySize, useLiveShopping } from '@project-lc/hooks';
import { LiveShoppingWithGoods } from '@project-lc/shared-types';
import { getKkshowWebHost } from '@project-lc/utils';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { MdPhotoCameraFront } from 'react-icons/md';
import { GoodsViewAdditionalInfo } from '../../goods/GoodsViewAdditionalInfo';
import GoodsViewBottomMenu from '../../goods/GoodsViewBottomMenu';
import { GoodsViewDetail } from '../../goods/GoodsViewDetail';
import { GoodsViewInquiries } from '../../goods/GoodsViewInquiries';
import GoodsViewMeta from '../../goods/GoodsViewMeta';
import { GoodsViewReviews } from '../../goods/GoodsViewReviews';
import { GoodsViewStickyNav } from '../../goods/nav/GoodsViewStickyNav';

export interface KkshowLiveLiveDisplayProps {
  liveShoppingId: number;
  streamingService: StreamingService;
  UID: string;
}
export function KkshowLiveLiveDisplay({
  liveShoppingId,
  streamingService,
  UID,
}: KkshowLiveLiveDisplayProps): JSX.Element | null {
  const router = useRouter();
  const shareDialog = useDisclosure();
  const drawerDialog = useDisclosure();
  const { data } = useLiveShopping(liveShoppingId);

  // router.query 에 goodsId, bc 추가
  useEffect(() => {
    if (data && data.goodsId && !router.query.goodsId && !router.query.bc) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, goodsId: data.goodsId, bc: data.broadcasterId },
      });
    }
  }, [data, router]);

  const formatDate = (dateString: string | Date): string => {
    return dayjs(dateString).format('YYYY년 MM월 DD일 HH시 mm분');
  };

  const onPurchaseClick = (): void => {
    if (data?.externalGoods) {
      window.open(data.externalGoods.linkUrl);
    } else {
      drawerDialog.onOpen();
    }
  };

  const onShareClick = (): void => {
    shareDialog.onOpen();
  };

  const onBtnToStreamingServiceClick = (): void => {
    if (streamingService === 'afreeca') {
      window.open(`https://play.afreecatv.com/${UID}`);
    }
    if (streamingService === 'twitch') {
      window.open(`https://www.twitch.tv/${UID}`);
    }
  };

  const { isMobileSize } = useDisplaySize();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });

  if (!data) return null;
  return (
    <Box p={2}>
      <Flex gap={2} justify="space-between" flexDir={{ base: 'column', lg: 'row' }}>
        <Box>
          <Text fontWeight="bold" fontSize={{ base: 'xl', lg: '2xl' }}>
            {data.liveShoppingName}
          </Text>

          {isMobileSize ? (
            <>
              <Button onClick={onToggle} size="sm" variant="link">
                라이브쇼핑 정보 보기
              </Button>
              {isOpen ? <KkshowLiveInfo data={data} formatDate={formatDate} /> : null}
            </>
          ) : (
            <KkshowLiveInfo data={data} formatDate={formatDate} />
          )}
        </Box>

        <Flex
          flexDir={{ base: 'row', lg: 'column' }}
          align="stertch"
          gap={2}
          flexGrow={0}
        >
          <Button size="sm" colorScheme="blue" onClick={onPurchaseClick}>
            구매하기
          </Button>
          <KkshowPurchaseDrawer
            isOpen={drawerDialog.isOpen}
            onClose={drawerDialog.onClose}
          />

          <Button size="sm" leftIcon={<LinkIcon />} onClick={onShareClick}>
            공유하기
          </Button>
          <KkshowLiveShareDialog
            isOpen={shareDialog.isOpen}
            onClose={shareDialog.onClose}
          />

          <Button
            size="sm"
            leftIcon={<MdPhotoCameraFront />}
            onClick={onBtnToStreamingServiceClick}
          >
            방송보러가기
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
export default KkshowLiveLiveDisplay;

interface KkshowLiveInfoProps {
  formatDate: (dateString: string | Date) => string;
  data: LiveShoppingWithGoods;
}
function KkshowLiveInfo({ data, formatDate }: KkshowLiveInfoProps): JSX.Element {
  return (
    <Grid templateColumns="1fr 3fr" gap={2} fontSize={{ base: 'sm', lg: 'md' }}>
      <GridItem>
        <Text>판매 상품</Text>
      </GridItem>
      <GridItem>
        <Text fontSize={{ base: 'xs', lg: 'md' }}>
          {data.goods?.goods_name || '미정'}
        </Text>
      </GridItem>

      {data.broadcastStartDate && data.broadcastEndDate && (
        <>
          <GridItem>
            <Text>방송 시간</Text>
          </GridItem>
          <GridItem>
            <Text fontSize={{ base: 'xs', lg: 'md' }}>
              {formatDate(data.broadcastStartDate)} ~ {formatDate(data.broadcastEndDate)}
            </Text>
          </GridItem>
        </>
      )}

      {data.sellStartDate && data.sellEndDate && (
        <>
          <GridItem>
            <Text>판매 시간</Text>
          </GridItem>
          <GridItem>
            <Text fontSize={{ base: 'xs', lg: 'md' }}>
              {formatDate(data.sellStartDate)} ~ {formatDate(data.sellEndDate)}
            </Text>
          </GridItem>
        </>
      )}
    </Grid>
  );
}

interface KkshowPurchaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
function KkshowPurchaseDrawer({
  isOpen,
  onClose,
}: KkshowPurchaseDrawerProps): JSX.Element {
  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />

      <DrawerContent rounded="lg" maxHeight="90vh">
        <DrawerHeader borderBottomWidth="1px">상품 구매하기</DrawerHeader>
        <DrawerCloseButton />

        <DrawerBody py={0} px={2}>
          <>
            <GoodsViewMeta pageTransferType="window_open" />
            <GoodsViewStickyNav topMargin={0} />
            <GoodsViewDetail />
            <GoodsViewReviews />
            <GoodsViewInquiries />
            <GoodsViewAdditionalInfo />
            <GoodsViewBottomMenu />
          </>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export interface KkshowLiveShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
export function KkshowLiveShareDialog({
  isOpen,
  onClose,
}: KkshowLiveShareDialogProps): JSX.Element {
  const toast = useToast();
  const url = `${getKkshowWebHost()}/live-shopping`;
  const copyLink = (): void => {
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: '공유 링크가 클립보드에 복사되었습니다.', status: 'success' });
    });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          라이브 쇼핑 공유
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Stack align="start">
            <Input isReadOnly value={url} />
            <Button onClick={copyLink}>링크 복사</Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
