import { Avatar, Center, Grid, GridItem, Text } from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';

export function ProfileBox(): JSX.Element {
  const { data } = useProfile();
  return (
    <Grid
      maxWidth="sm"
      h="60px"
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(4, 1fr)"
    >
      <GridItem rowSpan={2} colSpan={1}>
        <Center>
          <Avatar />
        </Center>
      </GridItem>
      <GridItem colSpan={3}>
        <Text fontWeight="bold">{data?.email}</Text>
      </GridItem>
      <GridItem colSpan={3}>
        <Text>{data?.name}</Text>
      </GridItem>
    </Grid>
  );
}

export default ProfileBox;
