import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from '../layout/layout';
import Search from './search';
import './search.scss'

const root = ReactDOM.createRoot(document.getElementById("root"));

document.addEventListener('DOMContentLoaded', () => {
  root.render(
    <React.StrictMode>
      <Layout>
        <Search />
      </Layout>
    </React.StrictMode>
  );
})