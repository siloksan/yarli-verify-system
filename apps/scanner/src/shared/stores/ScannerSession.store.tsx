import { WebToAppMessage } from '@repo/api';
import { create } from 'zustand';

interface ScannerSessionState {
  request: WebToAppMessage | null;
  setRequest: (payload: WebToAppMessage) => void;
  clearSession: () => void;
}

export const useScannerSessionStore = create<ScannerSessionState>((set) => ({
  request: null,

  setRequest: (payload) =>
    set({
      request: payload,
    }),

  clearSession: () =>
    set({
      request: null,
    }),
}));
