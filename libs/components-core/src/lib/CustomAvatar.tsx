import { Avatar, AvatarProps } from '@chakra-ui/react';
import { useResizedImage } from '@project-lc/hooks';

/**
 * resized 이미지 불러오기 기능이 추가된 Avatar.
 * onError prop을 사용하지 못하는 것을 제외하고는 기능,props 모두 Chakra-ui의 Avatar와 동일하다 */
export function CustomAvatar(props: AvatarProps): JSX.Element {
  const resizedImageProps = useResizedImage(props.src);
  return <Avatar {...props} {...resizedImageProps} />;
}
export default CustomAvatar;
