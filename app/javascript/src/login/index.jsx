import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from '../layout/layout';
import { transitions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic';
import Login from './login';
import './login.scss';

const root = ReactDOM.createRoot(document.getElementById("root"));

const options = {
  position: 'top center',
  timeout: 3000,
  offset: '30px',
  transition: transitions.FADE
};

root.render(
  <React.StrictMode>
    <AlertProvider template={AlertTemplate} {...options}>
      <Layout>
        <Login />
      </Layout>
    </AlertProvider>
  </React.StrictMode>
);