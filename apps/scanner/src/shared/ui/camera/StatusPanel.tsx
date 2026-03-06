import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { InfoRow, InfoRowProps } from './InfoRow';

interface Props {
  infoCardStyles?: ViewStyle;
  onActionPress: () => void;
  actionTitle: string;
  infoRows: InfoRowProps[];
}

export function StatusPanel({
  infoCardStyles,
  onActionPress,
  actionTitle,
  infoRows,
}: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.instructionsContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.handle} />
        <View style={[styles.targetInfoCard, infoCardStyles]}>
          <Text style={styles.sectionTitle}>Информация сканирования</Text>
          {infoRows.map((row) => (
            <InfoRow key={row.label} label={row.label} value={row.value} />
          ))}
        </View>

        <Pressable style={styles.resetButton} onPress={onActionPress}>
          <Text style={styles.resetButtonText}>{actionTitle}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: -12,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  scroll: {
    flex: 1,
  },
  instructionsContent: {
    flexGrow: 1,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginBottom: 12,
  },
  targetInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  resetButton: {
    marginTop: 'auto',
    alignSelf: 'stretch',
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#0EA5E9',
    shadowColor: '#0369A1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 2,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
