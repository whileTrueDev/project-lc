import { CloseIcon, Icon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Input,
  ListItem,
  Select,
  Stack,
  Text,
  Tooltip,
  UnorderedList,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import { Broadcaster } from '@prisma/client';
import { GoodsByIdRes } from '@project-lc/shared-types';
import { useGoodsViewStore } from '@project-lc/stores';
import { useEffect, useMemo } from 'react';
import { GoGift } from 'react-icons/go';
import shallow from 'zustand/shallow';
import OptionQuantity from '../OptionQuantity';

interface GoodsViewPurchaseBoxProps {
  goods: GoodsByIdRes;
}
/** 상품 상세 페이지 상품 옵션 및 후원 정보 입력 + 구매,장바구니 버튼 */
export function GoodsViewPurchaseBox({ goods }: GoodsViewPurchaseBoxProps): JSX.Element {
  const toast = useToast();
  const store = useGoodsViewStore();

  const isOnlyDefaultOption = useMemo(
    () =>
      goods.options.length === 1 &&
      goods.options.filter((x) => x.default_option === 'y').length === 1,
    [goods.options],
  );

  useEffect(() => {
    if (isOnlyDefaultOption) {
      store.handleSelectOpt({ ...goods.options[0], quantity: 1 });
    }
  }, [goods.options, isOnlyDefaultOption, store]);

  return (
    <Grid templateColumns="1fr 2fr" mt={{ base: 2, md: 6 }} gridRowGap={2}>
      {/* 옵션 */}
      {!isOnlyDefaultOption && (
        <>
          <GridItem>
            <Text>상품 옵션</Text>
          </GridItem>
          <GridItem colSpan={2}>
            <Select
              size="sm"
              placeholder="상품 옵션을 선택해주세요."
              onChange={(e): void => {
                const targetopt = goods.options.find(
                  (o) => o.id === Number(e.target.value),
                );
                if (!targetopt) return;
                store.handleSelectOpt({ ...targetopt, quantity: 1 }, () => {
                  toast({ title: '이미 선택된 옵션입니다.', status: 'warning' });
                });
              }}
            >
              {goods.options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.option_title}: {opt.option1} ({opt.price})
                </option>
              ))}
            </Select>
          </GridItem>
        </>
      )}

      <GridItem colSpan={3} fontSize="sm">
        {/* 선택된 옵션 목록 */}
        <Stack
          mt={2}
          maxH={{ base: 200, md: 'unset' }}
          overflowY={{ base: 'scroll', md: 'unset' }}
        >
          {store.selectedOpts.map((opt) => (
            <Flex
              rounded="md"
              key={opt.id}
              py={1}
              px={2}
              w="100%"
              borderWidth="thin"
              justify="space-between"
            >
              <Box>
                <Text mb={2}>
                  {opt.option_title} : {opt.option1}
                </Text>
                <OptionQuantity
                  quantity={opt.quantity}
                  handleDecrease={() => store.handleDecreaseOptQuantity(opt.id)}
                  handleIncrease={() => store.handleIncreaseOptQuantity(opt.id)}
                />
              </Box>
              {!isOnlyDefaultOption && (
                <IconButton
                  color="GrayText"
                  size="xs"
                  variant="unstyled"
                  aria-label="delete-option"
                  onClick={() => store.handleRemoveOpt(opt.id)}
                  icon={<CloseIcon />}
                />
              )}
            </Flex>
          ))}
        </Stack>
      </GridItem>

      {/* 방송인 후원 */}
      <GridItem colSpan={3}>
        <GoodsViewBroadcasterSupportBox goods={goods} />
      </GridItem>

      {/* 총 구매 금액 및 구매,장바구니 버튼 */}
      <GridItem colSpan={3}>
        <GoodsViewButtonSet />
      </GridItem>
    </Grid>
  );
}

function GoodsViewBroadcasterSupportBox({
  goods,
}: GoodsViewPurchaseBoxProps): JSX.Element | null {
  const { selectedBc, handleSelectBc } = useGoodsViewStore(
    (s) => ({ selectedBc: s.selectedBc, handleSelectBc: s.handleSelectBc }),
    shallow,
  );
  const relatedBroadcasters = useMemo(() => {
    const livBcs =
      goods.LiveShopping?.map((liv) => liv.broadcaster).filter((x) => !!x) || [];
    const ppBcs =
      goods.productPromotion?.map((pp) => pp.broadcaster).filter((x) => !!x) || [];
    const result = livBcs.concat(ppBcs);
    return result.reduce<Pick<Broadcaster, 'avatar' | 'userNickname'>[]>((prev, curr) => {
      if (prev.findIndex((x) => x.userNickname === curr.userNickname) > -1) {
        return prev;
      }
      return prev.concat(curr);
    }, []);
  }, [goods.LiveShopping, goods.productPromotion]);

  if (relatedBroadcasters.length === 0) return null;

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <AccordionButton px={0}>
          <Flex justify="space-between" w="100%">
            <Text fontSize={{ base: 'sm', md: 'md' }}>방송인 후원하기</Text>
            {selectedBc && selectedBc.userNickname && (
              <Flex key={selectedBc.userNickname} gap={2}>
                <Avatar size="xs" src={selectedBc.avatar || ''} />
                <Text fontSize="sm">
                  {selectedBc.userNickname.length <= 3
                    ? selectedBc.userNickname
                    : `${selectedBc.userNickname.slice(0, 3)}..`}
                </Text>
              </Flex>
            )}
            <AccordionIcon />
          </Flex>
        </AccordionButton>

        <AccordionPanel px={0} fontSize="sm">
          {!selectedBc ? (
            <Box>
              <Text mb={2}>후원가능한 방송인</Text>
              {relatedBroadcasters.map((bc) => (
                <Flex key={bc.userNickname} gap={2}>
                  <Avatar size="xs" src={bc.avatar || ''} />
                  <Text>{bc.userNickname}</Text>
                  <Button onClick={() => handleSelectBc(bc)} size="xs">
                    선택
                  </Button>
                </Flex>
              ))}
            </Box>
          ) : (
            <Flex gap={4} justify="space-between">
              <Box>
                <Flex gap={2}>
                  <Text>후원방송인</Text>
                  <IconButton
                    color="GrayText"
                    size="xs"
                    aria-label="cancel-broadcaster-selection"
                    onClick={() => handleSelectBc(null)}
                    icon={<CloseIcon />}
                  />
                </Flex>
                <Avatar src={selectedBc.avatar || ''} />
                <Text>{selectedBc.userNickname}</Text>
              </Box>

              <Box flex={1}>
                <Text>
                  방송인 후원 메시지{' '}
                  <Text fontSize="xs" as="span" color="GrayText">
                    (최대 30자)
                  </Text>
                </Text>
                <Input
                  rounded="md"
                  size="sm"
                  placeholder="방송인 후원 메시지 도네이션 표시글"
                />
              </Box>
            </Flex>
          )}
          <UnorderedList mt={2} color="GrayText" fontSize="xs">
            <ListItem>
              <Text>방송인 후원 시, 주문 금액의 일정량이 방송인에게 돌아갑니다.</Text>
            </ListItem>
            <ListItem>
              <Text>
                방송인이 라이브쇼핑 방송 중인 경우 후원메시지는 방송 화면에 전송됩니다.
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                방송인에게 선물하기 버튼{' '}
                <Text as="span">
                  <Icon as={GoGift} verticalAlign="middle" />
                </Text>{' '}
                을 클릭하여 이 상품을 후원 방송인에게 선물할 수 있습니다.
              </Text>
            </ListItem>
          </UnorderedList>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

function GoodsViewButtonSet(): JSX.Element {
  const store = useGoodsViewStore();
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });

  /** 선택 상품 옵션 합계 정보 */
  const totalInfo = useMemo(() => {
    return store.selectedOpts.reduce(
      (prev, curr) => {
        let { quantity, price } = prev;
        if (curr.quantity) quantity += curr.quantity;
        if (curr.price) price += Number(curr.price) * curr.quantity;
        return { quantity, price };
      },
      {
        quantity: 0,
        price: 0,
      },
    );
  }, [store.selectedOpts]);

  return (
    <Stack>
      <Grid templateColumns="1fr 1fr" pt={4}>
        <GridItem>
          <Text>총 개수</Text>
        </GridItem>
        <GridItem textAlign="right">
          <Text>{totalInfo.quantity} 개</Text>
        </GridItem>

        <GridItem>
          <Text>합계</Text>
        </GridItem>
        <GridItem textAlign="right">
          <Text fontWeight="bold" fontSize="xl" color="blue.500">
            {totalInfo.price.toLocaleString()}원
          </Text>
        </GridItem>
      </Grid>

      <ButtonGroup>
        {/* 방송인에게 선물 버튼 */}
        {store.selectedBc && (
          <Tooltip label="방송인에게 선물하기">
            <IconButton
              aria-label="방송인에게 선물하기 버튼"
              size={buttonSize}
              icon={<GoGift />}
              colorScheme="facebook"
              variant="outline"
              onClick={() => {
                // TODO: 주문페이지 완료이후 선물 주문으로 이동 로직 구현 필요
                alert('방송인에게 선물하기 클릭. 선물 주문으로 이동 로직 구현 필요');
              }}
            />
          </Tooltip>
        )}
        <Button
          isFullWidth
          size={buttonSize}
          colorScheme="blue"
          onClick={() => {
            // TODO: 주문페이지 완료이후 선물 주문으로 이동 로직 구현 필요
            alert('구매하기 클릭. 장바구니 구매하기와 동일한 로직 처리 필요');
          }}
        >
          구매하기
        </Button>
        <Button
          isFullWidth
          size={buttonSize}
          colorScheme="blue"
          variant="outline"
          onClick={() => {
            alert('장바구니 클릭');
          }}
        >
          장바구니 담기
        </Button>
      </ButtonGroup>
    </Stack>
  );
}
