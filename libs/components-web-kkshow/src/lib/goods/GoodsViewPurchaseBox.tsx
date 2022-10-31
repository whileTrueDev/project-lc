/* eslint-disable no-nested-ternary */
import { CloseIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Collapse,
  ExpandedIndex,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  IconButton,
  Input,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Select,
  Stack,
  Text,
  Textarea,
  Tooltip,
  UnorderedList,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { SellType } from '@prisma/client';
import { ClickableUnderlinedText } from '@project-lc/components-core/ClickableUnderlinedText';
import CustomAvatar from '@project-lc/components-core/CustomAvatar';
import {
  useCartMutation,
  useCustomerInfo,
  useCustomerInfoMutation,
  useIsThisGoodsNowOnLive,
  useLiveShoppingNowOnLive,
  useProfile,
} from '@project-lc/hooks';
import {
  getLiveShoppingIsNowLive,
  GoodsByIdRes,
  GoodsRelatedBroadcaster,
  NEXT_PAGE_PARAM_KEY,
  SpecialPriceItem,
} from '@project-lc/shared-types';
import { useGoodsViewStore, useKkshowOrderStore } from '@project-lc/stores';
import { getKkshowWebHost } from '@project-lc/utils';
import {
  checkGoodsPurchasable,
  getLocaleNumber,
  pushDataLayer,
} from '@project-lc/utils-frontend';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GoGift } from 'react-icons/go';
import shallow from 'zustand/shallow';

import OptionQuantity from '../OptionQuantity';

export function findMatchingSpecialPriceByGoodsOptionId({
  specialPriceList,
  goodsOptionId,
}: {
  specialPriceList: SpecialPriceItem[];
  goodsOptionId: number;
}): number | null {
  const matching = specialPriceList.find((sp) => sp.goodsOptionId === goodsOptionId);
  if (!matching) return null;
  return Number(matching.specialPrice);
}

/** 후원방송인 선택시, 해당 방송인이 현재 진행중인 라이브쇼핑의 특가가격정보를 리턴 => 상품페이지에서 사용 */
export function useNowOnLiveSpecialPriceOptionList(goods: GoodsByIdRes): {
  goodsOptionsWithSpecialPrice: (GoodsByIdRes['options'][number] & {
    specialPrice?: number;
  })[];
} {
  const selectedBc = useGoodsViewStore((s) => s.selectedBc);
  const selectedOpts = useGoodsViewStore((s) => s.selectedOpts);
  const replaceSelectedOpts = useGoodsViewStore((s) => s.replaceSelectedOpts);

  // 현재상품 & 선택된 방송인이 현재 진행중인 라이브쇼핑(목록형태로 리턴됨. 동일 방송인이 동시에 같은 상품을 라이브방송하지는 않으므로 첫번째 값을 사용함)
  const nowOnliveLsListBySelectedBc = useLiveShoppingNowOnLive({
    goodsId: goods.id,
    broadcasterId: selectedBc?.id,
  });

  // 선택된 방송인이 진행중인 라이브쇼핑 특가 옵션가격들
  const specialPriceList = useMemo(() => {
    if (
      selectedBc &&
      nowOnliveLsListBySelectedBc.data &&
      nowOnliveLsListBySelectedBc.data[0]
    ) {
      return nowOnliveLsListBySelectedBc.data[0].liveShoppingSpecialPrices;
    }
    return undefined;
  }, [nowOnliveLsListBySelectedBc.data, selectedBc]);

  // 방송인 변경 && 라이브쇼핑 특가 정보 변경시 선택된 옵션의 가격 수정
  useEffect(() => {
    // 선택된 방송인이 없거나, 라이브쇼핑 특가 정보가 없다면 => 선택된 옵션의 특가정보를 삭제한다
    if (!selectedBc || !specialPriceList) {
      replaceSelectedOpts(
        selectedOpts.map((prevOpt) => {
          const { specialPrice, ...restOpt } = prevOpt;
          return restOpt;
        }),
      );
    }
    // 라이브쇼핑 특가 정보가 있으면 선택된 옵션에 특가정보를 추가한다
    if (specialPriceList) {
      replaceSelectedOpts(
        selectedOpts.map((prevOpt) => {
          const specialPriceData = specialPriceList.find(
            (sp) => sp.goodsOptionId === prevOpt.id,
          );
          return {
            ...prevOpt,
            specialPrice: specialPriceData?.specialPrice
              ? Number(specialPriceData?.specialPrice)
              : undefined,
          };
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBc, specialPriceList]);

  const goodsOptions: (GoodsByIdRes['options'][number] & { specialPrice?: number })[] =
    useMemo(() => {
      // 특가정보가 없으면 상품옵션 그대로 표시
      if (!specialPriceList || !specialPriceList.length) return goods.options;
      // 특가정보가 있으면 특가정보 추가
      return goods.options.map((opt) => {
        const matchingSpecialPrice = findMatchingSpecialPriceByGoodsOptionId({
          specialPriceList,
          goodsOptionId: opt.id,
        });
        if (matchingSpecialPrice) return { ...opt, specialPrice: matchingSpecialPrice };
        return opt;
      });
    }, [goods.options, specialPriceList]);
  return {
    goodsOptionsWithSpecialPrice: goodsOptions,
  };
}

export interface GoodsViewPurchaseBoxProps {
  goods: GoodsByIdRes;
  isOnDrawer?: boolean;
  pageTransferType?: 'router' | 'window_open';
}
/** 상품 상세 페이지 상품 옵션 및 후원 정보 입력 + 구매,장바구니 버튼 */
export function GoodsViewPurchaseBox({
  goods,
  isOnDrawer = false,
  pageTransferType = 'router',
}: GoodsViewPurchaseBoxProps): JSX.Element {
  const toast = useToast({ isClosable: true });
  const handleSelectOpt = useGoodsViewStore((s) => s.handleSelectOpt);
  const selectedOpts = useGoodsViewStore((s) => s.selectedOpts);
  const handleDecreaseOptQuantity = useGoodsViewStore((s) => s.handleDecreaseOptQuantity);
  const handleIncreaseOptQuantity = useGoodsViewStore((s) => s.handleIncreaseOptQuantity);
  const handleRemoveOpt = useGoodsViewStore((s) => s.handleRemoveOpt);

  // 드롭다운 select에 표시될 옵션목록 데이터 (라이브쇼핑 특가정보가 있는경우 specialPrice 값을 가짐)
  const { goodsOptionsWithSpecialPrice: goodsOptions } =
    useNowOnLiveSpecialPriceOptionList(goods);

  // 기본 옵션 1개만 존재하는 상품 인지 판단
  const isOnlyDefaultOption = useMemo(
    () =>
      goods.options.length === 1 && goods.options.every((x) => x.default_option === 'y'),
    [goods.options],
  );

  useEffect(() => {
    // 이전에 선택된 옵션이 존재하는 경우(다른 상품 페이지에서 옵션을 선택했던 경우), 현재 보고있는 상품의 옵션이 아니면 삭제
    if (selectedOpts.length !== 0) {
      const otherGoodsSelectedOpts = selectedOpts.filter(
        (opt) => opt.goodsId !== goods.id,
      );
      otherGoodsSelectedOpts.forEach((otherGoodsOpt) =>
        handleRemoveOpt(otherGoodsOpt.id),
      );
    }
    // 기본 옵션 1개만 존재하는 경우 기본 선택되도록
    if (isOnlyDefaultOption && selectedOpts.length === 0) {
      handleSelectOpt({ ...goods.options[0], quantity: 1 });
    }
  }, [goods, handleSelectOpt, isOnlyDefaultOption, handleRemoveOpt, selectedOpts]);

  return (
    <Grid templateColumns="1fr 2fr" mt={{ base: 2, md: 6 }} gridRowGap={2} maxH="75vh">
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
                const targetopt = goodsOptions.find(
                  (o) => o.id === Number(e.target.value),
                );
                if (!targetopt) return;

                handleSelectOpt({ ...targetopt, quantity: 1 }, () => {
                  toast({ title: '이미 선택된 옵션입니다.', status: 'warning' });
                });
              }}
            >
              {/* <option> 태그 내에 다른 태그를 넣을 수 없다  */}
              {goodsOptions.map((opt) => {
                // 특가없으면 옵션 가격 그대로 표시
                if (!opt.specialPrice) {
                  return (
                    <option key={opt.id} value={opt.id}>
                      {opt.option_title}: {opt.option1} ({getLocaleNumber(opt.price)})
                    </option>
                  );
                }
                // 특가 있으면 원개 옵션가격 대신 라이브쇼핑 특가 표시
                return (
                  <option key={opt.id} value={opt.id}>
                    [LIVE특가] {opt.option_title}: {opt.option1} (
                    {getLocaleNumber(opt.specialPrice)})
                  </option>
                );
              })}
            </Select>
          </GridItem>
        </>
      )}

      <GridItem colSpan={3} fontSize="sm">
        {/* 선택된 옵션 목록 */}
        <Stack mt={2}>
          {selectedOpts.map((opt) => (
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
                {/* 옵션이 기본옵션 하나밖에 없는 경우 - 옵션명, 옵션값이 없으므로 상품명 출력 */}
                {isOnlyDefaultOption ? (
                  <Text>{goods.goods_name}</Text>
                ) : (
                  <Text mb={2}>
                    {/* 여러 옵션이 존재하는 경우 옵션명, 옵션값이 각각 존재하므로 옵션명:옵션값 형태로 출력 */}
                    {opt.option_title} : {opt.option1}
                  </Text>
                )}

                <OptionQuantity
                  quantity={opt.quantity}
                  handleDecrease={() => handleDecreaseOptQuantity(opt.id)}
                  handleIncrease={() => handleIncreaseOptQuantity(opt.id)}
                />
              </Box>
              {!isOnlyDefaultOption && (
                <IconButton
                  color="GrayText"
                  size="xs"
                  variant="unstyled"
                  aria-label="delete-option"
                  onClick={() => handleRemoveOpt(opt.id)}
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
      <GridItem
        colSpan={3}
        position={isOnDrawer ? 'sticky' : 'static'}
        bottom="0"
        zIndex={isOnDrawer ? 'sticky' : undefined}
      >
        <GoodsViewButtonSet
          goods={goods}
          isOnDrawer={isOnDrawer}
          pageTransferType={pageTransferType}
        />
      </GridItem>
    </Grid>
  );
}
function GoodsViewBroadcasterSupportBox({
  goods,
}: GoodsViewPurchaseBoxProps): JSX.Element | null {
  const { data: profile } = useProfile();
  const { data: customer } = useCustomerInfo(profile?.id);
  const {
    selectedBc,
    handleSelectBc,
    supportMessage,
    onSupMsgChange,
    supportNickname,
    onSupNickChange,
  } = useGoodsViewStore(
    (s) => ({
      selectedBc: s.selectedBc,
      handleSelectBc: s.handleSelectBc,
      supportMessage: s.supportMessage,
      onSupMsgChange: s.onSupMsgChange,
      supportNickname: s.supportNickname,
      onSupNickChange: s.onSuNickChange,
    }),
    shallow,
  );
  const relatedBroadcasters = useMemo(() => {
    const livBcs =
      goods.LiveShopping?.map((liv) => liv.broadcaster).filter((x) => !!x) || [];
    const ppBcs =
      goods.productPromotion?.map((pp) => pp.broadcaster).filter((x) => !!x) || [];
    const result = livBcs.concat(ppBcs);
    return result.reduce<GoodsRelatedBroadcaster[]>((prev, curr) => {
      if (prev.findIndex((x) => x.userNickname === curr.userNickname) > -1) {
        return prev;
      }
      return prev.concat(curr);
    }, []);
  }, [goods.LiveShopping, goods.productPromotion]);

  // 방송인 선택 아코디언 여닫기 상태
  const [accordionIndex, setAccordionIndex] = useState<ExpandedIndex>([]);
  const handleAccordionIndexChange = (ei: ExpandedIndex): void => {
    setAccordionIndex(ei);
  };

  // 방송인 페이지로부터 접속시 기본값 처리
  const router = useRouter();
  const bcFromPromotionPage = router.query.bc as string;
  useEffect(() => {
    // 방송인페이지로부터 접속된 것이 아니면 기본적으로 후원방송인은 선택하지 않는다
    if (!bcFromPromotionPage) {
      handleSelectBc(null);
    }
    if (relatedBroadcasters && bcFromPromotionPage) {
      const broadcaster = relatedBroadcasters.find(
        (b) => b.id === Number(bcFromPromotionPage),
      );
      if (broadcaster) {
        handleSelectBc(broadcaster);
        handleAccordionIndexChange([0]); // 아코디언 열기
      }
    }
  }, [bcFromPromotionPage, handleSelectBc, relatedBroadcasters]);

  // 현재 상품과 연결된 현재 판매중인 라이브쇼핑 목록
  const ls = useLiveShoppingNowOnLive({ goodsId: goods.id });

  // 후원닉네임 최초값 설정 (등록된 닉네임 있는 경우)
  useEffect(() => {
    if (customer) onSupNickChange(customer?.nickname || '');
  }, [customer, onSupNickChange]);

  if (relatedBroadcasters.length === 0) return null;
  return (
    <Accordion allowToggle index={accordionIndex} onChange={handleAccordionIndexChange}>
      <AccordionItem>
        <AccordionButton px={0}>
          <Flex justify="space-between" w="100%">
            <Text fontSize={{ base: 'sm', md: 'md' }}>방송인 후원하기</Text>
            {selectedBc && selectedBc.userNickname && (
              <Flex key={selectedBc.userNickname} gap={2}>
                <CustomAvatar size="xs" src={selectedBc.avatar || ''} />
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

        <AccordionPanel px={0} pb={1} fontSize="sm">
          {!selectedBc ? (
            <Box>
              <Text mb={2}>후원가능한 방송인</Text>
              {relatedBroadcasters.map((bc) => (
                <Flex key={bc.userNickname} gap={2} alignItems="center">
                  <CustomAvatar size="xs" src={bc.avatar || ''} />
                  {ls.data?.some((l) => l.broadcasterId === bc.id) && (
                    <Badge colorScheme="red" variant="solid">
                      현재 LIVE 판매중
                    </Badge>
                  )}
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
                <Flex justify="center">
                  <CustomAvatar src={selectedBc.avatar || ''} />
                </Flex>
                <Text align="center">{selectedBc.userNickname}</Text>
                {ls.data?.some((l) => l.broadcasterId === selectedBc.id) && (
                  <Badge colorScheme="red" variant="solid">
                    현재 LIVE 판매중
                  </Badge>
                )}
              </Box>

              <Box flex={1}>
                <Text>후원 닉네임</Text>
                <FormControl>
                  <Input
                    rounded="md"
                    placeholder="후원 닉네임"
                    value={supportNickname}
                    onChange={(e) => onSupNickChange(e.target.value)}
                  />
                </FormControl>
                <Text>
                  방송인 후원 메시지{' '}
                  <Text fontSize="xs" as="span" color="GrayText">
                    (최대 30자)
                  </Text>
                </Text>
                <FormControl isInvalid={supportMessage.length >= 30}>
                  <Textarea
                    minH="55px"
                    resize="none"
                    rounded="md"
                    placeholder="방송인 후원 메시지 도네이션 표시글"
                    value={supportMessage}
                    onChange={(e) => onSupMsgChange(e.target.value)}
                  />
                  <FormErrorMessage fontSize="xs">
                    후원 메시지는 30자까지 작성가능합니다.
                  </FormErrorMessage>
                </FormControl>
              </Box>
            </Flex>
          )}
          <GoodsViewSupportNotice />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

function GoodsViewSupportNotice(): JSX.Element {
  const toggle = useDisclosure();
  return (
    <Box pt={2}>
      <ClickableUnderlinedText onClick={toggle.onToggle}>
        방송인 후원이란?
      </ClickableUnderlinedText>

      <Collapse in={toggle.isOpen}>
        <UnorderedList mt={2} color="GrayText" fontSize="xs">
          <ListItem>
            <Text>
              방송인 후원은 주문 금액의 일정량이 방송인에게 돌아가는 후원 형태입니다.
            </Text>
          </ListItem>
          <ListItem>
            <Text>후원 여부와 관계없이 주문 상품은 주문자에게 배송됩니다.</Text>
          </ListItem>
          <ListItem>
            <Text>
              방송인에게 이 상품을 선물하고 싶다면 아래 선물버튼을 클릭하여 선물 절차를
              진행할 수 있습니다.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              방송인이 라이브쇼핑 방송 중인 경우 후원메시지는 방송 화면에 전송됩니다.
            </Text>
          </ListItem>
        </UnorderedList>
      </Collapse>
    </Box>
  );
}

/** 상품 상세 - 주문/선물주문/장바구니 버튼 컴포넌트 및 로직 */
function GoodsViewButtonSet({
  goods,
  isOnDrawer = false,
  pageTransferType = 'router',
}: GoodsViewPurchaseBoxProps): JSX.Element {
  const toast = useToast({ isClosable: true });
  const profile = useProfile();
  const { data: customer } = useCustomerInfo(profile.data?.id);
  const buttonSize = useBreakpointValue({ base: 'lg', md: 'lg' });
  const bgColor = useColorModeValue('white', 'gray.700');
  const router = useRouter();
  const cartDoneDialog = useDisclosure();
  const selectedOpts = useGoodsViewStore((s) => s.selectedOpts);
  const selectedBc = useGoodsViewStore((s) => s.selectedBc);
  const supportMessage = useGoodsViewStore((s) => s.supportMessage);
  const supportNickname = useGoodsViewStore((s) => s.supportNickname);

  /** 선택 상품 옵션 합계 정보 */
  const totalInfo = useMemo(() => {
    return selectedOpts.reduce(
      (prev, curr) => {
        let { quantity, price } = prev;
        if (curr.quantity) quantity += curr.quantity;

        // 라이브쇼핑중인 방송인 선택하여 라이브특가 정보가 있는 경우 - 특가로 계산
        if (curr.specialPrice) {
          price += curr.specialPrice * curr.quantity;
        } else if (curr.price) {
          // 특가정보 없는경우 - 기존 옵션의 가격으로 계산
          price += Number(curr.price) * curr.quantity;
        }

        return { quantity, price };
      },
      { quantity: 0, price: 0 },
    );
  }, [selectedOpts]);

  // 장바구니 담기 또는 바로 주문 이전 가능사항 체크
  const executePurchaseCheck = useCallback((): boolean => {
    // 옵션 선택 여부 체크
    if (!(selectedOpts.length > 0)) {
      toast({ title: '선택된 옵션이 없습니다.', status: 'warning' });
      return false;
    }

    const totalOptsQuantity = selectedOpts.reduce(
      (prev, curr) => prev + curr.quantity,
      0,
    );
    // 최대/최소 주문 개수 제한 체크
    return checkGoodsPurchasable(goods, totalOptsQuantity, {
      onMaxLimitFail: () =>
        toast({
          description: `최대 주문 수량(${goods.max_purchase_ea}개)까지 구매가능합니다.`,
          status: 'warning',
        }),
      onMinLimitFail: () =>
        toast({
          description: `최소 주문 수량(${goods.min_purchase_ea}개)이상 구매해야 합니다.`,
          status: 'warning',
        }),
    });
  }, [goods, selectedOpts, toast]);

  // 현재 상품이 라이브쇼핑 판매중인지 여부 (선택된 방송인에 의한 라이브쇼핑판매)
  const isNowLive = useIsThisGoodsNowOnLive(goods.id, selectedBc?.id);
  // 판매유형 정의
  const sellType = useMemo<SellType>(() => {
    // 방송인 선택시 + 해당 방송인이 현재 이 상품으로 라이브 진행중인 경우
    if (selectedBc && isNowLive) return SellType.liveShopping;
    // 방송인 선택시
    if (selectedBc) return SellType.productPromotion;
    return SellType.normal;
  }, [isNowLive, selectedBc]);

  // 닉네임 수정 요청
  const nicknameMutation = useCustomerInfoMutation(customer?.id || -1);

  // 장바구니 담기
  const createCartItem = useCartMutation();
  const handleCartClick = useCallback((): void => {
    if (!executePurchaseCheck()) return;

    const connectedLiveShoppingId = goods.LiveShopping?.find(
      (ls) => ls.broadcasterId === selectedBc?.id && getLiveShoppingIsNowLive(ls),
    )?.id;
    const connectedProductPromotionId = goods.productPromotion?.find(
      (pp) => pp.broadcasterId === selectedBc?.id,
    )?.id;
    createCartItem
      .mutateAsync({
        goodsId: goods.id,
        options: selectedOpts.map((o) => ({
          discountPrice: o.price,
          normalPrice: o.consumer_price,
          quantity: o.quantity,
          goodsOptionsId: o.id,
          name: o.option_title,
          value: o.option1,
        })),
        shippingGroupId: goods.shippingGroupId,
        channel: sellType,
        support: selectedBc
          ? {
              broadcasterId: selectedBc.id,
              nickname: supportNickname || '',
              message: supportMessage,
              liveShoppingId: connectedLiveShoppingId,
              // 라이브쇼핑 후원의 경우 상품홍보 후원으로는 포함시키지 않는다. (수수료 두번 처리될 가능성)
              productPromotionId: !connectedLiveShoppingId
                ? connectedProductPromotionId
                : undefined,
            }
          : undefined,
      })
      .then(() => {
        // 로그인되어있으며, 기본 설정된 닉네임이 없는 경우 후원닉네임 입력한 값을 기본 닉네임으로 설정
        if (
          profile.data?.id &&
          profile.data?.type === 'customer' &&
          customer &&
          !customer?.nickname &&
          supportNickname
        ) {
          nicknameMutation.mutateAsync({ nickname: supportNickname });
        }
        // 장바구니 담기 성공 후
        // 장바구니로 이동 다이얼로그 열기
        cartDoneDialog.onOpen();

        // add_to_cart 이벤트로 전송할 items 배열
        const items = selectedOpts.map((opt) => ({
          item_id: goods.id,
          item_name: goods.goods_name,
          affiliation: goods.seller.sellerShop?.shopName,
          item_category: goods.categories[0].name,
          item_variant: opt.option1,
          price: Number(opt.price),
          quantity: opt.quantity,
        }));
        // ga4 전자상거래 장바구니 데이터 담기 이벤트 add_to_cart https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm#add_to_cart
        pushDataLayer({
          event: 'add_to_cart',
          ecommerce: {
            items,
            currency: 'KRW',
            value: selectedOpts
              .map((o) => Number(o.price) * o.quantity)
              .reduce((total, cur) => total + cur, 0),
          },
        });
      })
      .catch(() => {
        toast({
          status: 'error',
          title: '장바구니에 담는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        });
      });
  }, [
    executePurchaseCheck,
    goods,
    createCartItem,
    selectedOpts,
    sellType,
    selectedBc,
    supportNickname,
    supportMessage,
    profile.data?.id,
    profile.data?.type,
    customer,
    cartDoneDialog,
    nicknameMutation,
    toast,
  ]);

  const orderPrepare = useKkshowOrderStore((s) => s.handleOrderPrepare);
  const setShopNames = useKkshowOrderStore((s) => s.setShopNames);
  // 주문 클릭시
  const handleOrderClick = useCallback(
    (type: 'gift' | 'instant-order' = 'instant-order'): void => {
      if (!executePurchaseCheck()) return;
      const isGiftOrder = type === 'gift';

      // 상점명 저장
      const shopName = goods.seller.sellerShop?.shopName || '';
      setShopNames([shopName]);

      const connectedLiveShoppingId = goods.LiveShopping?.find(
        (ls) => ls.broadcasterId === selectedBc?.id && getLiveShoppingIsNowLive(ls),
      )?.id;
      const connectedProductPromotionId = goods.productPromotion?.find(
        (pp) => pp.broadcasterId === selectedBc?.id,
      )?.id;

      // 주문정보 저장
      orderPrepare({
        orderPrice: totalInfo.price,
        giftFlag: !!isGiftOrder, // 선물주문플래그
        supportOrderIncludeFlag: isGiftOrder ? true : !!selectedBc, // 선물주문은 언제나 후원이 포함되므로 true 고정
        nonMemberOrderFlag: !profile.data?.id,
        orderItems: [
          {
            goodsName: goods.goods_name,
            goodsId: goods.id,
            options: selectedOpts.map((o) => ({
              goodsOptionId: o.id,
              quantity: o.quantity,
              name: o.option_title,
              value: o.option1,
              normalPrice: Number(o.consumer_price),
              // 진행중인 라이브쇼핑 존재 && 라이브쇼핑 특가 존재하는 경우 특가로 저장
              discountPrice: Number(
                isNowLive && o.specialPrice ? Number(o.specialPrice) : o.price,
              ),
              weight: o.weight,
            })),
            shippingGroupId: goods.shippingGroupId || 1,
            channel: sellType,
            support: selectedBc
              ? {
                  broadcasterId: selectedBc.id,
                  message: supportMessage,
                  nickname: supportNickname || '', // 소비자 닉네임, 비회원의 경우 빈값처리
                  avatar: selectedBc.avatar,
                  liveShoppingId: connectedLiveShoppingId,
                  // 라이브쇼핑 후원의 경우 상품홍보 후원으로는 포함시키지 않는다. (수수료 두번 처리될 가능성)
                  productPromotionId: !connectedLiveShoppingId
                    ? connectedProductPromotionId
                    : undefined,
                }
              : undefined,
          },
        ],
      });

      // 비회원 주문 로그인화면으로 이동, 로그인 이후 페이지를 주문페이지로
      if (!profile.data?.id) {
        const url = `/login?from=purchase&${NEXT_PAGE_PARAM_KEY}=/payment`;
        if (pageTransferType === 'window_open') {
          window.open(`${getKkshowWebHost()}${url}`);
        } else {
          router.push(url);
        }
        return;
      }
      // 로그인되어있으며, 설정된 닉네임이 없는 경우, 입력한 후원닉네임을 기본 닉네임으로 설정
      if (
        profile.data?.id &&
        profile.data?.type === 'customer' &&
        customer &&
        !customer?.nickname &&
        supportNickname
      ) {
        nicknameMutation.mutateAsync({ nickname: supportNickname });
      }

      const url = '/payment';
      if (pageTransferType === 'window_open') {
        window.open(`${getKkshowWebHost()}${url}`);
      } else {
        router.push(url);
      }
    },
    [
      executePurchaseCheck,
      goods.seller.sellerShop?.shopName,
      goods.LiveShopping,
      goods.productPromotion,
      goods.goods_name,
      goods.id,
      goods.shippingGroupId,
      setShopNames,
      orderPrepare,
      totalInfo.price,
      selectedBc,
      profile.data?.id,
      profile.data?.type,
      selectedOpts,
      sellType,
      supportMessage,
      supportNickname,
      customer,
      router,
      isNowLive,
      pageTransferType,
      nicknameMutation,
    ],
  );

  return (
    <Stack bgColor={isOnDrawer ? bgColor : 'unset'}>
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
        {selectedBc && (
          <Tooltip label="방송인에게 선물하기">
            <Button
              isFullWidth
              leftIcon={<GoGift />}
              size={buttonSize}
              colorScheme="pink"
              isDisabled={goods.goods_status !== 'normal'}
              onClick={() => handleOrderClick('gift')}
            >
              선물하기
            </Button>
          </Tooltip>
        )}
        <Button
          isFullWidth
          size={buttonSize}
          colorScheme="blue"
          isDisabled={goods.goods_status !== 'normal'}
          onClick={() => handleOrderClick('instant-order')}
        >
          구매하기
        </Button>
        <Button
          isFullWidth
          size={buttonSize}
          colorScheme="blue"
          isDisabled={goods.goods_status !== 'normal'}
          variant="outline"
          isLoading={createCartItem.isLoading}
          onClick={handleCartClick}
        >
          장바구니 담기
        </Button>
      </ButtonGroup>

      <CartCreateDoneDialog
        isOpen={cartDoneDialog.isOpen}
        onClose={cartDoneDialog.onClose}
      />
    </Stack>
  );
}

interface CartCreateDoneDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
/** 장바구니 담기 완료 알림 모달창 */
function CartCreateDoneDialog({
  isOpen,
  onClose,
}: CartCreateDoneDialogProps): JSX.Element {
  const router = useRouter();
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xs">
      <ModalOverlay />
      <ModalContent maxW={280}>
        <ModalBody my={4} textAlign="center">
          <Box mb={4}>
            <Text>장바구니에 상품을 담았습니다.</Text>
          </Box>
          <ButtonGroup>
            <Button size="sm" colorScheme="blue" variant="solid" onClick={onClose}>
              계속 쇼핑하기
            </Button>
            <Button
              size="sm"
              colorScheme="blue"
              variant="outline"
              onClick={() => router.push('/cart')}
            >
              장바구니 확인
            </Button>
          </ButtonGroup>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
