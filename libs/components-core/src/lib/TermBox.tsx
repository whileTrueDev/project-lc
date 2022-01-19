import { Box } from '@chakra-ui/react';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';

/** 이용약관 등 긴 문구를 스크롤되는 박스 안에 표시하는 컴포넌트 */
export default function TermBox({ text }: { text: string }): JSX.Element {
  return (
    <Box
      maxHeight={100}
      {...boxStyle}
      mb={1}
      overflowY="auto"
      fontSize="sm"
      whiteSpace="pre-line"
    >
      {text}
    </Box>
  );
}
