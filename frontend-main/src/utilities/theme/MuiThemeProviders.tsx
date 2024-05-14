import  { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./index";

type Props = {
  children: ReactNode;
};

const MuiThemeProvider = ({ children }: Props) => {
  

  return (
    <ThemeProvider theme={theme()}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MuiThemeProvider;
