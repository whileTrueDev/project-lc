import { Box, BoxProps, Flex, Heading, Text } from '@chakra-ui/react';
import { MotionBox } from '@project-lc/components-core/MotionBox';
import { useDisplaySize } from '@project-lc/hooks';
import { useMemo } from 'react';

export interface MainSectionLayoutProps extends BoxProps {
  children: React.ReactChild | React.ReactChild[];
  _title: string | { mobile: string; pc: string };
  subtitle?: string;
  whiteIndicator?: boolean;
}
export function MainSectionLayout({
  children,
  _title,
  subtitle,
  whiteIndicator = false,
  ...rest
}: MainSectionLayoutProps): JSX.Element {
  const displaySize = useDisplaySize();
  const title = useMemo(() => {
    if (typeof _title === 'string') {
      return _title;
    }
    if (displaySize.isMobileSize) return _title.mobile;
    return _title.pc;
  }, [_title, displaySize.isMobileSize]);
  return (
    <Box {...rest}>
      <Flex
        maxW="6xl"
        margin="auto"
        mt={12}
        mb={6}
        p={4}
        gap={4}
        flexDir="column"
        position="relative"
        alignItems={{ base: 'center', xl: 'unset' }}
        textAlign={{ base: 'center', xl: 'unset' }}
      >
        <MotionBox
          w={20}
          height={1}
          position={{ base: 'static', xl: 'absolute' }}
          top={{ base: 0, xl: 8 }}
          left={{ base: 0, xl: -20 }}
          bgColor={whiteIndicator ? 'white' : 'blue'}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
          viewport={{ once: true }}
        />
        <Box>
          <Heading fontSize="3xl" whiteSpace="break-spaces">
            {title}
          </Heading>
          {subtitle && (
            <Text mt={2} fontWeight="medium">
              {subtitle}
            </Text>
          )}
        </Box>
      </Flex>

      {children}
    </Box>
  );
}
export default MainSectionLayout;
