import { IconButton ,IconButtonProps } from "@mui/material";
import { MouseEvent } from "react";

interface Props extends Omit<IconButtonProps, "color"> {
  width: number;
  height: number;
  color?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const AddIcon = ({ width = 60, height = 60,color ="black" ,onClick,...rest }:Props) => {
  return (
    <IconButton onClick={onClick} >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 79 79"
        fill="none"
      >
        <path
          d="M70.75 2H8.25C4.79822 2 2 4.79822 2 8.25V70.75C2 74.2018 4.79822 77 8.25 77H70.75C74.2018 77 77 74.2018 77 70.75V8.25C77 4.79822 74.2018 2 70.75 2Z"
          stroke={color}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M39.5 22.834V56.1673M22.8334 39.5007H56.1667"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconButton>
  );
};


