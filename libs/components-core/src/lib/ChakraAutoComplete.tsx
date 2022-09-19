import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Box,
  CloseButton,
  FormControl,
  FormControlProps,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  List,
  ListItem,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAutocomplete } from '@material-ui/lab';

export interface ChakraAutoCompleteProps<T> {
  label?: string;
  options: T[];
  value?: T | null;
  isLoading?: boolean;
  isDisabled?: boolean;
  getOptionLabel: (opt: T | null) => string;
  onChange: (newValue: T | null) => void;
  width?: FormControlProps['width'];
}
export function ChakraAutoComplete<T = any>({
  label,
  options,
  value: valueProp,
  isLoading,
  isDisabled,
  getOptionLabel,
  onChange,
  width = '300px',
}: ChakraAutoCompleteProps<T>): JSX.Element {
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    popupOpen,
    value,
    inputValue,
    getClearProps,
    getPopupIndicatorProps,
  } = useAutocomplete({
    id: 'use-autocomplete-demo',
    options,
    getOptionLabel,
    value: valueProp as any,
    onChange: (_, newValue) => {
      onChange(newValue);
    },
    clearOnEscape: true,
  });

  const backgroundColor = useColorModeValue('white', 'gray.700');
  const hoverListItemColor = useColorModeValue('gray.100', 'gray.600');
  return (
    <FormControl width={width}>
      <Box {...getRootProps()}>
        {label ? (
          <FormLabel {...getInputLabelProps()}>
            <Text as="h6" size="sm" fontWeight="bold">
              {label}
            </Text>
          </FormLabel>
        ) : null}

        <InputGroup>
          {isLoading && (
            <InputLeftElement>
              <Spinner />
            </InputLeftElement>
          )}
          <Input
            {...getInputProps()}
            value={inputValue}
            isDisabled={isDisabled || isLoading}
          />
          <InputRightElement mr={2}>
            {value && (
              <CloseButton
                {...getClearProps()}
                isDisabled={isDisabled || isLoading}
                size="sm"
              />
            )}
            <IconButton
              {...getPopupIndicatorProps()}
              size="xs"
              variant="ghost"
              aria-label="autocomplete-list-open"
              isDisabled={isDisabled || isLoading}
              icon={popupOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            />
          </InputRightElement>
        </InputGroup>
      </Box>

      <Box position="relative" w="inherit">
        <List
          {...getListboxProps()}
          w="99%"
          maxH={400}
          overflowY="auto"
          inset="0px auto auto 0px"
          position="absolute"
          boxShadow="lg"
          borderWidth={popupOpen ? '0.025rem' : undefined}
          borderRadius="lg"
          backgroundColor={backgroundColor}
          zIndex="dropdown"
        >
          {groupedOptions.length > 0 ? (
            <>
              {groupedOptions.map((option, index) => (
                <ListItem
                  key={getOptionLabel(option)}
                  cursor="pointer"
                  _hover={{
                    backgroundColor: hoverListItemColor,
                  }}
                  py={2}
                  pl={4}
                  w="inherit"
                  {...getOptionProps({ option, index })}
                >
                  {getOptionLabel(option)}
                </ListItem>
              ))}
            </>
          ) : null}
        </List>
      </Box>
    </FormControl>
  );
}
