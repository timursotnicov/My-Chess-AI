import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

interface FloatingTextProps {
  text: string;
  color?: string;
  onComplete?: () => void;
}

const FloatingText: React.FC<FloatingTextProps> = ({
  text,
  color = colors.textGold,
  onComplete,
}) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(-60, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withSequence(
      withTiming(1, { duration: 500 }),
      withTiming(0, { duration: 1000 }),
    );

    const timer = setTimeout(() => onComplete?.(), 1500);
    return () => clearTimeout(timer);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[styles.text, { color }, style]}>{text}</Animated.Text>
  );
};

const styles = StyleSheet.create({
  text: {
    position: 'absolute',
    fontFamily: 'MedievalSharp',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default FloatingText;
