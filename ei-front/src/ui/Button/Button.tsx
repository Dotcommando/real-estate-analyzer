import React from 'react';
import './Button.scss';

type ButtonProps = {
  id?: string;
  type?: 'primary' | 'secondary';
  disabled?: boolean;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  roundedCorners?: 'all' | 'top' | 'none';
  fullWidth?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  id,
  type = 'secondary',
  disabled = false,
  size = 'm',
  roundedCorners = 'all',
  fullWidth = false,
  onClick,
  children = '',
}) => {
  const getButtonTypeClass = (type: ButtonProps['type']): string => {
    switch (type) {
      case 'primary':
        return 'ei-button_primary';
      case 'secondary':
        return 'ei-button_secondary';
      default:
        return 'ei-button_secondary';
    }
  };

  const getButtonSizeClass = (size: ButtonProps['size']): string => {
    switch (size) {
      case 'xs':
        return 'ei-button_xs';
      case 's':
        return 'ei-button_s';
      case 'm':
        return 'ei-button_m';
      case 'l':
        return 'ei-button_l';
      case 'xl':
        return 'ei-button_xl';
      default:
        return 'ei-button_m';
    }
  };

  const getRoundedCorners = (rounded: ButtonProps['roundedCorners']): string => {
    switch (rounded) {
      case ('all'):
        return 'ei-button_rounded-all';
      case ('top'):
        return 'ei-button_rounded-top';
      case ('none'):
        return 'ei-button_non-rounded';
      default:
        return 'ei-button_rounded-all';
    }
  }

  const buttonClasses = `ei-button ${getButtonTypeClass(type)} ${getButtonSizeClass(size)} ${getRoundedCorners(roundedCorners)} ${fullWidth ? 'ei-button_full-width' : ''}`;

  return (
    <button
      id={id}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
