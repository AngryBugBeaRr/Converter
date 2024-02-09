import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import Exchange from './pages/Exchange/Exchange';
import { CurrencyRate } from './pages/CurrencyRate/CurrencyRate';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Exchange />,
    },
    {
        path: '/currency',
        element: <CurrencyRate />
    }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);
