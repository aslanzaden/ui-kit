import { type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import type { IconsTypes } from '../../constants/icons';
import type { TypeColorKeys } from '../../constants/colors';

export type ButtonMode =
  | 'main'
  | 'main-danger'
  | 'secondary'
  | 'text'
  | 'url'
  | 'danger';

export interface ButtonProps {
  children?: ReactNode;
  leftIcon?: IconsTypes;
  rightIcon?: IconsTypes;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  name?: string;
  mode?: ButtonMode;
  iconColor?: TypeColorKeys;
  autoResize?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: CSSProperties;
}

const getIconColor = (
  mode: ButtonMode | undefined,
  iconColor: TypeColorKeys | undefined
): TypeColorKeys => {
  if (iconColor) return iconColor;
  switch (mode) {
    case 'main':
      return 'accent';
    case 'text':
      return 'accent_foreground';
    default:
      return 'accent_foreground';
  }
};

export const Button = ({
  children,
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  type = 'button',
  name = 'btn',
  mode,
  iconColor,
  autoResize = false,
  onClick,
  className = '',
  style,
}: ButtonProps) => {
  const resolvedIconColor = getIconColor(mode, iconColor);

  const classes = [
    'custom-button',
    mode,
    disabled ? 'disabled' : '',
    loading ? 'loading' : '',
    autoResize ? 'auto-resize' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      name={name}
      disabled={disabled || loading}
      className={classes}
      onClick={onClick}
      style={style}
    >
      {leftIcon && !loading && (
        <span className="custom-button__left">
          <Icon iconName={leftIcon} size="1rem" color={resolvedIconColor} />
        </span>
      )}

      <span className="custom-button__center">{children}</span>

      {rightIcon && !loading && (
        <span className="custom-button__right">
          <Icon iconName={rightIcon} size="1rem" color={resolvedIconColor} />
        </span>
      )}
    </button>
  );
};

export default Button;