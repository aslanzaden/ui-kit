import en from './locales/en.json';

// Storybook-only example translator. Shows how to wire the `t` prop that
// Modal/Stepper/DataCounter/Toaster/DataTable accept — nothing here ships in
// the published package, since `.storybook/` isn't part of the vite build entry.
const dictionary: Record<string, string> = en;

export const t = (key: string, params?: Record<string, any>): string => {
  let str = dictionary[key] ?? key;
  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      str = str.split(`{{${paramKey}}}`).join(String(value));
    });
  }
  return str;
};
