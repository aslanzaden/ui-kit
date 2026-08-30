import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import type { IconsTypes } from '../../constants/icons';
import type { TypeColorKeys } from '../../constants/colors';
import type { TypeToastItem } from '../../constants/toaster-component';
import { getServerToastsSnapshot, getToastsSnapshot, killAToastById, subscribeToasts } from './toasterStore';
import './Toaster.css';

const HEADER_KEY_BY_TYPE: Record<TypeToastItem['type'], string> = {
  error: 'error',
  warn: 'warn',
  success: 'success',
  info: 'info',
};

const ICON_BY_TYPE: Record<TypeToastItem['type'], IconsTypes> = {
  error: 'CircleX',
  warn: 'CircleAlert',
  success: 'CircleCheck',
  info: 'CircleHelp',
};

const ICON_COLOR_BY_TYPE: Record<TypeToastItem['type'], TypeColorKeys> = {
  error: 'destructive',
  warn: 'warn',
  success: 'success',
  info: 'foreground',
};

export interface ToasterProps {
  /** i18n helper – defaults to identity */
  t?: (key: string) => string;
}

export const Toaster = ({ t = (k) => k }: ToasterProps) => {
  const toasts = useSyncExternalStore(subscribeToasts, getToastsSnapshot, getServerToastsSnapshot);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="toaster-container">
      {toasts.map((toast) => (
        <div key={toast.id} id={`toast-${toast.id}`} className={`toaster ${toast.type}`}>
          <div className="head__toast">
            <div className="label-area">
              <strong>{t(HEADER_KEY_BY_TYPE[toast.type])}</strong>
              <div className="icon-area">
                <Icon
                  iconName={ICON_BY_TYPE[toast.type]}
                  color={ICON_COLOR_BY_TYPE[toast.type]}
                  size="1.1rem"
                />
              </div>
              <strong>{toast.headline ? ` - ${toast.headline}` : ''}</strong>
            </div>
            <div>
              <IconButton
                iconName="Close"
                iconSize="0.7rem"
                size="sm"
                aria-label={t('close')}
                onClick={() => killAToastById(toast.id!)}
              />
            </div>
          </div>
          <div className="body__toast">
            <span className="content">{t(toast.content)}</span>
          </div>
        </div>
      ))}
    </div>,
    document.body
  );
};

export default Toaster;
