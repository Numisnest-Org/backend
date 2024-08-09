import {
  Box,
  Select,
  Typography,
  MenuItem,
  useMediaQuery,
  SxProps,
} from '@mui/material';

interface Props {
  selectLabel?: string;
  menuItems?: string[];
  handleChange: (value: any) => void;
  value?: string;
  sx?: SxProps;
}
const SelectComp = ({
  selectLabel,
  menuItems,
  handleChange,
  value,
  ...rest
}: Props) => {
  //  const handleChange = (event:{target:{value:string}}) => {

  //  };
  const mobileScreen = useMediaQuery('(max-width:600px)');
  return (
    <Box
      sx={
        {
          // width: '100%',
        }
      }
    >
      <Box>
        <Typography sx={{ fontSize: '0.8rem', fontWeight: '600' }}>
          {selectLabel}
        </Typography>
      </Box>
      <Box>
        <Select
          sx={{
            // minWidth: '4rem',
            width: '100%',
            height: '2.5rem',
            fontSize: '.8rem',
            bgcolor: 'white',
            borderRadius: '0.8rem',
            ...rest.sx,
          }}
          onChange={(event) => handleChange(event.target.value)}
          value={value}
        >
          {menuItems?.map((menuitem: string, index: number) => (
            <MenuItem
              key={index}
              value={
                typeof menuitem === 'string' ? menuitem.toLowerCase() : menuitem
              }
            >
              {menuitem}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

export default SelectComp;
