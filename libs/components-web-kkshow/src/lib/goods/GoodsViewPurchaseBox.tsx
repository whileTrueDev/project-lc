import { CloseIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Input,
  ListItem,
  Select,
  Stack,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { Broadcaster } from '@prisma/client';
import { GoodsByIdRes } from '@project-lc/shared-types';
import { useMemo, useState } from 'react';
import { GoGift } from 'react-icons/go';

interface GoodsViewPurchaseBoxProps {
  goods: GoodsByIdRes;
}
/** 상품 상세 페이지 상품 옵션 및 후원 정보 입력 + 구매,장바구니 버튼 */
export function GoodsViewPurchaseBox({ goods }: GoodsViewPurchaseBoxProps): JSX.Element {
  const [selectedOpts, setSelectedOpts] = useState<GoodsByIdRes['options'][number][]>([]);
  const handleOptionSelect = (opt: GoodsByIdRes['options'][number]): void => {
    if (selectedOpts.findIndex((x) => x.id === opt.id) > -1) {
      alert('동일한 옵션을 추가함. 그럴 수 없음');
    } else {
      setSelectedOpts(selectedOpts.concat(opt));
    }
  };
  const handleOptionRemove = (targetOptId: number): void => {
    setSelectedOpts(selectedOpts.filter((o) => o.id !== targetOptId));
  };

  return (
    <Grid
      templateColumns="1fr 2fr"
      mt={6}
      display={{ base: 'none', md: 'grid' }}
      gridRowGap={2}
    >
      {/* 옵션 */}
      <GridItem>
        <Text>옵션</Text>
      </GridItem>
      <GridItem colSpan={2}>
        <Select
          rounded="md"
          size="sm"
          placeholder="옵션 선택창이 들어갈 공간"
          onChange={(e): void => {
            const targetOpt = goods.options.find((o) => o.id === Number(e.target.value));
            if (targetOpt) {
              handleOptionSelect(targetOpt);
            }
          }}
        >
          {goods.options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.option_title}: {opt.option1} ({opt.price})
            </option>
          ))}
        </Select>
      </GridItem>

      <GridItem colSpan={3} fontSize="sm">
        {/* 선택된 옵션 목록 */}
        <Stack
          mt={2}
          maxH={{ base: 200, md: 'unset' }}
          overflowY={{ base: 'scroll', md: 'unset' }}
        >
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
                <Text>
                  {opt.option_title} : {opt.option1}
                </Text>
                <Text>1개</Text>
              </Box>
              <IconButton
                color="GrayText"
                size="xs"
                variant="unstyled"
                aria-label="delete-option"
                onClick={() => handleOptionRemove(opt.id)}
                icon={<CloseIcon />}
              />
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
        <Stack>
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

          <Button size="lg" isFullWidth colorScheme="blue">
            구매하기
          </Button>
          <Button size="lg" isFullWidth colorScheme="blue" variant="outline">
            장바구니
          </Button>
          {/* 방송인에게 선물 버튼 */}
          {/* // TODO: 선택된 방송인이 있을 때만 렌더링 처리 */}
          <Button
            isFullWidth
            size="lg"
            leftIcon={<GoGift />}
            colorScheme="facebook"
            variant="outline"
          >
            방송인에게 선물하기
          </Button>
        </Stack>
      </GridItem>
    </Grid>
  );
}

function GoodsViewBroadcasterSupportBox({
  goods,
}: GoodsViewPurchaseBoxProps): JSX.Element | null {
  const [selectedBc, setSelectedBc] = useState<any>(null);
  console.log(selectedBc);

  const relatedBroadcasters = useMemo(() => {
    const livBcs = goods.LiveShopping?.map((liv) => liv.broadcaster) || [];
    const ppBcs = goods.productPromotion?.map((liv) => liv.broadcaster) || [];
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
            <Text fontWeight="medium" fontSize="md">
              방송인 후원하기
            </Text>
            {selectedBc && (
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
                  <Button
                    onClick={() => {
                      setSelectedBc(bc);
                    }}
                    size="xs"
                  >
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
                    onClick={() => setSelectedBc(null)}
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
              <Text>후원메시지는 라이브방송 중인 경우 방송 화면에 전송됩니다.</Text>
            </ListItem>
            <ListItem>
              <Text>
                방송인에게 선물하기 버튼을 클릭하여 이 상품을 후원 방송인에게 선물할 수
                있습니다.
              </Text>
            </ListItem>
          </UnorderedList>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
