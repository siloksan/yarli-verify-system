import { ScanResult } from '@repo/api';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, StyleSheet } from 'react-native';
import { CameraInstructions } from './CameraInstructions';

type ValidationResultState = {
  scanResult: ScanResult;
  scannedComponentBatch: string;
};

type ScannerStatusPanelProps = {
  isValidating: boolean;
  validationError: string | null;
  scanned: boolean;
  scanData: string | null | undefined;
  validationResult: ValidationResultState | null;
};

export function ScannerStatusPanel({
  isValidating,
  validationError,
  scanned,
  scanData,
  validationResult,
}: ScannerStatusPanelProps) {
  if (isValidating) {
    return (
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Ionicons name="time-outline" size={20} color="#1E7F3F" />
          <Text style={styles.resultTitle}>Validation</Text>
        </View>
        <Text style={styles.resultValue}>
          Please wait while code validation is in progress.
        </Text>
      </View>
    );
  }

  if (validationError) {
    return (
      <View style={styles.errorCard}>
        <View style={styles.resultHeader}>
          <Ionicons name="alert-circle" size={20} color="#B42318" />
          <Text style={styles.errorTitle}>Validation error</Text>
        </View>
        <Text style={styles.errorText}>{validationError}</Text>
      </View>
    );
  }

  if (scanned && scanData) {
    const isSuccess = validationResult?.scanResult === ScanResult.OK;

    return (
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Ionicons
            name={isSuccess ? 'checkmark-circle' : 'close-circle'}
            size={20}
            color={isSuccess ? '#1E7F3F' : '#B42318'}
          />
          <Text style={styles.resultTitle}>
            {isSuccess ? 'Code validated' : 'Code does not match'}
          </Text>
        </View>
        <Text style={styles.resultValue}>{scanData}</Text>
        {validationResult?.scannedComponentBatch ? (
          <Text style={styles.resultValue}>
            Batch: {validationResult.scannedComponentBatch}
          </Text>
        ) : null}
      </View>
    );
  }

  return <CameraInstructions />;
}

const styles = StyleSheet.create({
  resultCard: {
    backgroundColor: '#F0F8F2',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D6ECDD',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E7F3F',
    marginLeft: 8,
  },
  resultValue: {
    fontSize: 14,
    color: '#1C1C1C',
    marginBottom: 16,
  },
  errorCard: {
    backgroundColor: '#FEF3F2',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECDCA',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B42318',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#7A271A',
  },
});
