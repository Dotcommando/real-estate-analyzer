import React from 'react';
import { useTranslation } from 'react-i18next';
import { cnMixSpace } from '@consta/uikit/MixSpace';
import { Text } from '@consta/uikit/Text';

import { RealEstateObject } from '../../../../../../../types/real-estate.type';

type Props = {
  realEstateObject: RealEstateObject;
};

const RealEstateObjectCardBalconyComponent = ({
  realEstateObject,
}: Props) => {
  const { t } = useTranslation();

  if (!realEstateObject.included?.find((include) => include === 'Balcony')) {
    return null;
  }

  return (
    <div className="flex-default">
      <img
        alt={t('bestPrices.Balcony')}
        className="icon-m"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADaklEQVR4nO3XS0hWQRQH8GtqGFaL2mhRQiFCtSjNTdrGSgoJNRBUtAeSaQiSj40IaeQLsYVhpS1LBKHAB7pIe0AIFeY2DWqlUpGVq6TwHzf+HxyPc3G+ovKze1bym+M4Z+7cc0fHCTLwl8L507HmCnFWSf4vh1+IZcB/IkGGf7QsA/7RCjL8o2UZ8L/sQYZ/RbEM+F0ryPC7lmXAP1pBhn+0LAP+0VorRwvAegAtAGYATANocu1fLQwr5HuuF0Cz4drRuIoLaTaul1W5cQhACn+edlZpwGu9YiDFCbEAkCoLcc9YqEdj4OVp4ssTajHjFrGkOQHYzcE36vF9oscIu0ErFZZOe6x+/2coe0I+JuwirUNYLG1O/f5b+i7TeTvBwQfCNtG+AggT3k/PFHaKNmBRyCA5W1gWrU/YOgAL9M3CR2nppkIqOXhL2AHalModpycLK6D1WBTSQy4QlkwbV7mv6fuFddIumQoZ4OAZYadp91Tue3qssFJap0UhXeQSYdto71TufXqhsHO0fl1EBIAvHIwT3kq7LCwKwCKA7wDChVcxt82ikDZylbBwzunOHSW8jrmtwuJo7poj5MSHPY7QiOFdiDd9NAHU0+ssCgksrl75ND1eWCZtROVO0VMlXiW2CwsD8JG+Q/hR2nM18TV6hUUhlR5P7wX9iLCdtDnVcK7Tr8gJHhGzLFpfoe4u6twXWxRSTO5S3qffB7pbhH4ns2kPZeIscY+wJNqEmrScftOjE+VZFJLn0eFu0suVT9CThO2lzcjEQK+ONnxXhtWkNfRm5b30HItCcsi9HjfbGuXD9OPComkLMnHe8OgOevT1Evod5bfp53/jaN2lX1D+0vBEAu36s+kDlyZsK21etdmT9DH1xwKtutqikGrdUulj9JOqLQc2eovwtGUbzYvXknsOfdKwEwm0WZVbS2+wKKSBXKt8lp5geFdfqdx2eotjWJzbbjcIv6VbKoBIAN/44doovMxjM0yFdJDLhG3knO7ckcIrDFcn96P8gb5Pzu0OPuVAkbBc2qDHk0o03LW6LQrpNty1EmmTHhfMXGFFtGdLiuDgWQ6OCovhLs3Lq4Do9/nCMmhDFoUMkTOE5RtuvxH824vq34hRvemOoQuEUmxfVojcvVAJxytWTFglgf+ukFAJZy0W8gMOfrP6XpeagwAAAABJRU5ErkJggg=="
      />
      <Text size="xs" as="span" className={cnMixSpace({ mL: 's' })}>
        {t('bestPrices.balcony')}
      </Text>
    </div>
  );
};

export default RealEstateObjectCardBalconyComponent;
