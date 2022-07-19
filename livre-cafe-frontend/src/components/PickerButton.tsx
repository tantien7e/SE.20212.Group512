import { Button, ButtonProps } from '@mui/material';
import React from 'react';

interface PickerButtonProps extends ButtonProps {
  children: string;
  fontColor: string;
}
function PickerButton(props: PickerButtonProps) {
  const { children, fontColor, ...restProps } = props;
  return (
    <Button
      variant="outlined"
      sx={{
        textTransform: 'none',
        justifyContent: 'space-between',
        color: fontColor,
        borderColor: 'rgba(0, 40, 100, 0.12)',
        fontWeight: 400
      }}
      {...restProps}
    >
      {children}
    </Button>
  );
}

export default PickerButton;
