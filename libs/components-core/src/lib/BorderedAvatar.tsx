import { Avatar, AvatarProps } from '@chakra-ui/avatar';

export function BorderedAvatar(props: AvatarProps): JSX.Element {
  return <Avatar border="4px solid white" {...props} />;
}

export default BorderedAvatar;
