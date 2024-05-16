import {  ReactNode } from 'react'
import { Button, ButtonProps, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'
interface  Props extends ButtonProps{
  LinkTo :string
  children:ReactNode
}

const LinkButton = ({ LinkTo ,children,...rest}:Props) => {
  const theme  = useTheme()
  return (
    <Link to={LinkTo}>
      <Button {...rest} sx={{ backgroundColor: theme.palette.primary.light,color:"black",px:"1.5rem" ,py:"0.5rem",minWidth:"8rem",...rest.sx}}>
        {children}
      </Button>
    </Link>
  );
}

export default LinkButton