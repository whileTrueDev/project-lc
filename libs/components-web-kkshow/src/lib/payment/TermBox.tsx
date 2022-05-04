import {
  Box,
  Text,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { HtmlStringBox } from '@project-lc/components-core/TermBox';
import { useTerms } from '@project-lc/hooks';
import { DummyOrder } from './OrderItemInfo';
// TODO: 약관 정의 이후 내용 변경
export function TermBox({ shopName }: { shopName: string }): JSX.Element {
  const terms = [
    {
      title: '개인정보 제공 동의',
      component: (
        <HtmlStringBox
          htmlString={useTerms({ userType: 'broadcaster' }).broadcasterTerms[0].text}
        />
      ),
    },
    {
      title: '개인정보 수집 및 이용 동의',
      component: (
        <HtmlStringBox
          htmlString={useTerms({ userType: 'broadcaster' }).broadcasterTerms[1].text}
        />
      ),
    },
    {
      title: '주문상품정보 동의',
      component: (
        <Text fontSize="xs">주문 상품의 상품명, 가격, 배송정보에 동의합니다.</Text>
      ),
    },
  ];

  return (
    <Flex direction="column">
      {terms.map((item) => (
        <Popover key={item.title}>
          <PopoverTrigger>
            <HStack>
              {item.title === '개인정보 제공 동의' ? (
                <>
                  <Text variant="span" fontSize="xs">
                    {item.title}
                  </Text>
                  <Text variant="span" fontSize="xs">
                    :
                  </Text>
                  <Text variant="span" color="blue" fontSize="xs">
                    {shopName}
                  </Text>
                </>
              ) : (
                <Text fontSize="xs">{item.title}</Text>
              )}
              <Box as="button" color="gray.500" type="button">
                <Text as="u" fontSize="xs">
                  보기
                </Text>
              </Box>
            </HStack>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>
              <PopoverCloseButton />
            </PopoverHeader>
            <PopoverBody>
              <Box
                overflow="scroll"
                h="200px"
                mb={3}
                border="1px solid"
                borderColor="gray.300"
              >
                {item.component}
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      ))}
    </Flex>
  );
}
