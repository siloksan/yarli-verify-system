import { BarcodeType, CameraView } from 'expo-camera';
import React from 'react';

interface Props {
  torch: boolean;
  onScan: (event: { data: string }) => void;
  codeTypes: BarcodeType[];
}

export const ScannerCamera = React.memo(function ScannerCamera({
  torch,
  onScan,
  codeTypes,
}: Props) {
  return (
    <CameraView
      style={{ flex: 1 }}
      onBarcodeScanned={onScan}
      barcodeScannerSettings={{
        barcodeTypes: codeTypes,
      }}
      enableTorch={torch}
    />
  );
});