import React from 'react';
import { useTranslation } from 'react-i18next';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';

import { RealEstateObject } from '../../../../../../../types/real-estate.type';

type Props = {
  realEstateObject: RealEstateObject;
};

const RealEstateObjectCardFireplaceComponent = ({
  realEstateObject,
}: Props) => {
  const { t } = useTranslation();

  if (!realEstateObject.included?.find((include) => include === 'Fireplace')) {
    return null;
  }

  return (
    <div className="flex-default">
      <img
        alt={t('bestPrices.firePlace')}
        className="icon-m"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAChklEQVR4nO2XzW8NURiHh1tUKVGWakerKQ3/g9JYWIilj6StsGHhY2En8QeIy87GlgjtikUX2ljqAkWspIqgbfQmPkLkkTfeG8f0jDnTmc49OL9kknvnnPfjOe/5migKCgrKLOA+/mosC4jXiv47kCAfhN8L3H3h85cqCiDu+gqcAjbocxr4RgkVGSs4xhlLjLMFxxhdrD0jaFGEXY+BrUAXMJ1S8ndAh8Vvh6NtF9CpMecpC8gIMKdBZe0cB1bGEnqakMgEsFn7tQNtwHpgo2H7LM1WJDGBY5rDtOY0EuURsAQ4BPTo/+WyoBXosyYhu9Qybd8JvDWSfAPs0LYVuosl2fYAByVm3qS362isBrqBk8BDTagGDCQFASrAIPDJMuIfta3yh8Ea1BhozBOag+TSIrllAXHRA6Bfp0qzTqMjSfM6pkfAYbVpVh/ia9wlcNEgDVMUQLJpEqgCe3QLXaWP/O4DLgMv8bgiU8BRoMnB/1LgAPDCN5AhoNU5wK84rcCwLyCXZISzQsSqU200yJALBLALuJAC41yZokGm0qaTnuBXtf/ulL5rgNeNAOl38HNd+353WUP83CxKBZlMumYYPvYZ/WuxtnXARYtNk1a6NJCqg497sc/eipHsqFxlEuyulAnSl2AnB995TfZLzKZb++w3LpAtFh97ywTZYrFp09vqHWBt0je8btd1DVj8dJYJMm/hAre17ZZ8V+gCN/VcK3XNePdKqmg5JMsBsfTvNZpnpGLAe4vpOQX97V3e+EWC3GXhGvcJpJYDpOYTyFwOkA8+gdzMAXLDJ5BNwOwCIGRjaPcGRARsA55kgJioH5JegRQpAkhMeK7IVfwrIEFBQVFdPwA3LF21VNd8XQAAAABJRU5ErkJggg=="
      />
      <Text size="xs" as="span" className={cnMixSpace({ mL: 's' })}>
        {t('bestPrices.firePlace')}
      </Text>
    </div>
  );
};

export default RealEstateObjectCardFireplaceComponent;
