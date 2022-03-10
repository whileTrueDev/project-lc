import { Text, TextProps } from '@chakra-ui/react';

export interface RedLinedTextProps extends TextProps {
  rotateDeg?: number;
}
export function RedLinedText({
  rotateDeg = -5,
  ...props
}: RedLinedTextProps): JSX.Element {
  return (
    <Text
      {...props}
      pos="relative"
      _before={{
        position: 'absolute',
        content: '""',
        left: 0,
        right: 1,
        top: '40%',
        borderTop: '1px solid',
        borderColor: 'red',
        transform: `rotate(${rotateDeg}deg)`,
      }}
    />
  );
}

export default RedLinedText;
