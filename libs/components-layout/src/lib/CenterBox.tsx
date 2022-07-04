import { Box, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

export interface CenterBoxProps {
  enableShadow?: boolean;
  header: {
    title: string;
    desc: string;
  };
  children: React.ReactNode;
}

export function CenterBox({
  enableShadow = false,
  header,
  children,
}: CenterBoxProps): JSX.Element {
  return (
    <Stack spacing={8} mx="auto" maxW="lg" w="100%">
      <Box
        rounded="lg"
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={enableShadow ? 'md' : ''}
        p={8}
      >
        <Stack>
          <Text fontWeight="bold" fontSize="3xl">
            {header.title}
          </Text>
          <Text
            fontSize="sm"
            color={useColorModeValue('gray.600', 'gray.400')}
            mt={2}
            whiteSpace="pre-line"
          >
            {header.desc}
          </Text>
        </Stack>
        <Stack>{children}</Stack>
      </Box>
    </Stack>
  );
}

export default CenterBox;
