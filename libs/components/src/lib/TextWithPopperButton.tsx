import { QuestionIcon } from '@chakra-ui/icons';
import {
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverProps,
  PopoverTrigger,
  Portal,
  Text,
  Theme,
  useDisclosure,
} from '@chakra-ui/react';

interface TextWithPopperButtonProps extends Partial<PopoverProps> {
  title: string | React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactElement;
  iconAriaLabel: string;
  iconColor?: keyof Theme['colors'];
  portalBody?: boolean; // datagrid내에서 사용시 overflow: hidden 때문에 portal 안에 표시하기 위한 속성
}

export default function TextWithPopperButton({
  title,
  children,
  icon = <QuestionIcon />,
  iconAriaLabel,
  iconColor,
  portalBody = false,
  placement = 'bottom',
}: TextWithPopperButtonProps): JSX.Element {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const titleComponent = typeof title === 'string' ? <Text>{title}</Text> : title;

  return (
    <HStack spacing={0}>
      {titleComponent}
      <Popover
        isLazy
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        placement={placement}
      >
        <PopoverTrigger>
          <IconButton
            variant="ghost"
            aria-label={iconAriaLabel}
            size="xs"
            icon={icon}
            color={iconColor}
          />
        </PopoverTrigger>

        {isOpen && portalBody ? (
          <Portal>
            <PopoverContent p={5}>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>{children}</PopoverBody>
            </PopoverContent>
          </Portal>
        ) : (
          <PopoverContent p={5}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>{children}</PopoverBody>
          </PopoverContent>
        )}
      </Popover>
    </HStack>
  );
}
