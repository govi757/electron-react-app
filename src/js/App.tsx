import React, { useState } from "react";
import IPreLoad, { IOpenFolderResponse } from "./interfaces/IPreLoad";
// import { electron } from "webpack"
// var electron: any;
const electron: IPreLoad = ((window as any).electron as IPreLoad) || {};
import { HashRouter, Routes, Route } from "react-router-dom";
import OpeningPage from "./container/OpeningPage";
import WorkspaceArea from "./container/WorkspaceArea";
import {Provider} from 'react-redux';
import store from "./redux/store";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './index.scss';


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
    MuiAccordion: {
      styleOverrides: {
        root: {
          minHeight: '10px', // Adjust the height value as needed
        },
      },
    },
    MuiAccordionSummary:{
      styleOverrides: {
        content: {
          minHeight: '10px', // Adjust the height value as needed
          margin:"0px"
        },
      },
    },
  }
  
  
});

export default function App() {
  return (
    <>
        <ThemeProvider theme={theme}>
      {/* <Provider store={store}> */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<OpeningPage />}></Route>
          <Route path="/workspace" element={<WorkspaceArea />}></Route>
        </Routes>
      </HashRouter>
      {/* </Provider> */}
      </ThemeProvider>
    </>
  );
}
