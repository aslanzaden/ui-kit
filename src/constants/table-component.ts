import type { IconsTypes } from './icons';
import type { TypeColorKeys } from './colors';
import type { ButtonMode } from '../components/Button/Button';

export type TableBooleanStateVariant = {
  type?: 'icon' | 'text';
  value?: string | IconsTypes;
  color?: TypeColorKeys;
};

export type TableBooleanStates = {
  truthy?: TableBooleanStateVariant;
  falsy?: TableBooleanStateVariant;
};

export interface TableInputConfig {
  inputType?: 'text' | 'number';
  placeholder?: string;
  min?: number;
  max?: number;
  disabled?: boolean | ((row: any) => boolean);
}

export interface TableButtonConfig {
  icon?: IconsTypes;
  label?: string;
  mode?: ButtonMode;
  disabled?: boolean | ((row: any) => boolean);
}

export interface TableColumn {
  /** field name in row objects */
  key: string;
  label?: string;
  type?: 'string' | 'number' | 'boolean' | 'enum' | 'date' | 'input' | 'button';
  minWidth?: string | number;
  sortable?: boolean;
  visibility?: boolean;
  align?: 'left' | 'center' | 'right';
  enumStates?: Array<{ label: string; value: number | string; color: string }>;
  states?: TableBooleanStates;
  inputConfig?: TableInputConfig;
  buttonConfig?: TableButtonConfig;
}

export type TableOptions = {
  rowsPerPageOptions?: number[];
  selectionType?: 'simple' | 'checkbox' | 'radio';
  searchable?: boolean;
  isActionable?: boolean;
  canAddItems?: boolean;
  fullWidth?: boolean;
  hidePagination?: boolean;
};

/** For bulk status-change actions on the selection bar */
export interface TableStatusTransition {
  value: string;
  label: string;
  icon?: IconsTypes;
  mode?: 'outline' | 'main' | 'text';
  /** current statuses that allow this transition */
  validFromStatuses: (string | number)[];
}

export interface TableAction {
  call?: () => void;
  label: string;
  value: string;
  icon?: IconsTypes;
  mode?: ButtonMode;
}

export interface TablePage {
  current: number | null;
  total: number | null;
  perPage: number | null;
}
