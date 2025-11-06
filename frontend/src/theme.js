// theme.js
import { yellow, indigo } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: indigo[700],
    },
    secondary: {
      main: yellow[700],
    },
  },
});

export default theme;
