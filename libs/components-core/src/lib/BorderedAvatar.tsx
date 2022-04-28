import { Avatar, AvatarProps } from '@chakra-ui/avatar';
import { useColorModeValue } from '@chakra-ui/react';

export function BorderedAvatar(props: AvatarProps): JSX.Element {
  const borderColor = useColorModeValue('white', 'whiteAlpha.600');
  return <Avatar borderColor={borderColor} borderWidth="4px" {...props} />;
}

export default BorderedAvatar;
