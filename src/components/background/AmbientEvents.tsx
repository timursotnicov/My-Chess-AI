import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { AmbientEventType } from '../../data/backgrounds';

const { width, height } = Dimensions.get('window');

interface AmbientEventsProps {
  events: AmbientEventType[];
}

interface CloudData {
  id: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface BirdData {
  id: number;
  y: number;
  speed: number;
}

const Cloud: React.FC<{ data: CloudData }> = ({ data }) => {
  const translateX = useSharedValue(-100);

  useEffect(() => {
    translateX.value = -100;
    translateX.value = withRepeat(
      withTiming(width + 100, {
        duration: data.speed,
        easing: Easing.linear,
      }),
      -1,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[{ position: 'absolute', top: data.y }, style]}>
      <Svg width={data.size * 2} height={data.size} viewBox="0 0 100 50">
        <Ellipse
          cx="50"
          cy="35"
          rx="45"
          ry="15"
          fill="white"
          opacity={data.opacity}
        />
        <Circle cx="35" cy="25" r="18" fill="white" opacity={data.opacity} />
        <Circle cx="55" cy="20" r="22" fill="white" opacity={data.opacity} />
        <Circle cx="70" cy="28" r="15" fill="white" opacity={data.opacity} />
      </Svg>
    </Animated.View>
  );
};

const Bird: React.FC<{ data: BirdData }> = ({ data }) => {
  const translateX = useSharedValue(width + 50);
  const flapY = useSharedValue(0);

  useEffect(() => {
    translateX.value = width + 50;
    translateX.value = withTiming(-50, {
      duration: data.speed,
      easing: Easing.linear,
    });

    flapY.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 300 }),
        withTiming(3, { duration: 300 }),
      ),
      -1,
      true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: flapY.value },
    ],
  }));

  return (
    <Animated.View style={[{ position: 'absolute', top: data.y }, style]}>
      <Svg width={20} height={10} viewBox="0 0 20 10">
        <Path
          d="M 0 5 Q 5 0, 10 5 Q 15 0, 20 5"
          stroke="#333"
          strokeWidth="1.5"
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
};

const Firefly: React.FC<{ x: number; y: number; delay: number }> = ({
  x,
  y,
  delay,
}) => {
  const opacity = useSharedValue(0);
  const posY = useSharedValue(y);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: delay }),
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 1000 }),
      ),
      -1,
    );
    posY.value = withRepeat(
      withTiming(y - 20, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: x,
    top: posY.value,
    opacity: opacity.value,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  }));

  return <Animated.View style={style} />;
};

const AmbientEvents: React.FC<AmbientEventsProps> = ({ events }) => {
  const [clouds] = useState<CloudData[]>(() => {
    if (!events.includes('clouds')) return [];
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      y: 30 + Math.random() * 80,
      size: 40 + Math.random() * 30,
      speed: 30000 + Math.random() * 20000,
      opacity: 0.3 + Math.random() * 0.4,
    }));
  });

  const [birds, setBirds] = useState<BirdData[]>([]);
  const [birdCounter, setBirdCounter] = useState(0);

  useEffect(() => {
    if (!events.includes('birds')) return;

    const interval = setInterval(() => {
      setBirdCounter((c) => c + 1);
      setBirds((prev) => [
        ...prev.slice(-3), // keep max 4 birds
        {
          id: Date.now(),
          y: 40 + Math.random() * 100,
          speed: 6000 + Math.random() * 4000,
        },
      ]);
    }, 15000 + Math.random() * 30000);

    return () => clearInterval(interval);
  }, [events]);

  const fireflies = events.includes('fireflies')
    ? Array.from({ length: 6 }, (_, i) => ({
        x: 30 + Math.random() * (width - 60),
        y: height * 0.4 + Math.random() * (height * 0.3),
        delay: Math.random() * 3000,
      }))
    : [];

  return (
    <View style={styles.container} pointerEvents="none">
      {clouds.map((cloud) => (
        <Cloud key={cloud.id} data={cloud} />
      ))}
      {birds.map((bird) => (
        <Bird key={bird.id} data={bird} />
      ))}
      {fireflies.map((f, i) => (
        <Firefly key={i} x={f.x} y={f.y} delay={f.delay} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default AmbientEvents;
