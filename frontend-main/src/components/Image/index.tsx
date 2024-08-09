import { BoxProps, Box } from '@mui/material';
interface Props extends BoxProps {
  src: any;
  alt: string;
}

const Image = ({ src, alt, ...rest }: Props) => {
  return (
    <Box
      {...rest}
      sx={{
        img: {
          width: '100%',
        },

        ...rest.sx,
      }}
    >
      <img src={src} alt={alt} />
    </Box>
  );
};

export default Image;
