import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface Particle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  size: number;
}

interface ParticleEffectProps {
  x: number;
  y: number;
  count?: number;
  color?: string;
  spread?: number;
  duration?: number;
  onComplete?: () => void;
}

const SingleParticle: React.FC<{ particle: Particle; duration: number }> = ({
  particle,
  duration,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateX.value = withTiming(particle.targetX - particle.x, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
    translateY.value = withTiming(particle.targetY - particle.y, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(0, { duration });
    scale.value = withTiming(0, { duration });
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: particle.x,
    top: particle.y,
    width: particle.size,
    height: particle.size,
    borderRadius: particle.size / 2,
    backgroundColor: particle.color,
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return <Animated.View style={style} />;
};

const ParticleEffect: React.FC<ParticleEffectProps> = ({
  x,
  y,
  count = 8,
  color = '#FFD700',
  spread = 40,
  duration = 800,
  onComplete,
}) => {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x,
      y,
      targetX: x + (Math.random() - 0.5) * spread * 2,
      targetY: y + (Math.random() - 0.5) * spread * 2,
      color,
      size: 3 + Math.random() * 5,
    })),
  );

  useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <SingleParticle key={p.id} particle={p} duration={duration} />
      ))}
    </View>
  );
};

export default ParticleEffect;
