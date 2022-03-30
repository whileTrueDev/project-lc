import { Button, ButtonGroup } from '@chakra-ui/react';

export interface PageManagerButtonGroupProps {
  buttons: { icon?: JSX.Element; onClick: () => void; label: string }[];
}
export function PageManagerButtonGroup({
  buttons,
}: PageManagerButtonGroupProps): JSX.Element {
  return (
    <ButtonGroup>
      {buttons.map((btn) => (
        <Button key={btn.label} leftIcon={btn.icon} onClick={btn.onClick}>
          {btn.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}

export default PageManagerButtonGroup;
