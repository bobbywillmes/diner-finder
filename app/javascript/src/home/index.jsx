import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from '../layout/layout';
import Home from './home';
import './home.scss';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Layout>
      <Home />
    </Layout>
  </React.StrictMode>
);