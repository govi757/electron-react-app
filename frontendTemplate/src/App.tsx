import React from 'react';

import './App.css';
import { Home } from './container/home';
import { Provider } from 'react-redux';
import { store } from './redux/store/store';

function App() {

  return (

    <Provider store={store}>
      <Home />
    </Provider>
  );
}

export default App;
