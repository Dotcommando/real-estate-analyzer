import React, { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconHome } from '@consta/icons/IconHome';
import { Layout } from '@consta/uikit/Layout';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Tabs } from '@consta/uikit/Tabs';

import { RouteName } from '../../constants/route.constant';
import i18n from '../../i18n';

import './header.scss';

type Tab = {
  label: string;
  route: RouteName;
};

const TAB_ITEMS: Tab[] = [
  {
    label: i18n.t('menu.home'),
    route: RouteName.Home,
  },
  // {
  //   label: i18n.t('menu.bestPrices'),
  //   route: RouteName.BestPrices,
  // },
  {
    label: i18n.t('menu.statistic'),
    route: RouteName.Statistic,
  },
];

const HeaderComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleChangeRoute = useCallback(
    (route: RouteName) => {
      navigate(route);
    },
    [navigate],
  );

  const locationValue: Tab = useMemo(() => {
    const foundTab = TAB_ITEMS.find((tab) => {
      const tabRoute = tab.route === '/' ? tab.route : `/${tab.route}`;

      return tabRoute === location.pathname;
    });

    return foundTab!;
  }, [location]);

  return (
    <Layout className="container header">
      <IconHome view="primary" size="s" className={cnMixSpace({ mR: 'm' })} />
      <Tabs
        value={locationValue}
        onChange={({ value }) => handleChangeRoute(value.route)}
        items={TAB_ITEMS}
        size="m"
        getItemLabel={({ label }: Tab) => label}
        className="header__tabs"
      />
    </Layout>
  );
};

export default HeaderComponent;
