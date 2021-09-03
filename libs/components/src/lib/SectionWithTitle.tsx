import { Box, Divider, Heading } from '@chakra-ui/react';

/** 주문 상세 섹션 */
export function SectionWithTitle({
  title,
  children,
  disableDivider = false,
}: {
  children: React.ReactNode;
  title: string;
  disableDivider?: boolean;
}) {
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
