import { type ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import type { IconsTypes } from '../../constants/icons';
import type { TypeColorKeys } from '../../constants/colors';
import type { BadgeVariant } from './Badge.types';
import './Badge.css';

export interface BadgeProps {
  variant?: BadgeVariant;
  icon?: IconsTypes | null;
  iconColor?: TypeColorKeys;
  children?: ReactNode;
}

type InternalVariant = BadgeVariant | 'outlined';

const normalizeVariant = (variant: InternalVariant): BadgeVariant => {
  switch (variant) {
    case 'outlined':
      return 'outline';
    case 'default':
      return 'secondary';
    default:
      return variant;
  }
};

export const Badge = ({
  variant = 'default',
  icon = null,
  iconColor = 'primary_foreground',
  children,
}: BadgeProps) => {
  const normalized = normalizeVariant(variant);

  return (
    <span
      className={[
        'badge',
        `badge--${normalized}`,
        icon ? 'has-icon' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && (
        <Icon
          iconName={icon}
          size="0.8rem"
          color={iconColor}
          hover
          className="badge__icon"
        />
      )}
      {children}
    </span>
  );
};

export default Badge;