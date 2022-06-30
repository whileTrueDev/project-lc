import { Avatar, Grid, GridItem, Text } from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import { AvatarChangeButton } from './AvatarChangeButton';

interface ProfileBoxProps {
  allowAvatarChange?: boolean;
  onAvatarChangeButtonClick?: () => void;
}
export function ProfileBox({
  allowAvatarChange = false,
  onAvatarChangeButtonClick,
}: ProfileBoxProps): JSX.Element {
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
        {allowAvatarChange ? (
          <AvatarChangeButton onClick={onAvatarChangeButtonClick} />
        ) : (
          <Avatar src={data?.avatar} />
        )}
      </GridItem>
      <GridItem colSpan={3} isTruncated>
        <Text isTruncated fontWeight="bold">
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
