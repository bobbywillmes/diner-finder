import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from '../layout/layout';
import Signup from './signup';
import './signup.scss';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Layout>
      <Signup />
    </Layout>
  </React.StrictMode>
);