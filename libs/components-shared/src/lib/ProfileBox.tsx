import { Avatar, Grid, GridItem, Text } from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import { AvatarChangeButton } from './AvatarChangeButton';

export function ProfileBox({
  allowAvatarChange = false,
}: {
  allowAvatarChange?: boolean;
}): JSX.Element {
  const { data } = useProfile();

  return (
    <Grid
      maxWidth="sm"
      h="60px"
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(4, 1fr)"
    >
      <GridItem
        rowSpan={2}
        colSpan={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {allowAvatarChange ? <AvatarChangeButton /> : <Avatar src={data?.avatar} />}
      </GridItem>
      <GridItem colSpan={3} isTruncated>
        <Text isTruncated fontWeight="bold">
          {data?.email}
          {data?.email}
        </Text>
      </GridItem>
      <GridItem colSpan={3} isTruncated>
        <Text isTruncated>{data?.name}</Text>
      </GridItem>
    </Grid>
  );
}

export default ProfileBox;
