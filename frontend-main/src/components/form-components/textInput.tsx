import { TextField, TextFieldProps } from '@mui/material';
import { grey } from '@mui/material/colors';

type Props = {
  isLoading?: boolean;
  // disabled?:
};

const TextInput = (props: TextFieldProps & Props) => {
  return (
    <TextField
      {...props}
      sx={{
        ...props.sx,
        pt: '.5rem',

        bgcolor: props.disabled ? '#E5EAEE' : 'transparent',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: grey[500],
        },
      }}
      disabled={props.disabled || props.isLoading}
    />
  );
};

export default TextInput;
