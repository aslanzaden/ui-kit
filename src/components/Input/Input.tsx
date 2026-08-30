import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Icon } from '../Icon/Icon';
import type { IconsTypes } from '../../constants/icons';
import type {
  TypeInputAutoComplete,
  TypeInputMessage,
  TypeInputName,
  TypeInputTypes,
} from '../../constants/input-component';
import './Input.css';

export interface InputUrl {
  to: string;
  label?: string;
}

export interface InputProps {
  leftIcon?: IconsTypes;
  rightIcon?: IconsTypes;
  label?: ReactNode;
  type?: TypeInputTypes;
  message?: TypeInputMessage;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  tabIndex?: number;
  autoComplete?: TypeInputAutoComplete;
  placeholder?: string;
  name?: TypeInputName;
  disabled?: boolean;
  readOnly?: boolean;
  title?: string;
  accept?: string;
  value?: string | number | null;
  /** Renders a link (e.g. "Forgot password?") next to the label */
  url?: InputUrl;
  className?: string;
  style?: CSSProperties;
  /** Fires on every keystroke, mirrors Vue's v-model */
  onChange?: (value: string) => void;
  /** Fires on blur, mirrors the Vue component's 'validation' emit */
  onValidate?: (value: string | number | null) => void;
  onFocusChange?: (focused: boolean) => void;
  onLeftIconClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRightIconClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface InputHandle {
  inputElement: HTMLInputElement | null;
  focus: () => void;
  blur: () => void;
}

export const Input = forwardRef<InputHandle, InputProps>(({
  leftIcon,
  rightIcon,
  label,
  type = 'text',
  message,
  required = false,
  min,
  max,
  minLength,
  maxLength,
  tabIndex,
  autoComplete = 'off',
  placeholder,
  name = 'text',
  disabled = false,
  readOnly = false,
  title,
  accept,
  value = '',
  url,
  className = '',
  style,
  onChange,
  onValidate,
  onFocusChange,
  onLeftIconClick,
  onRightIconClick,
}, ref) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useImperativeHandle(ref, () => ({
    inputElement: inputRef.current,
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
  }));

  const resolvedType = type === 'password' && showPassword ? 'text' : type;
  const iconColor = focused ? 'primary' : 'muted_foreground';

  const handleFocus = () => {
    setFocused(true);
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    setFocused(false);
    onFocusChange?.(false);
    onValidate?.(value ?? null);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange?.(e.target.value);
    }
  };

  const wrapperClasses = [
    'custom-input__component-area',
    message?.type ?? '',
    focused ? 'focus' : '',
    disabled ? 'disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses} style={style}>
      {label && (
        <div className="top__custom-input">
          <label htmlFor={inputId}>
            {label} {required && <span className="required">*</span>}
          </label>
          {url && (
            <a href={url.to} className="input-url-link">
              {url.label || url.to}
            </a>
          )}
        </div>
      )}

      <div className="center__custom-input">
        {leftIcon && (
          <div className="left-side__custom-input">
            <button type="button" onClick={onLeftIconClick}>
              <Icon iconName={leftIcon} color={iconColor} />
            </button>
          </div>
        )}

        <div className="main__custom-input">
          <input
            ref={inputRef}
            id={inputId}
            type={resolvedType}
            min={min}
            max={max}
            aria-label={typeof label === 'string' ? label : undefined}
            title={title}
            accept={accept}
            disabled={disabled}
            minLength={minLength}
            maxLength={maxLength}
            placeholder={placeholder}
            tabIndex={tabIndex}
            name={name}
            required={required}
            readOnly={readOnly}
            autoComplete={autoComplete}
            value={value ?? ''}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleInput}
          />
        </div>

        {(rightIcon || type === 'password') && (
          <div className="right-side__custom-input">
            {type !== 'password' ? (
              rightIcon && (
                <button type="button" onClick={onRightIconClick}>
                  <Icon iconName={rightIcon} color={iconColor} />
                </button>
              )
            ) : (
              <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
                <Icon iconName={showPassword ? 'Eye' : 'EyeOff'} color={iconColor} />
              </button>
            )}
          </div>
        )}
      </div>

      {message && (
        <div className="bottom__custom-input">
          <span className="message-content__input">{message.content}</span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
