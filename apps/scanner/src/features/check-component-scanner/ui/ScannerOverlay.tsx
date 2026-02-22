import { View, StyleSheet } from 'react-native';
import { ScannerFrame } from './ScannerFrame';
import { TorchButton } from './TorchButton';

type ScannerOverlayProps = {
  scannerSize: number;
  torch: boolean;
  onToggleTorch: () => void;
};

export function ScannerOverlay({
  scannerSize,
  torch,
  onToggleTorch,
}: ScannerOverlayProps) {
  return (
    <View style={styles.overlay}>
      <View style={styles.overlayTop} />

      <View style={[styles.overlayRow, { height: scannerSize }]}>
        <View style={styles.overlaySide} />
        <ScannerFrame scannerSize={scannerSize} />
        <View style={styles.overlaySide} />
      </View>

      <View style={styles.overlayBottom}>
        <TorchButton torch={torch} onPress={onToggleTorch} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  overlayRow: {
    flexDirection: 'row',
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 2,
  },
});
