import {
  Badge,
  Box,
  Heading,
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { BorderedAvatar } from '@project-lc/components-core/BorderedAvatar';
import { RedLinedText } from '@project-lc/components-core/RedLinedText';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import Link from 'next/link';

export interface LiveShoppingPreviewBoxProps {
  title: string;
  normalPrice: string | number;
  discountedPrice: string | number;
  productImageUrl: string;
  profileImageUrl: string;
  productLinkUrl: string;
  liveShoppingStatus?: 'live' | 'upcoming' | 'ended';
  isExternal?: boolean;
}
export function LiveShoppingPreviewBox({
  title,
  normalPrice,
  discountedPrice,
  productImageUrl,
  profileImageUrl,
  productLinkUrl,
  liveShoppingStatus,
  isExternal = false,
}: LiveShoppingPreviewBoxProps): JSX.Element {
  const avatarSize = useBreakpointValue({ base: 'xl', md: 'xl' });
  let badgeColor = 'gray';
  let badgeText = '';
  if (liveShoppingStatus === 'live') {
    badgeColor = 'red';
    badgeText = 'LIVE';
  } else if (liveShoppingStatus === 'upcoming') {
    badgeColor = 'green';
    badgeText = '예정';
  } else if (liveShoppingStatus === 'ended') {
    badgeColor = 'gray';
    badgeText = '완료';
  }
  return (
    <HStack maxH={100} alignItems="center" spacing={{ base: 2, sm: 4 }}>
      <BorderedAvatar size={avatarSize} src={profileImageUrl} />
      <LinkBox w="100%" h="100%">
        <HStack
          color="blackAlpha.900"
          bgColor="white"
          borderRadius="xl"
          justify="space-around"
          alignItems="center"
          p={{ base: 4, lg: 2 }}
          px={{ base: 2, sm: 4, lg: 6 }}
          textAlign={['center', 'unset']}
          spacing={4}
        >
          <Box>
            <Link passHref href={productLinkUrl}>
              <LinkOverlay isExternal={isExternal}>
                <Heading
                  fontSize={{ base: 'lg', lg: 'xl' }}
                  fontWeight="medium"
                  noOfLines={{ base: 1, sm: 2 }}
                  maxW={280}
                >
                  {badgeText && (
                    <Badge
                      mr={1}
                      py={{ base: 1, md: 1.5 }}
                      px={2}
                      variant="solid"
                      bgColor={badgeColor}
                      color="whiteAlpha.900"
                      rounded="md"
                    >
                      {badgeText}
                    </Badge>
                  )}
                  {title}
                </Heading>
              </LinkOverlay>
            </Link>
            <Heading lineHeight={1}>
              <RedLinedText
                as="span"
                fontSize={{ base: 'sm', lg: 'md' }}
                fontWeight="medium"
              >
                {getLocaleNumber(normalPrice)}원
              </RedLinedText>{' '}
              <Text
                as="span"
                fontSize={{ base: 'md', lg: 'lg' }}
                color="red"
                fontWeight="bold"
              >
                {getLocaleNumber(discountedPrice)}원
              </Text>
            </Heading>
          </Box>

          <Box display={{ base: 'none', sm: 'block' }}>
            <Image
              src={productImageUrl}
              w={{ base: '65px', lg: '85px' }}
              h={{ base: '65px', lg: '85px' }}
              rounded="md"
            />
          </Box>
        </HStack>
      </LinkBox>
    </HStack>
  );
}

export default LiveShoppingPreviewBox;
