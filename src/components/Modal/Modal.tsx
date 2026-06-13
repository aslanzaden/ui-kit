import React, { useEffect } from 'react';
import './Modal.css';

// ─── Types ───────────────────────────────────────────────────────────────────

type ButtonMode = 'main' | 'main-danger' | 'secondary' | 'text' | 'url' | 'danger';

export interface ModalButton {
  label: string;
  mode?: ButtonMode;
  action: 'confirm' | 'cancel' | string;
  disabled?: boolean;
  loading?: boolean;
}

export interface ModalLabels {
  title?: string;
  subtitle?: string;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  labels?: ModalLabels;
  buttons?: ModalButton[];
  isLoading?: boolean;
  /** Confirms are disabled while loading by default */
  confirmDisabled?: boolean;
  onButtonClick?: (action: string) => void;
  children?: React.ReactNode;
  /** Override footer entirely */
  footer?: React.ReactNode;
  /** i18n helper – defaults to identity */
  t?: (key: string) => string;
}

// ─── Button stub (swap for your real Button) ─────────────────────────────────

interface CoreButtonProps {
  mode?: ButtonMode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const CoreButton: React.FC<CoreButtonProps> = ({
  mode = 'secondary',
  disabled,
  loading,
  onClick,
  children,
}) => (
  <button
    className={`modal-btn modal-btn--${mode}`}
    disabled={disabled || loading}
    onClick={onClick}
  >
    {loading ? <span className="modal-btn__spinner" /> : null}
    {children}
  </button>
);

// ─── Default buttons ──────────────────────────────────────────────────────────

const DEFAULT_BUTTONS: ModalButton[] = [
  { label: 'Cancel', action: 'cancel' },
  { label: 'Confirm', mode: 'main', action: 'confirm' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  labels = {},
  buttons = DEFAULT_BUTTONS,
  isLoading = false,
  confirmDisabled = false,
  onButtonClick,
  children,
  footer,
  t = (k) => k,
}) => {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const handleButtonClick = (action: string) => {
    if (action === 'cancel') {
      onClose();
    }
    onButtonClick?.(action);
  };

  const resolvedFooter = footer ?? (
    <footer className="app-modal__footer">
      {buttons.map((btn) => {
        const isConfirm = btn.action === 'confirm';
        return (
          <CoreButton
            key={btn.action}
            mode={btn.mode}
            disabled={isConfirm ? confirmDisabled || isLoading : btn.disabled}
            loading={isConfirm ? isLoading : btn.loading}
            onClick={() => handleButtonClick(btn.action)}
          >
            {t(btn.label)}
          </CoreButton>
        );
      })}
    </footer>
  );

  return (
    <div
      className="app-modal__overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="presentation"
    >
      <div
        className="app-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labels.title ? 'modal-title' : undefined}
      >
        {(labels.title || labels.subtitle) && (
          <header className="app-modal__header">
            {labels.title && (
              <h3 id="modal-title" className="app-modal__title">
                {t(labels.title)}
              </h3>
            )}
            {labels.subtitle && (
              <p className="app-modal__subtitle">{t(labels.subtitle)}</p>
            )}
          </header>
        )}

        <div className="app-modal__body">{children}</div>

        {resolvedFooter}
      </div>
    </div>
  );
};

export default Modal;