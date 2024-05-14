import React, { ReactNode } from 'react';
import { Button, Box } from '@mui/material';
interface Props {
  children: ReactNode;
  active: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}
const TabButton = ({ children, active, onClick }: Props) => {
  return (
    <Button
      sx={{
        borderRadius: '0', // Remove border-radius to make it rectangular
        backgroundColor: active ? '#0047AB' : '#1166dc',
        color: active ? 'white' : '#0047AB',
        border: active ? 'none' : '1px solid #0047AB',
        marginRight: '10px', // Adjust the spacing between buttons
        '&:hover': {
          backgroundColor: active ? '#0047AB' : '#1166dc ', // Change hover background color
        },
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default TabButton;
