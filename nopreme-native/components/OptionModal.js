import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Animated,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Stack from "./Stack";

const DURATION = 150;
const BORDER_RADIUS = 40;

const styles = StyleSheet.create({
  background: {
    height: "100%",
    width: "100%",
    backgroundColor: `rgba(0,0,0,0.5)`,
  },
  container: {
    position: "absolute",
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    paddingTop: 36,
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  option: {
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default function OptionModal({ visible, onDismiss, options }) {
  const [show, setShow] = useState(visible);
  const insets = useSafeAreaInsets();

  const height =
    styles.container.paddingTop +
    options.length *
      (2 * styles.option.paddingVertical + styles.optionText.fontSize) +
    styles.container.paddingBottom +
    insets.bottom;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-height)).current;

  const defaultAnimOpt = {
    useNativeDriver: false,
    duration: DURATION,
  };

  function fadeIn() {
    setShow(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        ...defaultAnimOpt,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        ...defaultAnimOpt,
      }),
    ]).start();
  }

  function fadeOut() {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        ...defaultAnimOpt,
      }),
      Animated.timing(slideAnim, {
        toValue: -height,
        ...defaultAnimOpt,
      }),
    ]).start(() => setShow(false));
  }

  useEffect(() => {
    if (visible) fadeIn();
    else fadeOut();
  }, [visible]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={show}
      onRequestClose={onDismiss}
    >
      <Pressable onPress={onDismiss}>
        <Animated.View
          style={StyleSheet.compose(styles.background, {
            opacity: fadeAnim,
          })}
        />
      </Pressable>
      <Animated.View
        style={StyleSheet.compose(styles.container, {
          paddingBottom: styles.container.paddingBottom + insets.bottom,
          bottom: slideAnim,
        })}
      >
        <Stack style={{ gap: 10 }}>
          {options.map(({ title, onSelect }, idx) => (
            <TouchableOpacity
              key={`option-${idx}`}
              onPress={onSelect}
              style={styles.option}
            >
              <Text style={styles.optionText}>{title}</Text>
            </TouchableOpacity>
          ))}
        </Stack>
      </Animated.View>
    </Modal>
  );
}
