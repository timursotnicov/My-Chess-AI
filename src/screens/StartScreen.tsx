import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  FadeIn,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Svg, {
  Ellipse,
  Path,
  Circle,
  Rect as SvgRect,
  Defs,
  RadialGradient,
  Stop,
  LinearGradient,
} from 'react-native-svg';
import MedievalButton from '../components/ui/MedievalButton';
import { usePetStore } from '../store/petStore';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

interface StartScreenProps {
  onStartGame: () => void;
  onLoadGame: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame, onLoadGame }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const initNewGame = usePetStore((s) => s.initNewGame);
  const hasExistingSave = usePetStore((s) => s.hasExistingSave);

  const floatY = useSharedValue(0);
  const glowPulse = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
  }, []);

  const eggStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value * -12 }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.3 + glowPulse.value * 0.4,
    transform: [{ scale: 1 + glowPulse.value * 0.15 }],
  }));

  const handleNewGame = () => {
    if (!showNameInput) {
      setShowNameInput(true);
      return;
    }
    const dragonName = name.trim() || t('start.defaultName');
    initNewGame(dragonName);
    onStartGame();
  };

  const handleContinue = () => {
    onLoadGame();
  };

  return (
    <View style={styles.container}>
      {/* Background gradient with SVG */}
      <View style={styles.bgContainer}>
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#0A0814" />
              <Stop offset="0.4" stopColor="#16102E" />
              <Stop offset="0.7" stopColor="#1A1040" />
              <Stop offset="1" stopColor="#0A0814" />
            </LinearGradient>
            <RadialGradient id="centerGlow" cx="50%" cy="45%" rx="40%" ry="30%">
              <Stop offset="0" stopColor={colors.arcaneGlow} stopOpacity="0.12" />
              <Stop offset="1" stopColor={colors.arcaneGlow} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <SvgRect x="0" y="0" width={width} height={height} fill="url(#bgGrad)" />
          <SvgRect x="0" y="0" width={width} height={height} fill="url(#centerGlow)" />
        </Svg>
      </View>

      {/* Floating ambient particles */}
      <View style={styles.particles}>
        {[...Array(12)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.particle,
              {
                left: `${5 + Math.random() * 90}%`,
                top: `${5 + Math.random() * 90}%`,
                opacity: 0.1 + Math.random() * 0.3,
                width: 2 + Math.random() * 3,
                height: 2 + Math.random() * 3,
                borderRadius: 2,
              },
            ]}
          />
        ))}
      </View>

      {/* Title */}
      <Animated.View entering={FadeInUp.duration(1000)} style={styles.titleArea}>
        <Text style={styles.titleShadow}>{t('app.title')}</Text>
        <Text style={styles.title}>{t('app.title')}</Text>
        <View style={styles.titleDivider}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerDiamond} />
          <View style={styles.dividerLine} />
        </View>
        <Text style={styles.subtitle}>{'~ ' + t('start.choosePet') + ' ~'}</Text>
      </Animated.View>

      {/* Egg with glow */}
      <Animated.View
        entering={FadeIn.delay(300).duration(800)}
        style={[styles.eggArea, eggStyle]}
      >
        {/* Glow behind egg */}
        <Animated.View style={[styles.eggGlow, glowStyle]} />

        <Svg width={160} height={200} viewBox="0 0 160 200">
          <Defs>
            <LinearGradient id="eggGrad" x1="0" y1="0" x2="0.3" y2="1">
              <Stop offset="0" stopColor="#8B3DAE" />
              <Stop offset="0.5" stopColor="#6B1D7E" />
              <Stop offset="1" stopColor="#4A0D5E" />
            </LinearGradient>
            <RadialGradient id="eggShine" cx="35%" cy="30%" rx="30%" ry="25%">
              <Stop offset="0" stopColor="white" stopOpacity="0.2" />
              <Stop offset="1" stopColor="white" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          {/* Egg shadow */}
          <Ellipse cx="80" cy="185" rx="40" ry="8" fill="#000" opacity={0.3} />
          {/* Main egg */}
          <Ellipse cx="80" cy="110" rx="55" ry="72" fill="url(#eggGrad)" />
          {/* Egg highlight */}
          <Ellipse cx="80" cy="110" rx="55" ry="72" fill="url(#eggShine)" />
          {/* Arcane runes */}
          <Circle cx="60" cy="85" r="6" fill={colors.arcaneGlow} opacity={0.5} />
          <Circle cx="95" cy="100" r="8" fill={colors.arcaneGlow} opacity={0.35} />
          <Circle cx="72" cy="125" r="5" fill={colors.arcaneGlow} opacity={0.55} />
          <Circle cx="88" cy="75" r="3" fill={colors.arcaneGlow} opacity={0.4} />
          {/* Crack lines */}
          <Path
            d="M 60 75 L 65 88 L 58 95"
            stroke={colors.arcaneGlow}
            strokeWidth="1.5"
            fill="none"
            opacity={0.6}
          />
          <Path
            d="M 92 90 L 88 100 L 95 108"
            stroke={colors.arcaneGlow}
            strokeWidth="1"
            fill="none"
            opacity={0.4}
          />
        </Svg>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(600).duration(600)}>
        <Text style={styles.dragonName}>{t('start.dragonName')}</Text>
        <Text style={styles.dragonDesc}>{t('start.dragonDesc')}</Text>
      </Animated.View>

      {/* Name input */}
      {showNameInput && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.nameArea}>
          <Text style={styles.nameLabel}>{t('start.enterName')}</Text>
          <View style={styles.nameInputWrapper}>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder={t('start.defaultName')}
              placeholderTextColor={colors.textSecondary + '50'}
              maxLength={20}
              autoFocus
            />
          </View>
        </Animated.View>
      )}

      {/* Buttons */}
      <Animated.View
        entering={FadeInUp.delay(800).duration(600)}
        style={styles.buttonsArea}
      >
        {hasExistingSave && (
          <MedievalButton
            title={t('start.continueGame')}
            onPress={handleContinue}
            size="large"
            variant="gold"
          />
        )}
        <View style={{ height: 14 }} />
        <MedievalButton
          title={showNameInput ? t('start.begin') : t('start.newGame')}
          onPress={handleNewGame}
          size="large"
          variant={hasExistingSave ? 'secondary' : 'gold'}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  bgContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  particles: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    backgroundColor: colors.arcaneGlow,
  },
  titleArea: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'MedievalSharp',
    fontSize: 42,
    color: '#FFD875',
    textShadowColor: colors.gold + '60',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  titleShadow: {
    position: 'absolute',
    fontFamily: 'MedievalSharp',
    fontSize: 42,
    color: 'transparent',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 8,
  },
  titleDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
    width: 180,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gold + '40',
  },
  dividerDiamond: {
    width: 6,
    height: 6,
    backgroundColor: colors.gold + '70',
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 8,
  },
  subtitle: {
    fontFamily: 'Cinzel',
    fontSize: 14,
    color: colors.moonlightDim,
    opacity: 0.9,
  },
  eggArea: {
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eggGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.arcaneGlow + '20',
    shadowColor: colors.arcaneGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
  },
  dragonName: {
    fontFamily: 'MedievalSharp',
    fontSize: 24,
    color: colors.dragonLight,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  dragonDesc: {
    fontFamily: 'Cinzel',
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
    paddingHorizontal: 30,
    lineHeight: 20,
  },
  nameArea: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  nameLabel: {
    fontFamily: 'Cinzel',
    fontSize: 14,
    color: colors.textGold,
    marginBottom: 10,
  },
  nameInputWrapper: {
    width: '80%',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.gold + '50',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  nameInput: {
    height: 48,
    backgroundColor: 'rgba(20, 18, 40, 0.9)',
    color: colors.textPrimary,
    fontFamily: 'MedievalSharp',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 14,
  },
  buttonsArea: {
    marginTop: 28,
    alignItems: 'center',
  },
});

export default StartScreen;
