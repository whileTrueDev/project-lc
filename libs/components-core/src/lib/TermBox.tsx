import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import 'suneditor/dist/css/suneditor.min.css';

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

/** html string 형태의 텍스트 표시하는 컴포넌트(css 적용되어있음) */
export function HtmlStringBox(props: BoxProps & { htmlString: string }): JSX.Element {
  const { htmlString, ...rest } = props;
  const bgColor = useColorModeValue('white', 'gray.700');
  const fontColor = useColorModeValue('gray.800', 'white');
  return (
    <Box
      {...rest}
      className="sun-editor-editable"
      bg={bgColor}
      color={fontColor}
      dangerouslySetInnerHTML={{ __html: htmlString }}
    />
  );
}
