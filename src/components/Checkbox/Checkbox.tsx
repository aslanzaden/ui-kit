import React, { useMemo, useId } from 'react';
import type { TypeInputName } from '../../constants/input-component';
import './Checkbox.css';

export interface CheckboxProps {
  checked?: boolean;
  title?: string;
  name?: TypeInputName;
  disabled?: boolean;
  required?: boolean;
  onChange?: (checked: boolean) => void;
  children?: React.ReactNode;
}

function generateUniqueId(length = 5): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  title,
  name = 'checkbox',
  disabled = false,
  required = false,
  onChange,
  children,
}) => {
  const uid = useMemo(() => `checkbox_${generateUniqueId(5)}`, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={`checkbox-component${disabled ? ' disabled' : ''}`}>
      <input
        type="checkbox"
        id={uid}
        checked={checked ?? false}
        title={title}
        name={name}
        disabled={disabled}
        required={required}
        onChange={handleChange}
      />
      <label htmlFor={uid} className="checkbox-label">
        {children}
      </label>
    </div>
  );
};

export default Checkbox;