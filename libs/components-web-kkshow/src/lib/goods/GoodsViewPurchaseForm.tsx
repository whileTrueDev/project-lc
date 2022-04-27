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
  Select,
  Stack,
  Text,
} from '@chakra-ui/react';
import { GoodsByIdRes } from '@project-lc/shared-types';
import { useState } from 'react';
import { GoGift } from 'react-icons/go';

interface GoodsViewPurchaseFormProps {
  goods: GoodsByIdRes;
}
/** 상품 상세 페이지 상품 옵션 및 후원 정보 입력 */
export function GoodsViewPurchaseForm({
  goods,
}: GoodsViewPurchaseFormProps): JSX.Element {
  const [selectedOpts, setSelectedOpts] = useState<GoodsByIdRes['options'][number][]>([]);
  const handleOptionSelect = (opt: GoodsByIdRes['options'][number]): void => {
    if (selectedOpts.findIndex((x) => x.id === opt.id) > -1) {
      alert('동일한 옵션을 추가함. 그럴 수 없음');
    } else {
      setSelectedOpts(selectedOpts.concat(opt));
    }
  };

  console.log('selectedOpts: ', selectedOpts);

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
                icon={<CloseIcon />}
              />
            </Flex>
          ))}
        </Stack>
      </GridItem>

      {/* 방송인 후원 */}
      <GridItem colSpan={3}>
        <Accordion allowToggle>
          <AccordionItem>
            <AccordionButton px={0}>
              <Flex justify="space-between" w="100%">
                <Text fontWeight="medium" fontSize="md">
                  방송인 후원하기
                </Text>
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
                  <Input placeholder="방송인 후원 메시지 도네이션 표시글" maxW={300} />
                </Box>
              </Flex>
              {/* 방송인에게 선물 버튼 */}
              <Box textAlign="right">
                <Button leftIcon={<GoGift />} variant="outline">
                  방송인에게 선물하기
                </Button>
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
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
          <Flex gap={2}>
            <Button size="lg" isFullWidth colorScheme="blue" variant="outline">
              장바구니
            </Button>
          </Flex>
        </Stack>
      </GridItem>
    </Grid>
  );
}
