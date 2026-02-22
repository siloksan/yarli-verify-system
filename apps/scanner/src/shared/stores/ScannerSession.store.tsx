import { ScannerRequestPayload } from '@repo/api';
import { create } from 'zustand';

interface ScannerSessionState {
  request: ScannerRequestPayload | null;
  setRequest: (payload: ScannerRequestPayload) => void;
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
