import { createContext, useContext } from 'react';
import { ModalContextValue } from './modal.type';

export const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
}
