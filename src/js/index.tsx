import React  from "react";
// import { ReactDOM } from "react";
import ReactDOM from 'react-dom';
import App from "./App";

import { createRoot } from 'react-dom/client';
const container: any = document.getElementById('root');
const root = createRoot(container); 
// console.log(ReactDom)
root.render(<App/>);