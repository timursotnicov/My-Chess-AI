import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
  ZoomIn,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

interface CelebrationOverlayProps {
  visible: boolean;
  type: 'level_up' | 'evolution';
  title: string;
  subtitle?: string;
  onComplete: () => void;
}

const SPARKLE_COUNT = 16;

const Sparkle: React.FC<{ index: number }> = ({ index }) => {
  const angle = (index / SPARKLE_COUNT) * 2 * Math.PI;
  const radius = 80 + Math.random() * 40;
  const targetX = Math.cos(angle) * radius;
  const targetY = Math.sin(angle) * radius;
  const delay = index * 50;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay,
      withSequence(
        withTiming(1, { duration: 300 }),
        withDelay(400, withTiming(0, { duration: 500 })),
      ),
    );
    translateX.value = withDelay(delay,
      withTiming(targetX, { duration: 800, easing: Easing.out(Easing.cubic) }),
    );
    translateY.value = withDelay(delay,
      withTiming(targetY, { duration: 800, easing: Easing.out(Easing.cubic) }),
    );
    scale.value = withDelay(delay,
      withSequence(
        withTiming(1.5, { duration: 300 }),
        withTiming(0, { duration: 500 }),
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: index % 3 === 0 ? '#FFD875' : index % 3 === 1 ? '#C8A84E' : '#FFFFFF',
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return <Animated.View style={style} />;
};

const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  visible,
  type,
  title,
  subtitle,
  onComplete,
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  const isEvolution = type === 'evolution';

  return (
    <Animated.View
      style={styles.overlay}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(500)}
    >
      {/* Sparkle burst */}
      <View style={styles.sparkleCenter}>
        {Array.from({ length: SPARKLE_COUNT }, (_, i) => (
          <Sparkle key={i} index={i} />
        ))}
      </View>

      {/* Glow ring */}
      <Animated.View
        entering={ZoomIn.duration(500)}
        style={[
          styles.glowRing,
          isEvolution && styles.glowRingEvolution,
        ]}
      />

      {/* Title */}
      <Animated.View
        entering={ZoomIn.delay(200).duration(400)}
        style={styles.textContainer}
      >
        <Text style={[styles.icon, isEvolution && styles.iconEvolution]}>
          {isEvolution ? '🐉' : '⭐'}
        </Text>
        <Text style={[styles.title, isEvolution && styles.titleEvolution]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  sparkleCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: colors.gold + '60',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },
  glowRingEvolution: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderColor: colors.arcaneGlow + '80',
    shadowColor: colors.arcaneGlow,
    shadowOpacity: 1,
    shadowRadius: 50,
  },
  textContainer: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  iconEvolution: {
    fontSize: 64,
  },
  title: {
    fontFamily: 'MedievalSharp',
    fontSize: 28,
    color: '#FFD875',
    textShadowColor: colors.gold + '80',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    textAlign: 'center',
  },
  titleEvolution: {
    fontSize: 34,
    color: colors.arcaneGlow,
    textShadowColor: colors.arcaneGlow + '80',
  },
  subtitle: {
    fontFamily: 'Cinzel',
    fontSize: 16,
    color: colors.moonlight,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default CelebrationOverlay;
