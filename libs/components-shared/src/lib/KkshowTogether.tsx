import { Box, Button, Heading, Stack, useColorModeValue } from '@chakra-ui/react';

export type KkshowTogetherButtonOption = {
  label: string;
  onClick: () => void;
};
export interface KkshowTogetherProps {
  buttons?: KkshowTogetherButtonOption[];
}
export function KkshowTogether({
  buttons = [
    { label: '판매자 센터', onClick: () => window.open('https://판매자.크크쇼.com') },
    { label: '방송인 센터', onClick: () => window.open('https://방송인.크크쇼.com') },
  ],
}: KkshowTogetherProps): JSX.Element {
  return (
    <Box bg={useColorModeValue('gray.50', 'inherit')}>
      <Box
        maxW="6xl"
        px={4}
        pt={20}
        pb={12}
        minH={350}
        margin="auto"
        w="100%"
        backgroundImage="/images/main/together.png"
        backgroundPosition={{
          base: 'right -400px bottom 0px',
          sm: 'right -280px bottom 0px',
          md: 'right 0 bottom 100%',
        }}
        backgroundSize={{ base: 'cover', sm: 'auto 350px' }}
        backgroundRepeat="no-repeat"
      >
        <Box margin="auto">
          <Heading fontWeight={900}>크크쇼와 </Heading>
          <Heading fontWeight={900}>함께 하시겠습니까?</Heading>
          <Stack mt={4} direction={{ base: 'column', md: 'row' }}>
            {buttons.slice(0, 2).map((btn) => (
              <Button
                key={btn.label}
                colorScheme="blue"
                size="lg"
                maxW="120px"
                onClick={btn.onClick}
              >
                {btn.label}
              </Button>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
