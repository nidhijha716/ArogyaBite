// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#81c784', // light green
    },
    secondary: {
      main: '#ffb74d', // orange
    },
    background: {
      default: '#121212', // dark background
      paper: '#1e1e1e',    // card background
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

export default theme;
