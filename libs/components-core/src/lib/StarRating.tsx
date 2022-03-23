/* eslint-disable react/no-array-index-key */
import { Flex, Icon } from '@chakra-ui/react';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

const STAR_RATING_MAX = 5;
interface StarRatingProps {
  /** 0 ~ 5까지의 0.5단위의 숫자 */
  rating: number;
}
export function StarRating({ rating }: StarRatingProps): JSX.Element {
  const realRating = Math.min(STAR_RATING_MAX, rating);
  const howManyFullStar = Math.floor(realRating);
  const needHalfStar = !!Math.ceil(realRating - howManyFullStar);

  const howManyEmptyStar = STAR_RATING_MAX - (howManyFullStar + (needHalfStar ? 1 : 0));

  return (
    <Flex>
      {new Array(howManyFullStar).fill(0).map((_, index) => (
        <Icon key={index} as={BsStarFill} />
      ))}
      {needHalfStar && <BsStarHalf />}
      {new Array(howManyEmptyStar).fill(0).map((_, index) => (
        <Icon color="gray.500" key={index} as={BsStar} />
      ))}
    </Flex>
  );
}
export default StarRating;
