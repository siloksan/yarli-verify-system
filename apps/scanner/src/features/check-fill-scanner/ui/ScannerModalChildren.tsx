import { Ionicons } from '@expo/vector-icons';
import { IScanEventDto } from '@repo/api';
import { View, Text, Pressable, StyleSheet } from 'react-native';
// import { FillingState } from '../model/machine/filling.types';

interface Props {
  resetScanner: () => void;
}

export function ScannerInProgress() {
  return (
    <View style={styles.modalContent}>
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Ionicons name="time-outline" size={20} color="#FFA500" />
          <Text style={styles.resultTitle}>Валидация</Text>
        </View>
        <Text style={styles.resultValue}>
          Пожалуйста, подождите, пока идет валидация кода.
        </Text>
      </View>
    </View>
  );
}

interface BucketScannedSuccessProps {
  componentName: string;
  turnOnScanner: () => void;
}

export function BucketScannedSuccess({
  turnOnScanner,
  componentName,
}: BucketScannedSuccessProps) {
  return (
    <View style={styles.modalContent}>
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Ionicons name="checkmark-circle" size={20} color="#1E7F3F" />
          <Text style={[styles.resultTitle, { color: '#1E7F3F' }]}>
            Ёмкость для заполнения проверена
          </Text>
        </View>
        <View>
          <Text style={styles.resultValue}>
            Отсканированна ёмкость с {componentName}
          </Text>
        </View>
      </View>
      <Pressable style={styles.closeButton} onPress={turnOnScanner}>
        <Text style={styles.closeButtonText}>Сканировать код компонента</Text>
      </Pressable>
    </View>
  );
}

interface ComponentScannedSuccessProps {
  componentName: string;
  scannedComponentBatch: string;
}

export function ComponentScannedSuccess({
  componentName,
  scannedComponentBatch,
}: ComponentScannedSuccessProps) {
  return (
    <View style={styles.modalContent}>
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Ionicons name="checkmark-circle" size={20} color="#1E7F3F" />
          <Text style={[styles.resultTitle, { color: '#1E7F3F' }]}>
            Компонент для заполнения проверен
          </Text>
        </View>
        <View>
          <Text style={styles.resultValue}>
            Сканирован компонент: {componentName}
          </Text>
          <Text style={styles.resultValue}>
            Сканированная партия: {scannedComponentBatch}
          </Text>
        </View>
      </View>
      {/* <Pressable
        style={styles.closeButton}
        onPress={() => {
          hideModal?.();
        }}
      >
        <Text style={styles.closeButtonText}>Закрыть окно</Text>
      </Pressable> */}
    </View>
  );
}

interface ScannedErrorProps extends Props {
  message: string;
}

export function ScannedError({ message, resetScanner }: ScannedErrorProps) {
  return (
    <View style={styles.modalContent}>
      <View style={styles.errorCard}>
        <View style={styles.resultHeader}>
          <Ionicons name="alert-circle" size={20} color="#B42318" />
          <Text style={styles.errorTitle}>Ошибка валидации</Text>
        </View>
        <Text style={styles.errorText}>{message}</Text>
      </View>
      <Pressable style={styles.closeButton} onPress={resetScanner}>
        <Text style={styles.closeButtonText}>Сканировать ещё раз</Text>
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
