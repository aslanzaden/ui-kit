import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import type { IconsTypes } from '../../constants/icons';
import type { TypeColorKeys } from '../../constants/colors';
import './IconButton.css';

export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  iconName?: IconsTypes;
  iconSize?: string;
  iconColor?: TypeColorKeys;
  size?: IconButtonSize;
  /** Overrides the default icon — falls back to `iconName` when omitted */
  children?: ReactNode;
}

export const IconButton = ({
  iconName,
  iconSize = '1rem',
  iconColor = 'accent_foreground',
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...rest
}: IconButtonProps) => {
  const classes = ['icon-button', `icon-button--${size}`, className].filter(Boolean).join(' ');

  return (
    <button type={type} disabled={disabled} className={classes} {...rest}>
      {children ?? (iconName ? <Icon iconName={iconName} size={iconSize} color={iconColor} /> : null)}
    </button>
  );
};

export default IconButton;
