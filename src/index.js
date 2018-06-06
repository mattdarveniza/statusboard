import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const rootEl = document.getElementById('root');

ReactDOM.render(
  <App />,
  rootEl,
);

if (module.hot) {
  module.hot.accept('./App', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./App').default;
    ReactDOM.render(
      <NextApp />,
      rootEl,
    );
  });
}
