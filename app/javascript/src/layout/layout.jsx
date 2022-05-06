import React from 'react';
import './layout.scss';

const Layout = (props) => {
  return (
    <React.Fragment>
      <nav className="navbar navbar-expand navbar-light bg-light">
        <a href="/"><span className="navbar-brand mb-0 h1 text-danger">Diner Finder</span></a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="contentWrap">
        {props.children}
      </div>
      <footer className="p-3 bg-light">
        <div>
          <p className="mr-3 mb-0 text-secondary">Diner Finder</p>
        </div>
      </footer>
    </React.Fragment>
  )
}

export default Layout