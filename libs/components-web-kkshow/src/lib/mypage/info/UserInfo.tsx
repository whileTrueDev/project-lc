import { Text, Grid, GridItem, Button, HStack, useDisclosure } from '@chakra-ui/react';
import { PasswordChangeDialog } from '@project-lc/components-shared/PasswordChangeDialog';
import { useCustomerInfo } from '@project-lc/hooks';
import { CustomerNicknameChangeDialog } from './CustomerNicknameChangeDialog';
import { CustomerPhoneNumberChage } from './CustomerPhoneNumberChange';
import { GenderSelection } from './GenderSelection';
import { CustomerBirthday } from './CustomerBirthday';
import { CustomerDelete } from './CustomerDelete';

export function UserInfo({ userId }: { userId: number }): JSX.Element {
  const { data } = useCustomerInfo(userId);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: nicknameIsOpen,
    onClose: nicknameOnClose,
    onOpen: nicknameOnOpen,
  } = useDisclosure();

  return (
    <Grid p={3} templateColumns="repeat(4, 11fr)" gap={6}>
      {data && (
        <>
          <GridItem colSpan={1}>
            <Text fontWeight="bold">이름</Text>
          </GridItem>
          <GridItem colSpan={3}>
            <Text>{data.name}</Text>
          </GridItem>
          <GridItem colSpan={1}>
            <Text fontWeight="bold">생년월일</Text>
          </GridItem>
          <GridItem colSpan={3}>
            <CustomerBirthday birthDate={data.birthDate} userId={userId} />
          </GridItem>
          <GridItem colSpan={1}>
            <Text fontWeight="bold">성별</Text>
          </GridItem>
          <GridItem colSpan={3}>
            <GenderSelection gender={data.gender || ''} userId={userId} />
          </GridItem>
          <GridItem colSpan={1}>
            <Text fontWeight="bold">메일</Text>
          </GridItem>
          <GridItem colSpan={3}>
            <Text>{data.email}</Text>
          </GridItem>
          <GridItem colSpan={1}>
            <Text fontWeight="bold">비밀번호</Text>
          </GridItem>
          <GridItem colSpan={3}>
            <Button size="xs" onClick={() => onOpen()}>
              비밀번호 변경
            </Button>
          </GridItem>
          <GridItem colSpan={1}>
            <Text fontWeight="bold">닉네임</Text>
          </GridItem>
          <GridItem colSpan={3}>
            <HStack>
              <Text>{data.nickname}</Text>
              <Button size="xs" onClick={() => nicknameOnOpen()}>
                변경
              </Button>
            </HStack>
          </GridItem>
          <GridItem colSpan={1}>
            <Text fontWeight="bold">휴대전화번호</Text>
          </GridItem>
          <GridItem colSpan={3}>
            <HStack>
              <CustomerPhoneNumberChage data={data.phone || ''} userId={userId} />
            </HStack>
          </GridItem>
          <GridItem colSpan={1}>
            <Text fontWeight="bold">개인정보이용동의</Text>
          </GridItem>
          <GridItem colSpan={3}>
            <Text>{data.agreementFlag ? '동의' : '미동의'}</Text>
          </GridItem>
          <GridItem colSpan={4} />
          <GridItem colSpan={1}>
            <CustomerDelete userId={userId} />
          </GridItem>
          <GridItem colSpan={3} />
          <PasswordChangeDialog isOpen={isOpen} onClose={onClose} onConfirm={onClose} />
          <CustomerNicknameChangeDialog
            isOpen={nicknameIsOpen}
            onClose={nicknameOnClose}
            onConfirm={nicknameOnClose}
            userId={userId}
          />
        </>
      )}
    </Grid>
  );
}

export default UserInfo;
