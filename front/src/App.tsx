import React from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { presetGpnDark, Theme } from '@consta/uikit/Theme';

import { RouteName } from './constants/route.constant';
import BestPricesComponent from './features/best-prices/best-prices.component';
import HeaderComponent from './features/header/header.component';
import RegistrationComponent from './features/registration/registration.component';
import StatisticComponent from './features/statistic/statistic.component';

import './app.scss';

const router = createBrowserRouter([
  {
    path: RouteName.Home,
    element: (
      <>
        <header>
          <HeaderComponent />
        </header>

        <main className="container">
          <div className={`h-100 ${cnMixSpace({ mT: 's' })}`}>
            <Outlet />
          </div>
        </main>

        {/* <footer>
          <FooterComponent />
        </footer> */}
      </>
    ),
    children: [
      {
        path: RouteName.Home,
        element: <div>home</div>,
      },
      {
        path: RouteName.BestPrices,
        element: <BestPricesComponent />,
      },
      {
        path: RouteName.DetailObject,
        element: <div>bestPrices 222</div>,
      },
      {
        path: RouteName.Registration,
        element: <RegistrationComponent />,
      },
      {
        path: RouteName.Statistic,
        element: <StatisticComponent />,
      },
    ],
  },
]);

const App = () => {
  return (
    <Theme preset={presetGpnDark} className="content">
      <RouterProvider router={router} />
    </Theme>
  );
};

export default App;
