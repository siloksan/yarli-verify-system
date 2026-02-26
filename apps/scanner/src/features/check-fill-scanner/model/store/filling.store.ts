import { create } from 'zustand';
import { BucketValidationData, FillingState } from '../machine/filling.types';
import { FillingMachine } from '../machine/filling.machine';
import {
  getBucketScanState,
  getComponentScanState,
} from '../services/filling.service';
import { BucketQRData, ICreateFillingActBucketDto } from '@repo/api';

interface FillingStore {
  state: FillingState;
  startBucketValidation: (bucketValidationData: BucketValidationData) => void;
  startComponentValidation: (
    createScanEventData: ICreateFillingActBucketDto,
    bucket: BucketQRData,
  ) => void;
  scanBucket: () => void;
  scanComponent: () => Promise<void>;

  reset: () => void;
  retry: () => void;
}

export const useFillingStore = create<FillingStore>((set, get) => ({
  state: FillingMachine.initial(),
  startBucketValidation(bucketValidationData: BucketValidationData) {
    set({
      state: FillingMachine.startBucketValidation(bucketValidationData),
    });
  },

  scanBucket() {
    const current = get().state;
    const newState = getBucketScanState(current);

    set({ state: newState });
  },

  startComponentValidation(createScanEventData, bucket) {
    set({
      state: FillingMachine.startComponentValidation(
        createScanEventData,
        bucket,
      ),
    });
  },

  async scanComponent() {
    const current = get().state;
    const newState = await getComponentScanState(current);

    set({
      state: newState,
    });
  },

  reset() {
    set({ state: FillingMachine.initial() });
  },

  retry() {
    const current = get().state;
    if (current.step === 'error') {
      set({ state: FillingMachine.retry(current.prev) });
    }
  },
}));
