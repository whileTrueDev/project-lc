import { List, ListIcon, ListItem } from '@chakra-ui/react';
import {
  convertOrderSitetypeToString,
  FindFmOrderDetailRes,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { AiTwotoneEnvironment } from 'react-icons/ai';
import { FaBoxOpen } from 'react-icons/fa';
import { IoMdPerson } from 'react-icons/io';
import { MdDateRange } from 'react-icons/md';

export interface OrderDetailSummaryProps {
  order: FindFmOrderDetailRes;
}
export function OrderDetailSummary({ order }: OrderDetailSummaryProps) {
  return (
    <List spacing={2}>
      <ListItem isTruncated>
        <ListIcon boxSize="1.5rem" as={MdDateRange} color="green.500" />
        주문일시 {dayjs(order.regist_date).format('YYYY년 MM월 DD일 HH:mm:ss')}
      </ListItem>
      <ListItem isTruncated>
        <ListIcon boxSize="1.5rem" as={IoMdPerson} color="green.500" />
        주문자 {order.order_user_name}
      </ListItem>
      <ListItem isTruncated>
        <ListIcon boxSize="1.5rem" as={FaBoxOpen} color="green.500" />
        수령자 {order.recipient_user_name}
      </ListItem>
      <ListItem isTruncated>
        <ListIcon boxSize="1.5rem" as={AiTwotoneEnvironment} color="green.500" />
        {convertOrderSitetypeToString(order.sitetype)}에서 주문
      </ListItem>
    </List>
  );
}
