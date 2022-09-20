/* eslint-disable react/no-array-index-key */
import { Box, Flex, Text } from '@chakra-ui/react';
import { CustomAvatar } from '@project-lc/components-core/CustomAvatar';
import dayjs from 'dayjs';
import 'suneditor/dist/css/suneditor.min.css';

export interface ReplyTextProps {
  avatar: string;
  name: string;
  createDate?: string | Date;
  content: string;
}
export function ReplyText({
  avatar,
  name,
  createDate,
  content,
}: ReplyTextProps): JSX.Element {
  return (
    <Box>
      <Flex gap={2} alignItems="center">
        {avatar && <CustomAvatar size="sm" src={avatar} />}
        <Box>
          <Text fontSize="sm" fontWeight="bold">
            {name}
          </Text>
          <Text fontSize="xs" color="GrayText">
            {dayjs(createDate).format('YYYY/MM/DD')}
          </Text>
        </Box>
      </Flex>
      <Box>
        <Text fontSize="sm" whiteSpace="break-spaces">
          {content}
        </Text>
      </Box>
    </Box>
  );
}

export default ReplyText;
