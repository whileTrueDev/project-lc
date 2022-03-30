import {
  Box,
  Center,
  Container,
  Divider,
  Grid,
  GridItem,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Manual, UserType } from '@prisma/client';
import SettingSectionLayout from '@project-lc/components-layout/SettingSectionLayout';
import { useManualList, useManualMainCategories } from '@project-lc/hooks';
import { ManualWithoutContents } from '@project-lc/shared-types';
import NextLink from 'next/link';
import React from 'react';
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
      <Container maxW="container.xl">
        <Text>데이터가 없습니다</Text>
      </Container>
    );
  }

  const categoryList: ManualCategoryBoxProps[] = mainCategories
    .map((cat) => {
      return {
        mainCategoryName: cat.name,
        id: cat.href,
        list: data.filter((d) => d.mainCategory === cat.href),
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
      <Stack height={{ base: 150, sm: 200 }} pl={2} overflowY="auto">
        {list.map((item) => (
          <NextLink key={item.id} href={`/mypage/manual/${item.id}`} passHref>
            <Link color="blue.500">{item.title}</Link>
          </NextLink>
        ))}
      </Stack>
    </Stack>
  );
}

function UserManualDisplay({ data }: { data: Manual }): JSX.Element {
  return (
    <Stack>
      <Stack px={4}>
        <Heading size="sm">{data.title}</Heading>
        <Text>{data.description}</Text>
      </Stack>

      <Box
        width="100%"
        rounded="md"
        className="sun-editor-editable"
        minH="100px"
        overflowY="auto"
        dangerouslySetInnerHTML={{ __html: data.contents }}
      />
    </Stack>
  );
}
