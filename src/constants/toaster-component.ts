export type TypeToastItem = {
  id?: string;
  content: string;
  headline?: string;
  type: 'error' | 'warn' | 'info' | 'success';
};
