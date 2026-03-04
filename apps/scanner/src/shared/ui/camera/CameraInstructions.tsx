import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

export function CameraInstructions() {
  return (
    <>
      <View style={styles.instructionItem}>
        <Ionicons name="qr-code-outline" size={20} color="#666" />
        <Text style={styles.instructionText}>Держите код в центре рамки</Text>
      </View>
      <View style={styles.instructionItem}>
        <Ionicons name="camera-outline" size={20} color="#666" />
        <Text style={styles.instructionText}>Избегайте бликов и теней</Text>
      </View>
      <View style={styles.instructionItem}>
        <Ionicons name="time-outline" size={20} color="#666" />
        <Text style={styles.instructionText}>
          Сканирование занимает 1-2 секунды
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
});
