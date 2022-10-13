import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from '../layout/layout';
import Business from './business';

const root = ReactDOM.createRoot(document.getElementById("root"));

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('params');
  const data = JSON.parse(node.getAttribute('data-params'));

  root.render(
    <React.StrictMode>
      <Layout>
        <Business id={data.business_id} />
      </Layout>
    </React.StrictMode>
  );
})