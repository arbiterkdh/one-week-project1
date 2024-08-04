import { Button, Tooltip } from "@chakra-ui/react";

export function TooltipButton({ placement, label, openDelay, ...props }) {
  return (
    <Tooltip placement={placement} label={label} openDelay={openDelay}>
      <Button {...props} />
    </Tooltip>
  );
}
