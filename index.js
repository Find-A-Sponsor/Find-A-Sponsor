import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './frontend/src/App';
import { Provider } from 'react-redux';
import { store } from './frontend/src/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
