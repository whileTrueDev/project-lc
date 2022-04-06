import { VStack, Text } from '@chakra-ui/react';

interface SettingSectionLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export function SettingSectionLayout(props: SettingSectionLayoutProps): JSX.Element {
  const { title, children } = props;
  return (
    <VStack spacing={4} alignItems="flex-start" padding={2} width="100%">
      {title && (
        <Text as="h6" fontSize="lg" fontWeight="bold">
          {title}
        </Text>
      )}
      {children}
    </VStack>
  );
}

export default SettingSectionLayout;
