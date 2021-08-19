import NextLink from 'next/link';
import {
  Box,
  Flex,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { mypageNavLinks } from '../constants/navigation';

export function MypageNavbar(): JSX.Element {
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const subNavHoverColor = useColorModeValue('pink.50', 'gray.900');

  return (
    <Flex
      bg={useColorModeValue('white', 'gray.800')}
      color={useColorModeValue('gray.600', 'white')}
      minH="60px"
      py={{ base: 2 }}
      px={{ base: 2, sm: 4 }}
      borderBottom={1}
      borderStyle="solid"
      borderColor={useColorModeValue('gray.200', 'gray.900')}
      align="center"
      as="header"
    >
      <Stack direction="row" spacing={{ base: 2, sm: 4 }} as="nav">
        {mypageNavLinks.map((link) => (
          <Box key={link.name} align="center">
            <Popover trigger="hover" placement="bottom-start">
              <PopoverTrigger>
                <Box>
                  <NextLink href={link.href ?? '#'} passHref>
                    <Link
                      py={2}
                      mx={{ base: 1, sm: 3 }}
                      fontSize={{ base: 'xs', sm: 'sm' }}
                      fontWeight={500}
                      _hover={{
                        textDecoration: 'none',
                        color: linkHoverColor,
                      }}
                    >
                      {link.name}
                    </Link>
                  </NextLink>
                </Box>
              </PopoverTrigger>
              {link.children && (
                <PopoverContent
                  border={0}
                  boxShadow="xl"
                  p={2}
                  rounded={{ base: 'base', sm: 'xl' }}
                  w={{ base: '100vw', sm: 'xs' }}
                >
                  {link.children.map((child) => (
                    <NextLink key={child.name} href={child.href ?? '#'} passHref>
                      <Link
                        role="group"
                        display="block"
                        p={2}
                        rounded="md"
                        _hover={{ bg: subNavHoverColor }}
                      >
                        <Stack direction="row" align="center">
                          <Box>
                            <Text
                              fontSize={{ base: 'xs', sm: 'sm' }}
                              fontWeight={500}
                              transition="all .3s ease"
                              _groupHover={{ color: 'pink.400' }}
                            >
                              {child.name}
                            </Text>
                          </Box>
                        </Stack>
                      </Link>
                    </NextLink>
                  ))}
                </PopoverContent>
              )}
            </Popover>
          </Box>
        ))}
      </Stack>
    </Flex>
  );
}

export default MypageNavbar;
