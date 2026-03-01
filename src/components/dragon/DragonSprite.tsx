import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  G,
  Path,
  Circle,
  Ellipse,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  useDerivedValue,
} from 'react-native-reanimated';
import { AnimationState } from './DragonAnimations';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface DragonSpriteProps {
  animation: AnimationState;
  size?: number;
  primaryColor?: string;
  lightColor?: string;
  darkColor?: string;
  bellyColor?: string;
}

const DragonSprite: React.FC<DragonSpriteProps> = ({
  animation,
  size = 200,
  primaryColor = '#7B2D8E',
  lightColor = '#9B4DCA',
  darkColor = '#5C1D6E',
  bellyColor = '#D4A0E8',
}) => {
  // Animation values
  const breathe = useSharedValue(0);
  const blink = useSharedValue(0);
  const tailWag = useSharedValue(0);
  const wingFlap = useSharedValue(0);
  const bounce = useSharedValue(0);
  const headBob = useSharedValue(0);
  const mouthOpen = useSharedValue(0);

  useEffect(() => {
    // Breathing animation — continuous
    breathe.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );

    // Blinking — periodic
    blink.value = withRepeat(
      withSequence(
        withDelay(
          3000 + Math.random() * 2000,
          withTiming(1, { duration: 100 }),
        ),
        withTiming(0, { duration: 100 }),
      ),
      -1,
    );

    // Tail wagging
    tailWag.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  useEffect(() => {
    switch (animation) {
      case 'idle':
        wingFlap.value = withRepeat(
          withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
          -1,
          true,
        );
        bounce.value = 0;
        mouthOpen.value = 0;
        break;

      case 'eating':
        mouthOpen.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 200 }),
            withTiming(0, { duration: 200 }),
          ),
          5,
        );
        break;

      case 'drinking':
        headBob.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 400 }),
            withTiming(0, { duration: 400 }),
          ),
          3,
        );
        break;

      case 'playing':
      case 'happy':
        bounce.value = withRepeat(
          withSequence(
            withTiming(-15, { duration: 300 }),
            withTiming(0, { duration: 300 }),
          ),
          4,
        );
        wingFlap.value = withRepeat(
          withTiming(1, { duration: 500 }),
          -1,
          true,
        );
        break;

      case 'training':
        bounce.value = withRepeat(
          withSequence(
            withTiming(-5, { duration: 200 }),
            withTiming(5, { duration: 200 }),
          ),
          6,
        );
        break;

      case 'flying':
        wingFlap.value = withRepeat(
          withTiming(1, { duration: 300 }),
          -1,
          true,
        );
        bounce.value = withRepeat(
          withTiming(-20, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
          -1,
          true,
        );
        break;

      case 'sleeping':
        breathe.value = withRepeat(
          withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
          -1,
          true,
        );
        blink.value = 1; // eyes closed
        wingFlap.value = 0;
        break;

      case 'sad':
        wingFlap.value = 0;
        headBob.value = withRepeat(
          withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          -1,
          true,
        );
        break;

      case 'sick':
        breathe.value = withRepeat(
          withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
          -1,
          true,
        );
        wingFlap.value = 0;
        break;
    }
  }, [animation]);

  // Derived animated values
  const bodyY = useDerivedValue(() =>
    interpolate(breathe.value, [0, 1], [0, -3]),
  );

  const tailRotation = useDerivedValue(() =>
    interpolate(tailWag.value, [0, 1], [-10, 10]),
  );

  const wingRotation = useDerivedValue(() =>
    interpolate(wingFlap.value, [0, 1], [0, -30]),
  );

  const eyeScaleY = useDerivedValue(() =>
    interpolate(blink.value, [0, 1], [1, 0.1]),
  );

  const mouthScale = useDerivedValue(() =>
    interpolate(mouthOpen.value, [0, 1], [0.3, 1]),
  );

  // Animated props for body group
  const bodyProps = useAnimatedProps(() => ({
    transform: [{ translateY: bodyY.value + bounce.value }],
  }));

  // Animated props for tail
  const tailProps = useAnimatedProps(() => ({
    transform: [
      { translateX: 30 },
      { translateY: 120 },
      { rotate: `${tailRotation.value}deg` },
      { translateX: -30 },
      { translateY: -120 },
    ],
  }));

  // Animated props for left wing
  const leftWingProps = useAnimatedProps(() => ({
    transform: [
      { translateX: 45 },
      { translateY: 70 },
      { rotate: `${wingRotation.value}deg` },
      { translateX: -45 },
      { translateY: -70 },
    ],
  }));

  // Animated props for right wing
  const rightWingProps = useAnimatedProps(() => ({
    transform: [
      { translateX: 155 },
      { translateY: 70 },
      { rotate: `${-wingRotation.value}deg` },
      { translateX: -155 },
      { translateY: -70 },
    ],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        {/* Body group with breathing animation */}
        <AnimatedG animatedProps={bodyProps}>
          {/* Tail */}
          <AnimatedG animatedProps={tailProps}>
            <Path
              d="M 85 130 Q 50 150, 30 170 Q 20 180, 25 175 Q 35 165, 40 160"
              stroke={darkColor}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Tail spade */}
            <Path
              d="M 25 175 L 15 168 L 22 180 L 15 185 L 25 178"
              fill={primaryColor}
            />
          </AnimatedG>

          {/* Left wing */}
          <AnimatedG animatedProps={leftWingProps}>
            <Path
              d="M 65 75 Q 30 40, 15 60 Q 25 50, 35 65 Q 20 45, 10 70 Q 25 60, 45 80"
              fill={lightColor}
              opacity={0.8}
            />
            <Path
              d="M 65 75 Q 30 40, 15 60 Q 25 50, 35 65"
              stroke={primaryColor}
              strokeWidth="1.5"
              fill="none"
            />
          </AnimatedG>

          {/* Right wing */}
          <AnimatedG animatedProps={rightWingProps}>
            <Path
              d="M 135 75 Q 170 40, 185 60 Q 175 50, 165 65 Q 180 45, 190 70 Q 175 60, 155 80"
              fill={lightColor}
              opacity={0.8}
            />
            <Path
              d="M 135 75 Q 170 40, 185 60 Q 175 50, 165 65"
              stroke={primaryColor}
              strokeWidth="1.5"
              fill="none"
            />
          </AnimatedG>

          {/* Body */}
          <Ellipse
            cx="100"
            cy="110"
            rx="35"
            ry="40"
            fill={primaryColor}
          />
          {/* Belly */}
          <Ellipse
            cx="100"
            cy="115"
            rx="22"
            ry="28"
            fill={bellyColor}
          />

          {/* Left leg */}
          <Path
            d="M 78 140 L 72 160 L 65 160 L 75 160 L 80 160 L 82 140"
            fill={darkColor}
          />
          {/* Right leg */}
          <Path
            d="M 118 140 L 120 160 L 115 160 L 125 160 L 130 160 L 122 140"
            fill={darkColor}
          />

          {/* Left arm */}
          <Path
            d="M 70 100 L 58 110 L 55 108 L 58 112 L 56 115 L 62 110 L 72 102"
            fill={primaryColor}
          />
          {/* Right arm */}
          <Path
            d="M 130 100 L 142 110 L 145 108 L 142 112 L 144 115 L 138 110 L 128 102"
            fill={primaryColor}
          />

          {/* Head */}
          <Ellipse cx="100" cy="65" rx="28" ry="25" fill={primaryColor} />

          {/* Snout */}
          <Ellipse cx="100" cy="78" rx="15" ry="10" fill={lightColor} />

          {/* Nostrils */}
          <Circle cx="94" cy="78" r="2" fill={darkColor} />
          <Circle cx="106" cy="78" r="2" fill={darkColor} />

          {/* Eyes — left */}
          <Ellipse
            cx="88"
            cy="60"
            rx="6"
            ry="7"
            fill="white"
          />
          <Circle cx="89" cy="60" r="3.5" fill="#1A1A2E" />
          <Circle cx="90" cy="59" r="1.2" fill="white" />

          {/* Eyes — right */}
          <Ellipse
            cx="112"
            cy="60"
            rx="6"
            ry="7"
            fill="white"
          />
          <Circle cx="113" cy="60" r="3.5" fill="#1A1A2E" />
          <Circle cx="114" cy="59" r="1.2" fill="white" />

          {/* Horns */}
          <Path
            d="M 80 48 L 72 30 L 82 45"
            fill={darkColor}
          />
          <Path
            d="M 120 48 L 128 30 L 118 45"
            fill={darkColor}
          />

          {/* Mouth (smile) */}
          <Path
            d="M 92 82 Q 100 88, 108 82"
            stroke={darkColor}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Small spikes down the back */}
          <Path
            d="M 95 42 L 100 35 L 105 42"
            fill={lightColor}
          />
          <Path
            d="M 95 90 L 100 83 L 105 90"
            fill={lightColor}
          />
        </AnimatedG>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DragonSprite;
