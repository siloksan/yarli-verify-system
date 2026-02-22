import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, SharedValue, withSpring } from 'react-native-reanimated';
import {
  BACKGROUND_OPACITY,
  GESTURE_THRESHOLD,
  SCREEN_HEIGHT,
  SPRING_EFFECT,
} from './modal.constants';

export function getCurrentOpacity(
  maxOpacity: number,
  translateY: number,
  screenHeight: number,
) {
  'worklet';
  const progress = 1 - Math.min(translateY / screenHeight, 1);
  return maxOpacity * progress;
}

interface CreatePanGestureParams {
  translateY: SharedValue<number>;
  backdropOpacity: SharedValue<number>;
  isActiveView: boolean; // return undefined if View is not active for pan gesture(scrollable)
  hideModal: () => void;
}
export function createPanGesture({
  translateY,
  backdropOpacity,
  isActiveView,
  hideModal,
}: CreatePanGestureParams) {
  'worklet';

  if (isActiveView) {
    return Gesture.Pan()
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
  }
}
