import React from 'react';

import './App.css';
import { Provider } from 'react-redux';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { store } from './redux/store/store';
import {
  RouterProvider,
} from "react-router-dom";
import router from './router/genRouter';
import { ThemeProvider, createTheme } from '@mui/material';
import GSnackBar from 'src/component/snackbar/GSnackbar';

const theme = createTheme({
  palette: {
    secondary: {
      main: '#9fafca'
    },
    primary: {
      main: '#0e387a'
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        style: {
          margin: "5px 0px"
        },
        size: "small"
      }
    }
  },
  
  
});

function App() {
  return (
<ThemeProvider theme={theme}>
    <Provider store={store}>
      <RouterProvider router={router}/>
      <GSnackBar />
  </Provider>
  </ThemeProvider>
  );
}

export default App;
