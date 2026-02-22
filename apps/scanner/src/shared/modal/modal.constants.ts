import { Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BACKGROUND_OPACITY = 0.8;
const MAX_MODAL_HEIGHT = SCREEN_HEIGHT * 0.8;
const SPRING_EFFECT = { damping: 40, stiffness: 200 };
const GESTURE_THRESHOLD = 80;
const OPACITY_DURATION = { duration: 200 };

export {
  BACKGROUND_OPACITY,
  MAX_MODAL_HEIGHT,
  SPRING_EFFECT,
  GESTURE_THRESHOLD,
  OPACITY_DURATION,
  SCREEN_HEIGHT,
};
