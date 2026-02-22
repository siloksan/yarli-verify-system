import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ModalContent } from './modal.type';
import {
  runOnJS,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  BACKGROUND_OPACITY,
  OPACITY_DURATION,
  SCREEN_HEIGHT,
  SPRING_EFFECT,
} from './modal.constants';
import { BackHandler } from 'react-native';
import { ModalView } from './modal.view';
import { ModalContext } from './modal.context';

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalContent, setModalContent] = useState<ModalContent>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const [backDropIsActive, setBackDropIsActive] = useState(false);

  // Reanimated shared value for vertical translation
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(BACKGROUND_OPACITY);

  const showModal = useCallback(
    (modal: ModalContent, isScrollable = false) => {
      setScrollable(isScrollable);
      setBackDropIsActive(true);
      setModalContent(modal);
      setIsMounted(true);
      requestAnimationFrame(() => {
        translateY.value = withSpring(0, SPRING_EFFECT);
        backdropOpacity.value = withTiming(
          BACKGROUND_OPACITY,
          OPACITY_DURATION,
        );
      });
    },
    [translateY, backdropOpacity],
  );

  const hideModal = useCallback(() => {
    setBackDropIsActive(false);
    translateY.value = withSpring(SCREEN_HEIGHT, SPRING_EFFECT, (finished) => {
      if (finished) {
        runOnJS(setIsMounted)(false);
        runOnJS(setModalContent)(null);
      }
    });
    backdropOpacity.value = withTiming(0, OPACITY_DURATION);
  }, [translateY, backdropOpacity]);

  const value = useMemo(
    () => ({ showModal, hideModal, isMounted }),
    [showModal, hideModal, isMounted],
  );

  useEffect(() => {
    if (isMounted) {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          hideModal();
          return true;
        },
      );
      return () => subscription.remove();
    }
  }, [isMounted, hideModal]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      {isMounted && (
        <ModalView
          scrollable={scrollable}
          translateY={translateY}
          backdropOpacity={backdropOpacity}
          backDropIsActive={backDropIsActive}
        >
          {modalContent}
        </ModalView>
      )}
    </ModalContext.Provider>
  );
}
