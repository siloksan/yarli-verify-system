import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

type TorchButtonProps = {
  torch: boolean;
  onPress: () => void;
};

export function TorchButton({ torch, onPress }: TorchButtonProps) {
  return (
    <TouchableOpacity style={styles.torchButton} onPress={onPress}>
      <Ionicons name={torch ? 'flash' : 'flash-off'} size={24} color="white" />
      <Text style={styles.torchText}>
        {torch ? 'Turn off flashlight' : 'Turn on flashlight'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  torchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  torchText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
