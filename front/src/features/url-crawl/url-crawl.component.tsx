import React from 'react';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { block } from 'bem-cn';

import './url-crawl.scss';

const cn = block('url-crawl');

const UrlCrawlerComponent = () => {
  return (
    <div className={`${cn()} ${cnMixSpace({ mT: 'm' })}`}>WIP URL CRAWL</div>
  );
};

export default UrlCrawlerComponent;
