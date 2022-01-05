import { List, ListIcon, ListItem, Theme, IconProps } from '@chakra-ui/react';
import { IconType } from 'react-icons/lib';

export interface SummaryListProps {
  spacing?: keyof Theme['space'];
  listItems: {
    id: string;
    icon: IconType;
    value: string | React.ReactElement | React.ReactNode;
    iconColor?: IconProps['color'];
    disabled?: boolean;
  }[];
}
export function SummaryList({ spacing = 2, listItems }: SummaryListProps): JSX.Element {
  return (
    <List spacing={spacing}>
      {listItems.map((i) => {
        if (i.disabled) return null;
        return (
          <ListItem isTruncated key={i.id} display="flex">
            <ListIcon boxSize="1.5rem" as={i.icon} color={i.iconColor || 'green.500'} />
            {i.value}
          </ListItem>
        );
      })}
    </List>
  );
}
