import { Ionicons } from '@expo/vector-icons';
import { IScanEvent, ScanResult } from '@repo/api';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ScannerState } from '../types';
import { CameraInstructions } from '@/src/shared/ui';

interface Props {
  state: ScannerState;
  validationError: string | null;
  scanData: string | null | undefined;
  validationResult: Omit<IScanEvent, 'id' | 'orderId'> | null;
  hideModal: () => void;
}

export function ScannerModalChildren({
  state,
  hideModal,
  validationError,
  scanData,
  validationResult,
}: Props) {
  const renderContent = () => {
    if (state.status === 'idle') {
      return <CameraInstructions />;
    }

    if (state.status === 'validating') {
      return (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Ionicons name="time-outline" size={20} color="#FFA500" />
            <Text style={styles.resultTitle}>Валидация</Text>
          </View>
          <Text style={styles.resultValue}>
            Пожалуйста, подождите, пока идет валидация кода.
          </Text>
        </View>
      );
    }

    if (state.status === 'error') {
      return (
        <View style={styles.errorCard}>
          <View style={styles.resultHeader}>
            <Ionicons name="alert-circle" size={20} color="#B42318" />
            <Text style={styles.errorTitle}>Ошибка валидации</Text>
          </View>
          <Text style={styles.errorText}>{validationError}</Text>
        </View>
      );
    }

    if (state.status === 'success') {
      const isSuccess = validationResult?.scanResult === ScanResult.OK;

      return (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Ionicons
              name={isSuccess ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={isSuccess ? '#1E7F3F' : '#B42318'}
            />
            <Text
              style={[
                styles.resultTitle,
                { color: isSuccess ? '#1E7F3F' : '#B42318' },
              ]}
            >
              {isSuccess ? 'Код проверен' : 'Код не совпадает'}
            </Text>
          </View>
          <Text style={styles.resultValue}>{scanData}</Text>
          {validationResult && (
            <View>
              <Text style={styles.resultValue}>Отсканированный компонент</Text>
              <Text style={styles.resultValue}>
                Наименование: {validationResult.scannedComponentName}
              </Text>
              <Text style={styles.resultValue}>
                Отсканированная партия: {validationResult.scannedComponentBatch}
              </Text>
            </View>
          )}
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.modalContent}>
      {renderContent()}
      <Pressable style={styles.closeButton} onPress={hideModal}>
        <Text style={styles.closeButtonText}>Закрыть окно</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 24,
  },
  closeButton: {
    marginTop: 8,
    alignSelf: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
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
