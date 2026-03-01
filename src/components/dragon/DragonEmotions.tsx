import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { DragonMood } from '../../types';

interface DragonEmotionsProps {
  mood: DragonMood;
  size?: number;
}

const DragonEmotions: React.FC<DragonEmotionsProps> = ({
  mood,
  size = 200,
}) => {
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1000 }),
        withTiming(0, { duration: 1000 }),
      ),
      -1,
    );
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const renderEmoji = () => {
    switch (mood) {
      case 'happy':
        return (
          <Animated.Text
            style={[styles.emoji, floatStyle]}
            entering={FadeIn}
            exiting={FadeOut}
          >
            {'💕'}
          </Animated.Text>
        );
      case 'sad':
        return (
          <Animated.Text
            style={[styles.emoji, floatStyle]}
            entering={FadeIn}
            exiting={FadeOut}
          >
            {'💧'}
          </Animated.Text>
        );
      case 'sick':
        return (
          <Animated.Text
            style={[styles.emoji, floatStyle]}
            entering={FadeIn}
            exiting={FadeOut}
          >
            {'🤒'}
          </Animated.Text>
        );
      case 'sleeping':
        return (
          <Animated.Text
            style={[styles.emoji, styles.sleepEmoji, floatStyle]}
            entering={FadeIn}
            exiting={FadeOut}
          >
            {'💤'}
          </Animated.Text>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { width: size }]} pointerEvents="none">
      {renderEmoji()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -20,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  sleepEmoji: {
    fontSize: 20,
  },
});

export default DragonEmotions;
