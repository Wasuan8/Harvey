import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withDelay,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import COLORS from '../constants/Colors';
import useTheme from '../constants/ThemeColor';

const ToastAlert = forwardRef(({}, ref) => {
  const theme = useTheme()
  const toastTopAnimation = useSharedValue(-100);
  const [showing, setshowing] = useState(false);
  const [toastType, setToastType] = useState('');
  const [toastDuration, setToastDuration] = useState(0);
  const [toastText, setToastText] = useState('');
  const TOP_VALUE = Platform.OS === 'ios' ? 20 : 10;

  const show = useCallback(
    ({ type, text, duration }) => {
      setshowing(true);
      setToastType(type);
      setToastText(text);
      setToastDuration(duration);

      toastTopAnimation.value = withSequence(
        withTiming(TOP_VALUE, { duration: 300 }),
        withDelay(
          duration,
          withTiming(-100, { duration: 300 }, (finished) => {
            if (finished) {
              runOnJS(setshowing)(false);
            }
          })
        )
      );
    },
    [TOP_VALUE, toastTopAnimation]
  );

  useImperativeHandle(ref, () => ({ show }), [show]);

  const animatedTopStyles = useAnimatedStyle(() => {
    return {
      top: toastTopAnimation.value,
    };
  });

  // Get colors based on toast type
  const getToastColors = () => {
    switch (toastType) {
      case 'success':
        return {
          backgroundColor: theme.background, // Light background for success
          borderColor: theme.button, // Button color for border
          textColor: theme.button, // Button color for text
          icon: 'https://cdn-icons-png.flaticon.com/256/3032/3032885.png', // Success icon
        };
      case 'warning':
        return {
          backgroundColor: theme.background, // Light background for warning
          borderColor: theme.smallBtn, // Small button color for border
          textColor: theme.smallBtn, // Small button color for text
          icon: 'https://cdn-icons-png.flaticon.com/128/564/564619.png', // Warning icon
        };
      case 'error':
        return {
          backgroundColor: theme.background, // Light background for error
          borderColor: theme.Active, // Active color for border
          textColor: theme.Active, // Active color for text
          icon: 'https://cdn-icons-png.flaticon.com/256/190/190406.png', // Error icon
        };
      default:
        return {
          backgroundColor: theme.background,
          borderColor: theme.primary,
          textColor: theme.primary,
          icon: '',
        };
    }
  };

  const toastColors = getToastColors();

  return (
    <>
      {showing && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              backgroundColor: toastColors.backgroundColor,
              borderColor: toastColors.borderColor,
            },
            animatedTopStyles,
          ]}
        >
          <Image
            source={{ uri: toastColors.icon }}
            style={styles.toastIcon}
          />

          <Text
            style={[
              styles.toastText,
              { color: toastColors.textColor },
            ]}
          >
            {toastText}
          </Text>
        </Animated.View>
      )}
    </>
  );
});

export default ToastAlert;

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    width: '90%',
    padding: 10,
    zIndex: 1,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  toastText: {
    marginLeft: 14,
    fontSize: 16,
    fontWeight: '600',
  },
  toastIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});