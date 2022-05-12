import { Box, BoxProps, Divider, Text } from '@chakra-ui/react';

/** 주문 상세 섹션 */
export function SectionWithTitle({
  title,
  children,
  disableDivider = false,
  variant = 'unstyle',
  titleMarginY = 2,
}: {
  children: React.ReactNode;
  title: string;
  disableDivider?: boolean;
  variant?: 'unstyle' | 'outlined';
  titleMarginY?: BoxProps['my'];
}): JSX.Element {
  if (variant === 'outlined') {
    return (
      <Box as="section" id={title} borderWidth="1px" borderRadius="lg" p={4}>
        <Text as="h4" fontSize="xl" isTruncated my={titleMarginY} fontWeight="bold">
          {title}
        </Text>
        {children}
      </Box>
    );
  }

  return (
    <>
      {disableDivider ? null : <Divider />}
      <Box as="section" id={title}>
        <Text as="h4" fontSize="xl" isTruncated my={titleMarginY} fontWeight="bold">
          {title}
        </Text>
        {children}
      </Box>
    </>
  );
}

export default SectionWithTitle;
