import React from 'react';
import ReactDOM from 'react-dom/client'; // Lưu ý sử dụng react-dom/client từ React 18
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './features/store';

const root = ReactDOM.createRoot(document.getElementById('root')); // Tạo root mới
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
