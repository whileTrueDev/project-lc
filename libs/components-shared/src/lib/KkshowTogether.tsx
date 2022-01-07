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
        px={{ base: 4, sm: 8 }}
        pt={10}
        pb={12}
        minH={300}
        maxW={1280}
        margin="auto"
        w="100%"
        backgroundImage="images/vector-smart-object.png"
        backgroundPosition={{
          base: 'right -300px bottom 0px',
          sm: 'right -150px bottom 0px',
          md: 'right 0 bottom 100%',
        }}
        backgroundRepeat="no-repeat"
      >
        <Box margin="auto" maxW={1080}>
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

export default KkshowTogether;
