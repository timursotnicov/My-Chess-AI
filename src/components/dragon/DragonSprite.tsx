import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  G,
  Path,
  Circle,
  Ellipse,
  Defs,
  RadialGradient,
  Stop,
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
import { DragonStage } from '../../types';

const AnimatedG = Animated.createAnimatedComponent(G);

// Stage-specific color palettes
const STAGE_COLORS: Record<string, {
  primary: string;
  light: string;
  dark: string;
  belly: string;
  eye: string;
  glow?: string;
}> = {
  egg:       { primary: '#6B1D7E', light: '#8B3DAE', dark: '#4A0D5E', belly: '#C080D8', eye: '#1A1A2E' },
  baby:      { primary: '#A855C8', light: '#C080E0', dark: '#7B2D8E', belly: '#E8C8F4', eye: '#2A1A3E' },
  young:     { primary: '#8B3DAE', light: '#A860C8', dark: '#6B1D7E', belly: '#D4A0E8', eye: '#1A1A2E' },
  juvenile:  { primary: '#7B2D8E', light: '#9B4DCA', dark: '#5C1D6E', belly: '#D4A0E8', eye: '#1A1A2E' },
  teen:      { primary: '#6B1D7E', light: '#8B3DAE', dark: '#4A0D5E', belly: '#C890D8', eye: '#1A1A2E' },
  adult:     { primary: '#5C1070', light: '#7B2D8E', dark: '#3A0850', belly: '#B880C8', eye: '#1A0A2E' },
  legendary: { primary: '#4A0D60', light: '#6B1D7E', dark: '#2A0540', belly: '#A870B8', eye: '#0A0A1E', glow: '#C8A84E' },
};

interface DragonSpriteProps {
  animation: AnimationState;
  size?: number;
  stage?: DragonStage;
}

const DragonSprite: React.FC<DragonSpriteProps> = ({
  animation,
  size = 200,
  stage = 'adult',
}) => {
  const colors = STAGE_COLORS[stage] ?? STAGE_COLORS.adult;

  // Animation shared values
  const breathe = useSharedValue(0);
  const blink = useSharedValue(0);
  const tailWag = useSharedValue(0);
  const wingFlap = useSharedValue(0);
  const bounce = useSharedValue(0);
  const headBob = useSharedValue(0);
  const mouthOpen = useSharedValue(0);

  useEffect(() => {
    breathe.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1, true,
    );
    blink.value = withRepeat(
      withSequence(
        withDelay(3000 + Math.random() * 2000, withTiming(1, { duration: 100 })),
        withTiming(0, { duration: 100 }),
      ),
      -1,
    );
    tailWag.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      -1, true,
    );
  }, []);

  useEffect(() => {
    switch (animation) {
      case 'idle':
        wingFlap.value = withRepeat(
          withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
          -1, true,
        );
        bounce.value = 0;
        mouthOpen.value = 0;
        break;
      case 'eating':
        mouthOpen.value = withRepeat(
          withSequence(withTiming(1, { duration: 200 }), withTiming(0, { duration: 200 })),
          5,
        );
        break;
      case 'drinking':
        headBob.value = withRepeat(
          withSequence(withTiming(1, { duration: 400 }), withTiming(0, { duration: 400 })),
          3,
        );
        break;
      case 'playing':
      case 'happy':
        bounce.value = withRepeat(
          withSequence(withTiming(-15, { duration: 300 }), withTiming(0, { duration: 300 })),
          4,
        );
        wingFlap.value = withRepeat(withTiming(1, { duration: 500 }), -1, true);
        break;
      case 'training':
        bounce.value = withRepeat(
          withSequence(withTiming(-5, { duration: 200 }), withTiming(5, { duration: 200 })),
          6,
        );
        break;
      case 'flying':
        wingFlap.value = withRepeat(withTiming(1, { duration: 300 }), -1, true);
        bounce.value = withRepeat(
          withTiming(-20, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
          -1, true,
        );
        break;
      case 'sleeping':
        breathe.value = withRepeat(
          withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
          -1, true,
        );
        blink.value = 1;
        wingFlap.value = 0;
        break;
      case 'sad':
        wingFlap.value = 0;
        headBob.value = withRepeat(
          withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          -1, true,
        );
        break;
      case 'sick':
        breathe.value = withRepeat(
          withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
          -1, true,
        );
        wingFlap.value = 0;
        break;
    }
  }, [animation]);

  const bodyY = useDerivedValue(() => interpolate(breathe.value, [0, 1], [0, -3]));
  const tailRotation = useDerivedValue(() => interpolate(tailWag.value, [0, 1], [-10, 10]));
  const wingRotation = useDerivedValue(() => interpolate(wingFlap.value, [0, 1], [0, -30]));

  const bodyProps = useAnimatedProps(() => ({
    transform: [{ translateY: bodyY.value + bounce.value }],
  }));
  const tailProps = useAnimatedProps(() => ({
    transform: [
      { translateX: 30 }, { translateY: 120 },
      { rotate: `${tailRotation.value}deg` },
      { translateX: -30 }, { translateY: -120 },
    ],
  }));
  const leftWingProps = useAnimatedProps(() => ({
    transform: [
      { translateX: 45 }, { translateY: 70 },
      { rotate: `${wingRotation.value}deg` },
      { translateX: -45 }, { translateY: -70 },
    ],
  }));
  const rightWingProps = useAnimatedProps(() => ({
    transform: [
      { translateX: 155 }, { translateY: 70 },
      { rotate: `${-wingRotation.value}deg` },
      { translateX: -155 }, { translateY: -70 },
    ],
  }));

  const renderBabyDragon = () => (
    <>
      {/* Tiny tail */}
      <Path
        d="M 90 130 Q 75 140, 70 145 Q 68 147, 72 144"
        stroke={colors.dark}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Round chubby body */}
      <Ellipse cx="100" cy="115" rx="30" ry="32" fill={colors.primary} />
      <Ellipse cx="100" cy="120" rx="20" ry="22" fill={colors.belly} />
      {/* Tiny stubby legs */}
      <Ellipse cx="82" cy="145" rx="8" ry="6" fill={colors.dark} />
      <Ellipse cx="118" cy="145" rx="8" ry="6" fill={colors.dark} />
      {/* Big round head */}
      <Ellipse cx="100" cy="75" rx="30" ry="28" fill={colors.primary} />
      <Ellipse cx="100" cy="85" rx="14" ry="10" fill={colors.light} />
      {/* Big cute eyes */}
      <Ellipse cx="86" cy="68" rx="9" ry="10" fill="white" />
      <Circle cx="88" cy="68" r="5" fill={colors.eye} />
      <Circle cx="90" cy="66" r="2" fill="white" />
      <Ellipse cx="114" cy="68" rx="9" ry="10" fill="white" />
      <Circle cx="116" cy="68" r="5" fill={colors.eye} />
      <Circle cx="118" cy="66" r="2" fill="white" />
      {/* Tiny nostrils */}
      <Circle cx="95" cy="85" r="1.5" fill={colors.dark} />
      <Circle cx="105" cy="85" r="1.5" fill={colors.dark} />
      {/* Cute smile */}
      <Path d="M 93 89 Q 100 94, 107 89" stroke={colors.dark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Tiny horn bumps */}
      <Ellipse cx="82" cy="52" rx="4" ry="5" fill={colors.light} />
      <Ellipse cx="118" cy="52" rx="4" ry="5" fill={colors.light} />
      {/* Blush marks */}
      <Ellipse cx="76" cy="78" rx="6" ry="3" fill="#FF9999" opacity={0.3} />
      <Ellipse cx="124" cy="78" rx="6" ry="3" fill="#FF9999" opacity={0.3} />
    </>
  );

  const renderYoungDragon = () => (
    <>
      {/* Short tail */}
      <Path
        d="M 87 130 Q 65 145, 55 155 Q 50 158, 55 155"
        stroke={colors.dark}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Small wing buds */}
      <Path d="M 70 85 Q 55 70, 45 80 Q 52 72, 58 82" fill={colors.light} opacity={0.7} />
      <Path d="M 130 85 Q 145 70, 155 80 Q 148 72, 142 82" fill={colors.light} opacity={0.7} />
      {/* Rounder body */}
      <Ellipse cx="100" cy="112" rx="32" ry="36" fill={colors.primary} />
      <Ellipse cx="100" cy="117" rx="20" ry="25" fill={colors.belly} />
      {/* Small legs */}
      <Path d="M 78 140 L 74 155 L 68 155 L 78 155 L 82 140" fill={colors.dark} />
      <Path d="M 118 140 L 122 155 L 128 155 L 118 155 L 114 140" fill={colors.dark} />
      {/* Slightly smaller head */}
      <Ellipse cx="100" cy="70" rx="28" ry="26" fill={colors.primary} />
      <Ellipse cx="100" cy="80" rx="14" ry="9" fill={colors.light} />
      {/* Eyes - still big */}
      <Ellipse cx="87" cy="63" rx="8" ry="9" fill="white" />
      <Circle cx="89" cy="63" r="4.5" fill={colors.eye} />
      <Circle cx="90" cy="61" r="1.5" fill="white" />
      <Ellipse cx="113" cy="63" rx="8" ry="9" fill="white" />
      <Circle cx="115" cy="63" r="4.5" fill={colors.eye} />
      <Circle cx="116" cy="61" r="1.5" fill="white" />
      {/* Nostrils */}
      <Circle cx="95" cy="80" r="1.5" fill={colors.dark} />
      <Circle cx="105" cy="80" r="1.5" fill={colors.dark} />
      {/* Mouth */}
      <Path d="M 93 84 Q 100 89, 107 84" stroke={colors.dark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Small horns */}
      <Path d="M 80 50 L 76 38 L 83 48" fill={colors.dark} />
      <Path d="M 120 50 L 124 38 L 117 48" fill={colors.dark} />
      {/* One small spike */}
      <Path d="M 97 44 L 100 37 L 103 44" fill={colors.light} />
    </>
  );

  const renderJuvenileDragon = () => (
    <>
      {/* Tail with small spade */}
      <AnimatedG animatedProps={tailProps}>
        <Path
          d="M 85 130 Q 58 148, 40 162 Q 32 168, 38 164"
          stroke={colors.dark}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        <Path d="M 35 166 L 28 160 L 34 170 L 28 174 L 36 168" fill={colors.primary} />
      </AnimatedG>
      {/* Growing wings */}
      <AnimatedG animatedProps={leftWingProps}>
        <Path d="M 68 78 Q 40 50, 25 65 Q 35 55, 42 68 Q 30 52, 20 72 Q 35 62, 50 80" fill={colors.light} opacity={0.8} />
        <Path d="M 68 78 Q 40 50, 25 65" stroke={colors.primary} strokeWidth="1.5" fill="none" />
      </AnimatedG>
      <AnimatedG animatedProps={rightWingProps}>
        <Path d="M 132 78 Q 160 50, 175 65 Q 165 55, 158 68 Q 170 52, 180 72 Q 165 62, 150 80" fill={colors.light} opacity={0.8} />
        <Path d="M 132 78 Q 160 50, 175 65" stroke={colors.primary} strokeWidth="1.5" fill="none" />
      </AnimatedG>
      {/* Body */}
      <Ellipse cx="100" cy="110" rx="34" ry="38" fill={colors.primary} />
      <Ellipse cx="100" cy="115" rx="21" ry="27" fill={colors.belly} />
      {/* Legs */}
      <Path d="M 77 140 L 72 158 L 65 158 L 75 158 L 80 158 L 82 140" fill={colors.dark} />
      <Path d="M 118 140 L 120 158 L 115 158 L 125 158 L 130 158 L 122 140" fill={colors.dark} />
      {/* Arms */}
      <Path d="M 70 100 L 60 108 L 57 106 L 60 110 L 64 108 L 72 102" fill={colors.primary} />
      <Path d="M 130 100 L 140 108 L 143 106 L 140 110 L 136 108 L 128 102" fill={colors.primary} />
      {/* Head */}
      <Ellipse cx="100" cy="67" rx="27" ry="24" fill={colors.primary} />
      <Ellipse cx="100" cy="78" rx="14" ry="9" fill={colors.light} />
      {/* Eyes */}
      <Ellipse cx="88" cy="62" rx="7" ry="8" fill="white" />
      <Circle cx="89" cy="62" r="4" fill={colors.eye} />
      <Circle cx="90" cy="60" r="1.3" fill="white" />
      <Ellipse cx="112" cy="62" rx="7" ry="8" fill="white" />
      <Circle cx="113" cy="62" r="4" fill={colors.eye} />
      <Circle cx="114" cy="60" r="1.3" fill="white" />
      {/* Nostrils */}
      <Circle cx="95" cy="78" r="2" fill={colors.dark} />
      <Circle cx="105" cy="78" r="2" fill={colors.dark} />
      {/* Mouth */}
      <Path d="M 93 82 Q 100 87, 107 82" stroke={colors.dark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Horns */}
      <Path d="M 80 48 L 74 32 L 82 45" fill={colors.dark} />
      <Path d="M 120 48 L 126 32 L 118 45" fill={colors.dark} />
      {/* 2 back spikes */}
      <Path d="M 96 43 L 100 35 L 104 43" fill={colors.light} />
      <Path d="M 96 88 L 100 82 L 104 88" fill={colors.light} />
    </>
  );

  const renderTeenDragon = () => (
    <>
      {/* Longer tail */}
      <AnimatedG animatedProps={tailProps}>
        <Path
          d="M 85 130 Q 52 150, 32 168 Q 22 178, 27 173 Q 35 163, 40 158"
          stroke={colors.dark}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        <Path d="M 25 175 L 15 168 L 22 178 L 15 183 L 25 176" fill={colors.primary} />
      </AnimatedG>
      {/* Larger wings */}
      <AnimatedG animatedProps={leftWingProps}>
        <Path d="M 65 75 Q 32 42, 15 58 Q 25 48, 35 63 Q 22 46, 10 68 Q 25 58, 45 78" fill={colors.light} opacity={0.8} />
        <Path d="M 65 75 Q 32 42, 15 58 Q 25 48, 35 63" stroke={colors.primary} strokeWidth="1.5" fill="none" />
      </AnimatedG>
      <AnimatedG animatedProps={rightWingProps}>
        <Path d="M 135 75 Q 168 42, 185 58 Q 175 48, 165 63 Q 178 46, 190 68 Q 175 58, 155 78" fill={colors.light} opacity={0.8} />
        <Path d="M 135 75 Q 168 42, 185 58 Q 175 48, 165 63" stroke={colors.primary} strokeWidth="1.5" fill="none" />
      </AnimatedG>
      {/* Leaner body */}
      <Ellipse cx="100" cy="110" rx="35" ry="40" fill={colors.primary} />
      <Ellipse cx="100" cy="115" rx="22" ry="28" fill={colors.belly} />
      {/* Legs with claws */}
      <Path d="M 77 140 L 72 160 L 64 160 L 68 158 L 75 160 L 80 160 L 82 140" fill={colors.dark} />
      <Path d="M 118 140 L 120 160 L 130 160 L 126 158 L 120 160 L 115 160 L 122 140" fill={colors.dark} />
      {/* Arms with claws */}
      <Path d="M 70 100 L 58 110 L 54 108 L 58 112 L 55 114 L 62 110 L 72 102" fill={colors.primary} />
      <Path d="M 130 100 L 142 110 L 146 108 L 142 112 L 145 114 L 138 110 L 128 102" fill={colors.primary} />
      {/* Head */}
      <Ellipse cx="100" cy="65" rx="28" ry="25" fill={colors.primary} />
      <Ellipse cx="100" cy="78" rx="15" ry="10" fill={colors.light} />
      {/* Eyes — more angular */}
      <Ellipse cx="88" cy="60" rx="6" ry="7" fill="white" />
      <Circle cx="89" cy="60" r="3.5" fill={colors.eye} />
      <Circle cx="90" cy="59" r="1.2" fill="white" />
      <Ellipse cx="112" cy="60" rx="6" ry="7" fill="white" />
      <Circle cx="113" cy="60" r="3.5" fill={colors.eye} />
      <Circle cx="114" cy="59" r="1.2" fill="white" />
      {/* Nostrils */}
      <Circle cx="94" cy="78" r="2" fill={colors.dark} />
      <Circle cx="106" cy="78" r="2" fill={colors.dark} />
      {/* Slight snarl */}
      <Path d="M 92 82 Q 100 87, 108 82" stroke={colors.dark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Sharper horns */}
      <Path d="M 80 48 L 72 28 L 82 44" fill={colors.dark} />
      <Path d="M 120 48 L 128 28 L 118 44" fill={colors.dark} />
      {/* 3 back spikes */}
      <Path d="M 95 42 L 100 33 L 105 42" fill={colors.light} />
      <Path d="M 95 88 L 100 80 L 105 88" fill={colors.light} />
      <Path d="M 93 66 L 100 58 L 107 66" fill={colors.light} opacity={0.5} />
    </>
  );

  const renderAdultDragon = () => (
    <>
      {/* Full tail */}
      <AnimatedG animatedProps={tailProps}>
        <Path
          d="M 85 130 Q 50 150, 30 170 Q 20 180, 25 175 Q 35 165, 40 160"
          stroke={colors.dark}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        <Path d="M 25 175 L 15 168 L 22 180 L 15 185 L 25 178" fill={colors.primary} />
      </AnimatedG>
      {/* Full wings */}
      <AnimatedG animatedProps={leftWingProps}>
        <Path d="M 65 75 Q 30 40, 15 60 Q 25 50, 35 65 Q 20 45, 10 70 Q 25 60, 45 80" fill={colors.light} opacity={0.8} />
        <Path d="M 65 75 Q 30 40, 15 60 Q 25 50, 35 65" stroke={colors.primary} strokeWidth="1.5" fill="none" />
      </AnimatedG>
      <AnimatedG animatedProps={rightWingProps}>
        <Path d="M 135 75 Q 170 40, 185 60 Q 175 50, 165 65 Q 180 45, 190 70 Q 175 60, 155 80" fill={colors.light} opacity={0.8} />
        <Path d="M 135 75 Q 170 40, 185 60 Q 175 50, 165 65" stroke={colors.primary} strokeWidth="1.5" fill="none" />
      </AnimatedG>
      {/* Body */}
      <Ellipse cx="100" cy="110" rx="35" ry="40" fill={colors.primary} />
      <Ellipse cx="100" cy="115" rx="22" ry="28" fill={colors.belly} />
      {/* Legs */}
      <Path d="M 78 140 L 72 160 L 65 160 L 75 160 L 80 160 L 82 140" fill={colors.dark} />
      <Path d="M 118 140 L 120 160 L 115 160 L 125 160 L 130 160 L 122 140" fill={colors.dark} />
      {/* Arms */}
      <Path d="M 70 100 L 58 110 L 55 108 L 58 112 L 56 115 L 62 110 L 72 102" fill={colors.primary} />
      <Path d="M 130 100 L 142 110 L 145 108 L 142 112 L 144 115 L 138 110 L 128 102" fill={colors.primary} />
      {/* Head */}
      <Ellipse cx="100" cy="65" rx="28" ry="25" fill={colors.primary} />
      <Ellipse cx="100" cy="78" rx="15" ry="10" fill={colors.light} />
      {/* Nostrils */}
      <Circle cx="94" cy="78" r="2" fill={colors.dark} />
      <Circle cx="106" cy="78" r="2" fill={colors.dark} />
      {/* Eyes */}
      <Ellipse cx="88" cy="60" rx="6" ry="7" fill="white" />
      <Circle cx="89" cy="60" r="3.5" fill={colors.eye} />
      <Circle cx="90" cy="59" r="1.2" fill="white" />
      <Ellipse cx="112" cy="60" rx="6" ry="7" fill="white" />
      <Circle cx="113" cy="60" r="3.5" fill={colors.eye} />
      <Circle cx="114" cy="59" r="1.2" fill="white" />
      {/* Horns */}
      <Path d="M 80 48 L 72 30 L 82 45" fill={colors.dark} />
      <Path d="M 120 48 L 128 30 L 118 45" fill={colors.dark} />
      {/* Mouth */}
      <Path d="M 92 82 Q 100 88, 108 82" stroke={colors.dark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Spikes */}
      <Path d="M 95 42 L 100 35 L 105 42" fill={colors.light} />
      <Path d="M 95 90 L 100 83 L 105 90" fill={colors.light} />
    </>
  );

  const renderLegendaryDragon = () => (
    <>
      {/* Aura glow */}
      <Defs>
        <RadialGradient id="legendGlow" cx="50%" cy="55%" rx="50%" ry="50%">
          <Stop offset="0" stopColor={colors.glow ?? '#C8A84E'} stopOpacity="0.15" />
          <Stop offset="0.7" stopColor={colors.glow ?? '#C8A84E'} stopOpacity="0.05" />
          <Stop offset="1" stopColor={colors.glow ?? '#C8A84E'} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Ellipse cx="100" cy="110" rx="90" ry="85" fill="url(#legendGlow)" />
      {/* Majestic tail */}
      <AnimatedG animatedProps={tailProps}>
        <Path
          d="M 85 130 Q 48 148, 28 168 Q 15 180, 22 175 Q 32 165, 38 158"
          stroke={colors.dark}
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
        />
        <Path d="M 20 177 L 8 168 L 18 180 L 8 188 L 22 178" fill={colors.primary} />
        {/* Tail flame */}
        <Circle cx="14" cy="178" r="5" fill={colors.glow ?? '#C8A84E'} opacity={0.4} />
      </AnimatedG>
      {/* Grand wings with membrane details */}
      <AnimatedG animatedProps={leftWingProps}>
        <Path d="M 62 72 Q 25 32, 8 55 Q 18 42, 30 58 Q 15 38, 3 65 Q 18 52, 42 78" fill={colors.light} opacity={0.85} />
        <Path d="M 62 72 Q 25 32, 8 55 Q 18 42, 30 58" stroke={colors.primary} strokeWidth="2" fill="none" />
        {/* Wing membrane lines */}
        <Path d="M 52 75 Q 38 56, 22 60" stroke={colors.primary} strokeWidth="0.8" fill="none" opacity={0.5} />
        <Path d="M 46 78 Q 30 60, 15 66" stroke={colors.primary} strokeWidth="0.8" fill="none" opacity={0.5} />
      </AnimatedG>
      <AnimatedG animatedProps={rightWingProps}>
        <Path d="M 138 72 Q 175 32, 192 55 Q 182 42, 170 58 Q 185 38, 197 65 Q 182 52, 158 78" fill={colors.light} opacity={0.85} />
        <Path d="M 138 72 Q 175 32, 192 55 Q 182 42, 170 58" stroke={colors.primary} strokeWidth="2" fill="none" />
        <Path d="M 148 75 Q 162 56, 178 60" stroke={colors.primary} strokeWidth="0.8" fill="none" opacity={0.5} />
        <Path d="M 154 78 Q 170 60, 185 66" stroke={colors.primary} strokeWidth="0.8" fill="none" opacity={0.5} />
      </AnimatedG>
      {/* Armored body */}
      <Ellipse cx="100" cy="110" rx="36" ry="42" fill={colors.primary} />
      <Ellipse cx="100" cy="115" rx="23" ry="30" fill={colors.belly} />
      {/* Scale lines on belly */}
      <Path d="M 84 108 Q 100 112, 116 108" stroke={colors.dark} strokeWidth="0.6" fill="none" opacity={0.3} />
      <Path d="M 82 118 Q 100 122, 118 118" stroke={colors.dark} strokeWidth="0.6" fill="none" opacity={0.3} />
      <Path d="M 84 128 Q 100 132, 116 128" stroke={colors.dark} strokeWidth="0.6" fill="none" opacity={0.3} />
      {/* Strong legs */}
      <Path d="M 76 140 L 70 160 L 62 160 L 66 158 L 74 160 L 80 160 L 82 140" fill={colors.dark} />
      <Path d="M 118 140 L 122 160 L 132 160 L 128 158 L 120 160 L 114 160 L 116 140" fill={colors.dark} />
      {/* Arms with claws */}
      <Path d="M 68 100 L 56 110 L 52 107 L 56 112 L 53 116 L 60 110 L 70 102" fill={colors.primary} />
      <Path d="M 132 100 L 144 110 L 148 107 L 144 112 L 147 116 L 140 110 L 130 102" fill={colors.primary} />
      {/* Head — more angular and regal */}
      <Ellipse cx="100" cy="63" rx="29" ry="26" fill={colors.primary} />
      <Ellipse cx="100" cy="77" rx="16" ry="10" fill={colors.light} />
      {/* Glowing eyes */}
      <Ellipse cx="87" cy="58" rx="6" ry="7" fill="#FFE080" />
      <Circle cx="88" cy="58" r="3.5" fill="#FF6600" />
      <Circle cx="89" cy="57" r="1.5" fill="#FFEE00" />
      <Ellipse cx="113" cy="58" rx="6" ry="7" fill="#FFE080" />
      <Circle cx="114" cy="58" r="3.5" fill="#FF6600" />
      <Circle cx="115" cy="57" r="1.5" fill="#FFEE00" />
      {/* Smoke from nostrils */}
      <Circle cx="92" cy="74" r="2.5" fill={colors.dark} />
      <Circle cx="108" cy="74" r="2.5" fill={colors.dark} />
      <Circle cx="90" cy="70" r="2" fill="#888" opacity={0.2} />
      <Circle cx="110" cy="70" r="2" fill="#888" opacity={0.2} />
      {/* Crown/crest between horns */}
      <Path d="M 85 38 L 92 20 L 96 32 L 100 15 L 104 32 L 108 20 L 115 38" fill={colors.glow ?? '#C8A84E'} opacity={0.8} />
      {/* Grand horns */}
      <Path d="M 78 45 L 68 22 L 80 42" fill={colors.dark} />
      <Path d="M 122 45 L 132 22 L 120 42" fill={colors.dark} />
      {/* Mouth */}
      <Path d="M 90 81 Q 100 87, 110 81" stroke={colors.dark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* 4 back spikes */}
      <Path d="M 94 40 L 100 30 L 106 40" fill={colors.light} />
      <Path d="M 94 88 L 100 78 L 106 88" fill={colors.light} />
      {/* Rune markings on body */}
      <Circle cx="80" cy="105" r="3" fill={colors.glow ?? '#C8A84E'} opacity={0.25} />
      <Circle cx="120" cy="115" r="3" fill={colors.glow ?? '#C8A84E'} opacity={0.2} />
      <Circle cx="95" cy="135" r="2" fill={colors.glow ?? '#C8A84E'} opacity={0.3} />
    </>
  );

  const renderStageBody = () => {
    switch (stage) {
      case 'baby': return renderBabyDragon();
      case 'young': return renderYoungDragon();
      case 'juvenile': return renderJuvenileDragon();
      case 'teen': return renderTeenDragon();
      case 'legendary': return renderLegendaryDragon();
      case 'adult':
      default: return renderAdultDragon();
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <AnimatedG animatedProps={bodyProps}>
          {renderStageBody()}
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
