import { Box, TextField, TextFieldProps } from '@mui/material';

type Props = {
  limit: number;
  label?: string;
  val?: string;
  textA?:boolean
  rows?:number
};

const TextFieldInputLimit = ({
  limit,
  label,
  val,
  textA,
  rows,
  ...rest
}: Props & TextFieldProps) => {
  return (
    <Box display="flex" flexDirection="column" sx={{ mt: "0rem" }}>
      <Box
        component={"label"}
        sx={{ fontSize: "1.2rem", fontWeight: 600, mb: "0.5rem" }}
      >
        {label}
      </Box>
      {textA ? (
        <TextField
          inputProps={{ maxLength: limit }}
          multiline
          variant="outlined"
          {...rest}
          rows={rows}
          sx={{ ...rest.sx}}
          value={val}
          
        />
      ) : (
        <TextField
          inputProps={{ maxLength: limit }}
          variant="standard"
          {...rest}
          sx={{ ...rest.sx }}
          value={val}
        />
      )}
      <Box mt={1} alignSelf="flex-end">
        {`${val?.length}/${limit}`}
      </Box>
    </Box>
  );
};

export default TextFieldInputLimit;
