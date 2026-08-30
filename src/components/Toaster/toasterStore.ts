import type { TypeToastItem } from '../../constants/toaster-component';

type Listener = () => void;

let toasts: TypeToastItem[] = [];
const listeners = new Set<Listener>();
const timeouts = new Map<string, ReturnType<typeof setTimeout>>();
const EMPTY_TOASTS: TypeToastItem[] = [];
let nextId = 0;

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

export const subscribeToasts = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getToastsSnapshot = () => toasts;

export const getServerToastsSnapshot = () => EMPTY_TOASTS;

export const killAToastById = (id: string) => {
  const timeoutId = timeouts.get(id);
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeouts.delete(id);
  }
  if (!toasts.some((toast) => toast.id === id)) return;
  toasts = toasts.filter((toast) => toast.id !== id);
  emitChange();
};

export const showToast = (toast: TypeToastItem, timeoutMs = 3000): string | null => {
  if (!toast.content || !toast.type) return null;

  const id = `toast_${++nextId}`;
  timeouts.set(
    id,
    setTimeout(() => killAToastById(id), timeoutMs)
  );

  toasts = [...toasts, { ...toast, id }];
  emitChange();

  if (toasts.length >= 6) {
    killAToastById(toasts[0].id!);
  }

  return id;
};

function capitalizeFirstLetter(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function clearMessage(message: string): string {
  if (!message) return '';
  const unusedChars = ['.', '-', '_'];
  const cleaned = unusedChars.reduce((acc, char) => acc.split(char).join(' '), message);
  return capitalizeFirstLetter(cleaned);
}

/** Converts a backend error response into a toast-ready shape */
export const errorToToast = (error: any): TypeToastItem => {
  const data = error?.response?.data;
  if (data?.errorMessage) {
    return {
      headline: clearMessage(data.errorCode).toUpperCase(),
      content: clearMessage(data.errorMessage),
      type: 'error',
    };
  }
  return { content: '', type: 'error' };
};
