import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from '../layout/layout';
import { transitions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import Business from './business';
import './business.scss';

const root = ReactDOM.createRoot(document.getElementById("root"));

const alertOptions = {
  position: 'top center',
  timeout: 3000,
  offset: '30px',
  transition: transitions.FADE
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('params');
  const data = JSON.parse(node.getAttribute('data-params'));

  root.render(
    <React.StrictMode>
      <Layout>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Business id={data.business_id} />
        </AlertProvider>
      </Layout>
    </React.StrictMode>
  );
})