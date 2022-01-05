import { Tooltip, Text } from '@chakra-ui/react';

interface TooltipedTextProps {
  text: string;
}
export function TooltipedText({ text }: TooltipedTextProps): JSX.Element {
  return (
    <Tooltip bgColor="gray.800" color="white" label={text}>
      <Text isTruncated>{text}</Text>
    </Tooltip>
  );
}

export default TooltipedText;
