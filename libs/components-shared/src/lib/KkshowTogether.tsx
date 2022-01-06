import { Box, Button, Heading, Stack } from '@chakra-ui/react';

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
    <Box
      px={8}
      pt={10}
      pb={20}
      minH={300}
      backgroundImage="images/vector-smart-object.png"
      backgroundSize="cover"
      backgroundPosition={{
        base: '61%',
        md: 'right 30% bottom 100%',
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
  );
}

export default KkshowTogether;
