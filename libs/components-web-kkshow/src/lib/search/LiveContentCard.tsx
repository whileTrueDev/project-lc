import {
  AspectRatio,
  Box,
  Icon,
  Image,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import MotionBox from '@project-lc/components-core/MotionBox';
import { SearchResultItem } from '@project-lc/shared-types';
import NextLink from 'next/link';
import { FaPlayCircle } from 'react-icons/fa';

const overlay = {
  normal: {
    display: 'none',
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
  hover: {
    display: 'flex',
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};
export function LiveContentCard({ item }: { item: SearchResultItem }): JSX.Element {
  return (
    <MotionBox initial="normal" whileHover="hover">
      <LinkBox>
        <NextLink href={item.linkUrl} passHref>
          <LinkOverlay isExternal={item.linkUrl.includes('http')}>
            <Stack>
              <Box rounded="xl" overflow="hidden" position="relative">
                <AspectRatio ratio={16 / 9}>
                  <Image src={item.imageUrl} objectFit="cover" />
                </AspectRatio>

                <MotionBox
                  variants={overlay}
                  position="absolute"
                  left="0"
                  right="0"
                  bottom="0"
                  top="0"
                  bg="rgba(0,0,0,0.3)"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Icon as={FaPlayCircle} color="white" fontSize="6xl" />
                </MotionBox>
              </Box>
              <Text fontFamily="Gmarket Sans" fontWeight="bold">
                {item.title}
              </Text>
            </Stack>
          </LinkOverlay>
        </NextLink>
      </LinkBox>
    </MotionBox>
  );
}

export default LiveContentCard;
