import { Box, Button, Center, Container, Spinner, Stack, Text } from '@chakra-ui/react';
import { Manual, UserType } from '@prisma/client';
import SettingSectionLayout from '@project-lc/components-layout/SettingSectionLayout';
import { useManualList } from '@project-lc/hooks';
import React, { useEffect, useState } from 'react';
import 'suneditor/dist/css/suneditor.min.css';

export interface UserManualProps {
  userType: UserType;
}
export function UserManual({ userType }: UserManualProps): JSX.Element {
  const { data, isLoading, isError } = useManualList(userType);
  const [selectedManual, setSelectedManual] = useState<Manual | null>(null);

  useEffect(() => {
    if (!data || !!selectedManual) return;
    setSelectedManual(data[0]);
  }, [data, selectedManual]);

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
  return (
    <Container maxW="container.xl">
      <SettingSectionLayout title="이용안내">
        <Text>항목을 눌러 내용을 확인해보세요!</Text>
        <UserManualHeader
          data={data}
          selectedManual={selectedManual}
          onClick={(manual: Manual) => setSelectedManual(manual)}
        />
        {selectedManual && <UserManualDisplay data={selectedManual} />}
      </SettingSectionLayout>
    </Container>
  );
}

export default UserManual;

function UserManualHeader({
  data,
  onClick,
  selectedManual,
}: {
  data: Manual[];
  onClick: (manual: Manual) => void;
  selectedManual: Manual | null;
}): JSX.Element {
  return (
    <Stack
      width="100%"
      direction="row"
      spacing={2}
      boxShadow="base"
      p={4}
      rounded="md"
      flexWrap="wrap"
    >
      {data.map((item) => {
        const selected = selectedManual && selectedManual.id === item.id;
        return (
          <Box key={item.id}>
            <Button
              my={1}
              rounded="3xl"
              onClick={() => onClick(item)}
              colorScheme={selected ? 'blue' : undefined}
            >
              {item.title}
            </Button>
          </Box>
        );
      })}
    </Stack>
  );
}

function UserManualDisplay({ data }: { data: Manual }): JSX.Element {
  return (
    <Box
      width="100%"
      rounded="md"
      className="sun-editor-editable"
      minH="100px"
      overflowY="auto"
      dangerouslySetInnerHTML={{ __html: data.contents }}
    />
  );
}
