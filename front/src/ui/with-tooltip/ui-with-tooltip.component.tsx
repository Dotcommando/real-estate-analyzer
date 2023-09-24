import React, { PropsWithChildren, useRef, useState } from 'react';
import { Tooltip } from '@consta/uikit/Tooltip';

type Props = {
  tooltipText: string;
  className?: string;
};

const UiWithTooltipComponent = ({
  tooltipText,
  className,
  children,
}: PropsWithChildren<Props>) => {
  const ref = useRef(null);

  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={`p-relative ${className || ''}`}
      >
        {children}
      </span>
      {isVisible && (
        <Tooltip size="s" anchorRef={ref}>
          {tooltipText}
        </Tooltip>
      )}
    </>
  );
};

export default UiWithTooltipComponent;
