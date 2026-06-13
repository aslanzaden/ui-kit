import React, { useMemo } from 'react';
import './DataCounter.css';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface EnumState {
  label: string;
  value: number | string | boolean;
  color?: string;
}

export interface BooleanStates {
  truthy: { type: 'icon' | 'text'; value: string; color?: string };
  falsy: { type: 'icon' | 'text'; value: string; color?: string };
}

export interface Column {
  label: string;
  value: any;
  type?: 'string' | 'number' | 'boolean' | 'enum' | 'date';
  icon?: string;
  iconColor?: string;
  enumStates?: EnumState[];
  states?: BooleanStates;
}

export interface BadgeProp {
  value: string;
  type: 'error' | 'warn' | 'success' | 'info';
}

interface DisplayItem {
  title: string;
  value: string | number | boolean | null;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'date';
  enumLabel?: string | number | boolean;
  enumColor?: string;
  isEmpty?: boolean;
  icon?: string;
  iconColor?: string;
  states?: BooleanStates;
  booleanValue?: boolean;
}

// ─── Sub-components (replace with your real Icon / Badge) ────────────────────

interface IconProps {
  iconName: string;
  color?: string;
  className?: string;
  onClick?: () => void;
}

/** Swap this out for your real Icon component */
const CoreIcon: React.FC<IconProps> = ({ iconName, color, className, onClick }) => (
  <span
    className={`core-icon ${className ?? ''}`}
    style={{ color }}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    aria-label={iconName}
  >
    {iconName}
  </span>
);

interface BadgeProps {
  variant?: string;
  children: React.ReactNode;
}

/** Swap this out for your real Badge component */
const CoreBadge: React.FC<BadgeProps> = ({ variant, children }) => (
  <span className={`core-badge ${variant ?? ''}`}>{children}</span>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (raw: string | number | Date | null | undefined): string => {
  if (raw == null) return '';
  try {
    const date = raw instanceof Date ? raw : new Date(raw as any);
    if (isNaN(date.getTime())) return String(raw);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return String(raw);
  }
};

const buildDisplayData = (structure: Column[]): DisplayItem[] => {
  const items: DisplayItem[] = [];

  structure.forEach((column) => {
    const raw = column.value;

    if (raw == null || raw === '') {
      items.push({ title: column.label, value: null, type: column.type || 'string', isEmpty: true });
      return;
    }

    if (column.type === 'date') {
      items.push({ title: column.label, value: formatDate(raw), type: 'date' });
      return;
    }

    if (typeof raw === 'object') return;

    if (column.type === 'enum' && column.enumStates) {
      const enumState = column.enumStates.find((s) => s.value === raw);
      items.push({
        title: column.label,
        value: raw,
        type: 'enum',
        enumLabel: enumState?.label ?? raw,
        enumColor: enumState?.color,
      });
      return;
    }

    if (column.type === 'boolean') {
      items.push({
        title: column.label,
        value: raw,
        type: 'boolean',
        states: column.states,
        booleanValue: Boolean(raw),
        icon: column.icon,
      });
      return;
    }

    items.push({
      title: column.label,
      value: raw,
      type: column.type || 'string',
      icon: column.icon,
      iconColor: column.iconColor,
    });
  });

  return items;
};

// ─── Component ───────────────────────────────────────────────────────────────

export interface DataCounterProps {
  title?: string;
  badge?: BadgeProp;
  structure: Column[];
  gridColumns?: number;
  /** Slot: actions rendered in the header */
  actions?: React.ReactNode;
  /** i18n helper – defaults to identity */
  t?: (key: string) => string;
  onIconClick?: (item: DisplayItem) => void;
}

export const DataCounter: React.FC<DataCounterProps> = ({
  title,
  badge,
  structure,
  gridColumns = 3,
  actions,
  t = (k) => k,
  onIconClick,
}) => {
  const displayData = useMemo(() => buildDisplayData(structure), [structure]);

  const showHeader = title || badge || actions;

  const renderValue = (item: DisplayItem) => {
    if (item.isEmpty) {
      return <span className="muted">{t('no_info')}</span>;
    }

    if (item.type === 'enum') {
      return item.enumColor ? (
        <CoreBadge variant={item.enumColor}>
          {t(String(item.enumLabel ?? item.value))}
        </CoreBadge>
      ) : (
        <span className="muted">{t(String(item.enumLabel ?? item.value))}</span>
      );
    }

    if (item.type === 'boolean' && item.states) {
      const state = item.booleanValue ? item.states.truthy : item.states.falsy;
      return state.type === 'icon' ? (
        <CoreIcon iconName={state.value} className={state.color} />
      ) : (
        <span className={`muted ${state.color ?? ''}`}>{t(state.value)}</span>
      );
    }

    return <span className="muted">{String(item.value)}</span>;
  };

  return (
    <div className="data-counter__component">
      {showHeader && (
        <div className="head__data-counter">
          {title && <h4>{title}</h4>}
          <div className="actions-area">
            {actions}
            {badge && (
              <span className={`badge ${badge.type}`}>{badge.value}</span>
            )}
          </div>
        </div>
      )}

      {displayData.length > 0 ? (
        <div
          className="content__data-counter"
          style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
        >
          {displayData.map((item, index) => (
            <div className="content-item__content" key={index}>
              <strong className="title">
                {t(item.title)}
                {item.icon && (
                  <CoreIcon
                    iconName={item.icon}
                    color={item.iconColor}
                    className="label-icon"
                    onClick={() => onIconClick?.(item)}
                  />
                )}
              </strong>
              {renderValue(item)}
            </div>
          ))}
        </div>
      ) : (
        <div>{t('no_info')}</div>
      )}
    </div>
  );
};

export default DataCounter;
export type { DisplayItem };