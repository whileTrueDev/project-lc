import {
  Center,
  Container,
  Divider,
  Grid,
  GridItem,
  Icon,
  Link,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { UserType } from '@prisma/client';
import SettingSectionLayout from '@project-lc/components-layout/SettingSectionLayout';
import { useManualList, useManualMainCategories } from '@project-lc/hooks';
import { ManualWithoutContents } from '@project-lc/shared-types';
import NextLink from 'next/link';
import React from 'react';
import { FaRegGrinBeamSweat } from 'react-icons/fa';
import 'suneditor/dist/css/suneditor.min.css';

export interface UserManualProps {
  userType: UserType;
}
export function UserManualCategoryList({ userType }: UserManualProps): JSX.Element {
  const { data, isLoading, isError } = useManualList(userType);
  const { mainCategories } = useManualMainCategories(userType);
  if (isLoading) {
    return (
      <Container maxW="container.xl">
        <Center>
          <Spinner />
        </Center>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxW="container.xl">
        <Text>오류가 발생하였습니다</Text>
      </Container>
    );
  }

  if (!data || !data.length) {
    return (
      <Container maxW="container.xl" mx="auto" mt={20}>
        <Center>
          <Stack direction="row" alignItems="center">
            <Text>준비중입니다</Text>
            <Icon as={FaRegGrinBeamSweat} fontSize="2xl" />
          </Stack>
        </Center>
        <Center>
          <Text>문의사항이 있으시면 실시간 상담을 이용해주세요!</Text>
        </Center>
      </Container>
    );
  }

  const categoryList: ManualCategoryBoxProps[] = mainCategories
    .map((cat) => {
      return {
        mainCategoryName: cat.label,
        id: cat.key,
        list: data.filter((d) => d.mainCategory === cat.key),
      };
    })
    .filter((item) => item.list.length > 0);

  return (
    <Container maxW="container.xl">
      <SettingSectionLayout title="이용안내">
        <Grid
          width="100%"
          templateColumns={{ base: 'repeat(2,1fr)', sm: 'repeat(4,1fr)' }}
          gap={{ base: 3, sm: 6 }}
        >
          {categoryList.map((item) => (
            <GridItem key={item.id}>
              <ManualCategoryBox {...item} />
            </GridItem>
          ))}
        </Grid>
      </SettingSectionLayout>
    </Container>
  );
}

export default UserManualCategoryList;

type ManualCategoryBoxProps = {
  mainCategoryName: string;
  list: ManualWithoutContents[];
  id: string;
};

function ManualCategoryBox(props: ManualCategoryBoxProps): JSX.Element {
  const { mainCategoryName, list } = props;
  return (
    <Stack border="1px" rounded="md" p={4} borderColor="gray.200">
      <Text fontWeight="bold" fontSize="lg">
        {mainCategoryName}
      </Text>
      <Divider />
      <Stack height={150} pl={2} overflowY="auto">
        {list.map((item) => (
          <NextLink key={item.id} href={`/mypage/manual/${item.id}`} passHref>
            <Link color="blue.500">{item.title}</Link>
          </NextLink>
        ))}
      </Stack>
    </Stack>
  );
}
