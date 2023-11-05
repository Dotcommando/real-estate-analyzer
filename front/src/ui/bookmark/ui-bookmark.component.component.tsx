import React from 'react';
import { useTranslation } from 'react-i18next';
import block from 'bem-cn';

import './ui-bookmark.component.scss';

const cn = block('ui-bookmark');

type Props = {
  type: 'avg' | 'median';
  value?: number;
  color?: string;
};

const UiBookmark = ({ value, type, color }: Props) => {
  const { t } = useTranslation();

  return (
    <div className={cn({ [color || 'white']: true, [type]: true })}>
      <span className={cn('title')}>
        {t(type === 'avg' ? 'bookmark.avg' : 'bookmark.median')}
      </span>
      {value ? (
        <>
          <span className={cn('value')}>{value}</span>
          <span className={cn('delimiter')} />
          <span className={cn('unit')}>%</span>
        </>
      ) : (
        <span className={cn('value')}>N/A</span>
      )}
    </div>
  );
};

export default UiBookmark;
