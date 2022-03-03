import { Box, BoxProps, Button, ButtonGroup, Container } from '@chakra-ui/react';
import { getWebHost, getBroadcasterWebHost } from '@project-lc/utils';
import router from 'next/router';

export function KKshowMainExternLinks(props: BoxProps): JSX.Element {
  return (
    <Box {...props}>
      <Container maxW="6xl" pt={4} px={{ base: 2, sm: 4 }}>
        <ButtonGroup gap={1} size="xs">
          <Button
            variant="outline"
            onClick={() => {
              router.push(getWebHost());
            }}
          >
            판매자센터 바로가기
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              router.push(getBroadcasterWebHost());
            }}
          >
            방송인센터 바로가기
          </Button>
        </ButtonGroup>
      </Container>
    </Box>
  );
}

export default KKshowMainExternLinks;
