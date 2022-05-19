import { Box, Text, Grid, GridItem, Input, Button, HStack } from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';

export function Profile({ data }): JSX.Element {
  return (
    <Grid p={3} templateColumns="repeat(4,4fr)">
      <GridItem colSpan={1}>
        <Text fontWeight="bold">메일</Text>
      </GridItem>
      <GridItem colSpan={3}>
        <Text>{data.email}</Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Text fontWeight="bold">비밀번호</Text>
      </GridItem>
      <GridItem colSpan={3}>
        <HStack>
          <Input type="password" w="60%" />
          <Button>확인</Button>
        </HStack>
      </GridItem>
    </Grid>
  );
}

export default Profile;
