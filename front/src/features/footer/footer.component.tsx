import React from 'react';
import { block } from 'bem-cn';

import './footer.scss';

const cn = block('footer');

const FooterComponent = () => {
  return <div className={cn()}>footer</div>;
};

export default FooterComponent;
