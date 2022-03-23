import { Box, BoxProps, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { StarRating } from '@project-lc/components-core/StarRating';
import { KkshowShoppingTabReviewData } from '@project-lc/shared-types';
import dayjs from 'dayjs';

interface GoodsReviewDisplayProps {
  review: KkshowShoppingTabReviewData;
  variant?: 'overlay' | 'seperated';
}
export function GoodsReviewDisplay({
  review,
  variant = 'seperated',
}: GoodsReviewDisplayProps): JSX.Element {
  const GoodsReviewDisplayContainer = (props: BoxProps): JSX.Element => {
    if (variant === 'overlay')
      return (
        <Box
          {...props}
          color="white"
          bgColor="blackAlpha.700"
          position="absolute"
          opacity={0}
          _groupHover={{ opacity: 1 }}
          transition="all 0.2s"
        />
      );
    return <Box {...props} />;
  };
  return (
    <Box position="relative">
      <Image borderRadius="xl" src={review.imageUrl} />
      <GoodsReviewDisplayContainer
        maxH={150}
        p={2}
        w="100%"
        h="50%"
        bottom={0}
        fontSize="xs"
      >
        <Flex justify="space-between">
          <StarRating rating={review.rating} />
          <Text fontSize="xs">{dayjs(review.createDate).format('YYYY.MM.DD')}</Text>
        </Flex>
        <Heading mb={3} fontSize="md">
          {review.title}
        </Heading>
        <Text fontSize="xs" noOfLines={3}>
          {review.contents}
        </Text>
      </GoodsReviewDisplayContainer>
    </Box>
  );
}

export default GoodsReviewDisplay;
