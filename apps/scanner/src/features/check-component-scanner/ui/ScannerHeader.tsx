import { Text, View, StyleSheet } from 'react-native';

export function ScannerHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Сканируйте код компонента</Text>
      <Text style={styles.headerSubtitle}>
        Наведите камеру на код, чтобы отсканировать компонент.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#000000',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
