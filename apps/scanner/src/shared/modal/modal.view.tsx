import { StyleSheet, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  Pressable,
} from 'react-native-gesture-handler';
import { Portal } from 'react-native-portalize';
import type { ModalContent } from './modal.type';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCurrentOpacity } from './modal.utils';
import {
  BACKGROUND_OPACITY,
  GESTURE_THRESHOLD,
  MAX_MODAL_HEIGHT,
  SCREEN_HEIGHT,
  SPRING_EFFECT,
} from './modal.constants';
import { useModal } from './modal.context';
import type { PanGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture';

interface Props {
  children: ModalContent;
  scrollable: boolean;
  translateY: SharedValue<number>;
  backdropOpacity: SharedValue<number>;
  backDropIsActive: boolean;
}

const styles = StyleSheet.create({
  backDrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  staticContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: MAX_MODAL_HEIGHT, // stable layout
  },
  animatedContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 1px 2px 1px rgba(0, 0, 0, 0.1)`,
    zIndex: 10, // ensure shadow renders above content
  },
  swipeIndicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CCC',
  },
});

export function ModalView({
  children,
  scrollable,
  translateY,
  backdropOpacity,
  backDropIsActive,
}: Props) {
  const insets = useSafeAreaInsets();
  const safeBottomGap = insets.bottom;
  const { hideModal } = useModal();

  const panGestureHideModal = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
        backdropOpacity.value = getCurrentOpacity(
          BACKGROUND_OPACITY,
          e.translationY,
          SCREEN_HEIGHT,
        );
      }
    })
    .onEnd((e) => {
      if (e.translationY > GESTURE_THRESHOLD) {
        translateY.value = withSpring(GESTURE_THRESHOLD, SPRING_EFFECT);
        // Close modal
        runOnJS(hideModal)();
      } else {
        // Spring back
        translateY.value = withSpring(0, SPRING_EFFECT);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <Portal>
      {/* Background overlay */}
      {backDropIsActive && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onPress={() => {
            hideModal();
          }}
        />
      )}

      <Animated.View
        pointerEvents="box-none"
        style={[
          { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
          styles.backDrop,
          animatedBackdropStyle,
        ]}
      />
      {/* Static container (keeps maxHeight consistent) */}
      <View style={styles.staticContainer}>
        {/* Animated modal content */}
        <GestureWrapper condition={!scrollable} gesture={panGestureHideModal}>
          <Animated.View style={[styles.animatedContainer, animatedStyle]}>
            {/* Swipe header */}
            <GestureWrapper
              condition={scrollable}
              gesture={panGestureHideModal}
            >
              <View style={styles.header}>
                <View style={styles.swipeIndicator} />
              </View>
            </GestureWrapper>

            {/* Scrollable content */}
            <View
              style={{
                paddingBottom: safeBottomGap,
              }}
            >
              {typeof children === 'function' ? children() : children}
            </View>
          </Animated.View>
        </GestureWrapper>
      </View>
    </Portal>
  );
}

interface GestureWrapperProps {
  children: React.ReactNode;
  condition: boolean;
  gesture: PanGesture;
}

function GestureWrapper({ children, condition, gesture }: GestureWrapperProps) {
  return condition ? (
    <GestureDetector gesture={gesture}>{children}</GestureDetector>
  ) : (
    <>{children}</>
  );
}
