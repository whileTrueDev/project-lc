import {
  Text,
  Grid,
  GridItem,
  Button,
  HStack,
  useDisclosure,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { PasswordChangeDialog } from '@project-lc/components-shared/PasswordChangeDialog';
import { useCustomerInfo } from '@project-lc/hooks';
import { CustomerNicknameChangeDialog } from './CustomerNicknameChangeDialog';
import { CustomerPhoneNumberChage } from './CustomerPhoneNumberChange';
import { GenderSelection } from './GenderSelection';
import { CustomerBirthday } from './CustomerBirthday';
import { CustomerDelete } from './CustomerDelete';
import { AgreementDialog } from '../../AgreementDialog';

export function UserInfo({ userId }: { userId: number }): JSX.Element {
  const { data, isError, isLoading } = useCustomerInfo(userId);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: nicknameIsOpen,
    onClose: nicknameOnClose,
    onOpen: nicknameOnOpen,
  } = useDisclosure();

  const {
    isOpen: agreementIsOpen,
    onOpen: agreementOnOpen,
    onClose: agreementOnClose,
  } = useDisclosure();

  if (isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  if (isError)
    return (
      <Text>내 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</Text>
    );

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={4}>
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
              {data.nickname && <Text>{data.nickname}</Text>}
              <Button size="xs" onClick={() => nicknameOnOpen()}>
                {data.nickname ? '닉네임 변경' : '닉네임 설정'}
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
            <Text fontWeight="bold">이용약관동의</Text>
          </GridItem>
          <GridItem colSpan={3}>
            <HStack>
              <Text>{data.agreementFlag ? '동의' : '미동의'}</Text>
              {!data.agreementFlag && (
                <Button size="xs" onClick={agreementOnOpen}>
                  약관보기
                </Button>
              )}
            </HStack>
          </GridItem>
          <GridItem colSpan={4} />
          <GridItem colSpan={1}>
            <CustomerDelete userId={userId} />
          </GridItem>
          <GridItem colSpan={3} />
          <PasswordChangeDialog
            headerText="새 비밀번호"
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onClose}
          />
          <CustomerNicknameChangeDialog
            isOpen={nicknameIsOpen}
            onClose={nicknameOnClose}
            onConfirm={nicknameOnClose}
            userId={userId}
          />
          <AgreementDialog isOpen={agreementIsOpen} onClose={agreementOnClose} />
        </>
      )}
    </Grid>
  );
}

export default UserInfo;
