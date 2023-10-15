import React from 'react';

import './App.css';
import { Provider } from 'react-redux';
import { store } from './redux/store/store';
import {
  RouterProvider,
} from "react-router-dom";
import router from './router/genRouter';
function App() {

  return (

    <Provider store={store}>
      <RouterProvider router={router}/>
  </Provider>
  );
}

export default App;
