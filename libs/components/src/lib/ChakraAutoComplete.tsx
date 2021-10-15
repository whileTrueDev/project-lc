import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Box,
  CloseButton,
  FormControl,
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
  theme,
  useColorModeValue,
} from '@chakra-ui/react';
import { liveShoppingRegist } from '@project-lc/stores';
import { useAutocomplete } from '@material-ui/lab';
import { useFormContext } from 'react-hook-form';

export interface ChakraAutoCompleteProps<T> {
  label?: string;
  options?: T[];
  value: T | string;
  isLoading?: boolean;
  isDisabled?: boolean;
  getOptionLabel: (opt: T) => string;
  onChange: (newValue: T) => void;
}
export function ChakraAutoComplete<T = any>({
  label,
  options,
  value: valueProp,
  isLoading,
  isDisabled,
  getOptionLabel,
  onChange,
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
    value: valueProp,
    onChange: (_, newValue) => {
      if (newValue) onChange(newValue);
    },
    clearOnEscape: true,
  });

  const { setValue } = useFormContext();
  const { handleGoodsSelect } = liveShoppingRegist();

  const backgroundColor = useColorModeValue('white', 'gray.700');
  const hoverListItemColor = useColorModeValue('gray.100', 'gray.600');
  return (
    <FormControl width="300px">
      <Box {...getRootProps()}>
        {label ? (
          <FormLabel {...getInputLabelProps()}>
            <Heading as="h6" size="xs">
              {label}
            </Heading>
          </FormLabel>
        ) : null}

        <InputGroup>
          <InputLeftElement>{isLoading && <Spinner />}</InputLeftElement>
          <Input
            {...getInputProps()}
            value={inputValue || (valueProp as string)}
            isDisabled={isDisabled || isLoading}
          />
          <InputRightElement mr={2}>
            {value && (
              <CloseButton
                {...getClearProps()}
                isDisabled={isDisabled || isLoading}
                onClick={() => {
                  setValue('goods_id', '');
                  handleGoodsSelect('');
                }}
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
          w="inherit"
          inset="0px auto auto 0px"
          position="absolute"
          boxShadow="lg"
          borderWidth={popupOpen ? '0.025rem' : undefined}
          borderRadius="lg"
          backgroundColor={backgroundColor}
          zIndex={theme.zIndices.dropdown}
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
