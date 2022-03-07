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
    badgeText = 'upcoming';
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
          p={[2, 4]}
          px={[2, 6]}
          textAlign={['center', 'unset']}
          spacing={4}
        >
          <Box>
            <Link passHref href={productLinkUrl}>
              <LinkOverlay isExternal={isExternal}>
                <Heading fontSize="lg" fontWeight="medium" noOfLines={2} maxW={280}>
                  {badgeText && (
                    <Badge
                      mr={1}
                      p={1}
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
              <RedLinedText as="span" fontSize="sm" fontWeight="medium">
                {normalPrice.toLocaleString()}원
              </RedLinedText>{' '}
              <Text as="span" fontSize="md" color="red" fontWeight="bold">
                {discountedPrice.toLocaleString()}원
              </Text>
            </Heading>
          </Box>

          <Box display={{ base: 'none', sm: 'block' }}>
            <Image src={productImageUrl} w="65px" h="65px" />
          </Box>
        </HStack>
      </LinkBox>
    </HStack>
  );
}

export default LiveShoppingPreviewBox;
