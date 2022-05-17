/* eslint-disable react/no-array-index-key */
import { Flex, Icon, IconProps } from '@chakra-ui/react';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

const STAR_RATING_MAX = 5;
interface StarRatingProps {
  /** 0 ~ 5까지의 0.5단위의 숫자 */
  rating: number;
  color?: IconProps['color'];
}
export function StarRating({ rating, color }: StarRatingProps): JSX.Element {
  const realRating = Math.min(STAR_RATING_MAX, rating);
  const howManyFullStar = Math.floor(realRating);
  const needHalfStar = !!Math.ceil(realRating - howManyFullStar);

  const howManyEmptyStar = STAR_RATING_MAX - (howManyFullStar + (needHalfStar ? 1 : 0));

  return (
    <Flex>
      {new Array(howManyFullStar).fill(0).map((_, index) => (
        <Icon key={index} as={BsStarFill} color={color} />
      ))}
      {needHalfStar && <Icon as={BsStarHalf} color={color} />}
      {new Array(howManyEmptyStar).fill(0).map((_, index) => (
        <Icon color="gray.500" key={index} as={BsStar} />
      ))}
    </Flex>
  );
}
export default StarRating;
