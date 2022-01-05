import { Text, TextProps } from '@chakra-ui/layout';

export function BoldText({
  children,
  ...rest
}: { children: React.ReactNode } & TextProps): JSX.Element {
  return (
    <Text fontWeight="bold" {...rest}>
      {children}
    </Text>
  );
}

export default BoldText;
