import {
  useDisclosure,
  Popover,
  PopoverTrigger,
  IconButton,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Text,
  Theme,
} from '@chakra-ui/react';

export default function TextWithPopperButton({
  title,
  children,
  icon,
  iconAriaLabel,
  iconColor,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactElement;
  iconAriaLabel: string;
  iconColor?: keyof Theme['colors'];
}) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  return (
    <>
      <Text>{title}</Text>
      <Popover isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <PopoverTrigger>
          <IconButton
            variant="ghost"
            aria-label={iconAriaLabel}
            size="xs"
            icon={icon}
            color={iconColor}
          />
        </PopoverTrigger>

        <Portal>
          <PopoverContent p={5} minWidth="400px">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>{children}</PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </>
  );
}
