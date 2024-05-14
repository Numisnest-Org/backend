import { createTheme, ThemeOptions } from "@mui/material";
import { grey } from "@mui/material/colors";
import { PRIMARY_COLOR, SECOUNDARY_COLOR } from "../constants";
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    body3: true;
  }
}
const customTypographyOptions = {
  h1:{
    fontSize:"3rem"
  },
  h2:{
    fontSize:"2rem"
  },
  h3:{
    fontSize:"1.4rem"
  },
  body3: {
    fontSize: "12px",
    
  },
};

const theme = (): ThemeOptions =>
  createTheme({
    palette: {
      primary: {
        main: PRIMARY_COLOR,
        dark: "#141110",
        contrastText: "#CCD6DC",
      },
      secondary: {
        main: SECOUNDARY_COLOR,
        dark: "",
      },
      text: {
        primary: grey[900],
        secondary: SECOUNDARY_COLOR,
      },
      background: {
        paper: grey[50],
        default: grey[50],
      },
    },
    typography: {
      ...customTypographyOptions,
      fontFamily: ["Poppins", "sans-seri"].join(","),
      body1: {
        fontSize: "15px",
      },
      body2: {
        fontSize: "12px",
      },

      button: {
        textTransform: "initial",
        fontSize: "15px",
        fontFamily: "'Poppins', sans-seri",
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    spacing: [0, 4, 8, 16, 32, 64, 80],
  }) as any;

export default theme;
