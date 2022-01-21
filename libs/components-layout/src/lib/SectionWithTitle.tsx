import { Box, Divider, Heading } from '@chakra-ui/react';

/** 주문 상세 섹션 */
export function SectionWithTitle({
  title,
  children,
  disableDivider = false,
  variant = 'unstyle',
}: {
  children: React.ReactNode;
  title: string;
  disableDivider?: boolean;
  variant?: 'unstyle' | 'outlined';
}): JSX.Element {
  if (variant === 'outlined') {
    return (
      <Box as="section" id={title} borderWidth="1px" borderRadius="lg" p={4}>
        <Heading as="h4" size="md" isTruncated my={2}>
          {title}
        </Heading>
        {children}
      </Box>
    );
  }
  return (
    <>
      {disableDivider ? null : <Divider />}
      <Box as="section" id={title}>
        <Heading as="h4" size="md" isTruncated my={2}>
          {title}
        </Heading>
        {children}
      </Box>
    </>
  );
}

export default SectionWithTitle;
