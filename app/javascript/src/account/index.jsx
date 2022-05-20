import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from '../layout/layout';
import Account from './account';
import './account.scss';

const root = ReactDOM.createRoot(document.getElementById("root"));

document.addEventListener('DOMContentLoaded', () => {

  const userId = window.userId;

  root.render(
    <React.StrictMode>
      <Layout>
        <Account userId={userId} />
      </Layout>
    </React.StrictMode>
  );

})