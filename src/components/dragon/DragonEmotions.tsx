import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

interface DragonEmotionsProps {
  mood: string;
  size?: number;
}

const MOOD_EMOJIS: Record<string, string> = {
  joyful: '💕',
  excited: '✨',
  content: '😊',
  curious: '❓',
  proud: '👑',
  happy: '💕',
  sad: '💧',
  anxious: '😰',
  lonely: '💔',
  sick: '🤒',
  sleepy: '💤',
  sleeping: '💤',
};

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

  const emoji = MOOD_EMOJIS[mood];
  if (!emoji) return null;

  const isSleeping = mood === 'sleepy' || mood === 'sleeping';

  return (
    <View style={[styles.container, { width: size }]} pointerEvents="none">
      <Animated.Text
        style={[
          styles.emoji,
          isSleeping && styles.sleepEmoji,
          floatStyle,
        ]}
        entering={FadeIn}
        exiting={FadeOut}
      >
        {emoji}
      </Animated.Text>
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
