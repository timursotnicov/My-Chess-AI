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
  Easing,
} from 'react-native-reanimated';
import Svg, { Ellipse, Path, Circle } from 'react-native-svg';
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

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  const eggStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value * -8 }],
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
      <View style={styles.bgGradient} />

      {/* Ambient particles */}
      <View style={styles.particles}>
        {[...Array(6)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.particle,
              {
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                opacity: 0.1 + Math.random() * 0.2,
              },
            ]}
          />
        ))}
      </View>

      {/* Title */}
      <Animated.View entering={FadeInUp.duration(800)} style={styles.titleArea}>
        <Text style={styles.title}>{t('app.title')}</Text>
        <Text style={styles.subtitle}>{'~ ' + t('start.choosePet') + ' ~'}</Text>
      </Animated.View>

      {/* Egg */}
      <Animated.View
        entering={FadeIn.delay(300).duration(600)}
        style={[styles.eggArea, eggStyle]}
      >
        <Svg width={140} height={180} viewBox="0 0 140 180">
          <Ellipse cx="70" cy="100" rx="50" ry="65" fill={colors.dragonPrimary} />
          <Ellipse cx="70" cy="105" rx="38" ry="50" fill={colors.dragonLight} opacity={0.2} />
          <Circle cx="55" cy="80" r="5" fill={colors.arcaneGlow} opacity={0.4} />
          <Circle cx="80" cy="95" r="7" fill={colors.arcaneGlow} opacity={0.3} />
          <Circle cx="65" cy="115" r="4" fill={colors.arcaneGlow} opacity={0.5} />
          <Path
            d="M 55 70 L 60 80 L 52 85"
            stroke={colors.dragonDark}
            strokeWidth="1.5"
            fill="none"
          />
        </Svg>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(500).duration(600)}>
        <Text style={styles.dragonName}>{t('start.dragonName')}</Text>
        <Text style={styles.dragonDesc}>{t('start.dragonDesc')}</Text>
      </Animated.View>

      {/* Name input */}
      {showNameInput && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.nameArea}>
          <Text style={styles.nameLabel}>{t('start.enterName')}</Text>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder={t('start.defaultName')}
            placeholderTextColor={colors.textSecondary + '60'}
            maxLength={20}
            autoFocus
          />
        </Animated.View>
      )}

      {/* Buttons */}
      <Animated.View
        entering={FadeInUp.delay(700).duration(600)}
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
        <View style={{ height: 12 }} />
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
    paddingHorizontal: 20,
  },
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.abyss,
  },
  particles: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.arcaneGlow,
  },
  titleArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'MedievalSharp',
    fontSize: 36,
    color: colors.textGold,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontFamily: 'Cinzel',
    fontSize: 14,
    color: colors.moonlightDim,
    marginTop: 4,
    opacity: 0.8,
  },
  eggArea: {
    marginVertical: 20,
    alignItems: 'center',
  },
  dragonName: {
    fontFamily: 'MedievalSharp',
    fontSize: 22,
    color: colors.dragonLight,
    textAlign: 'center',
  },
  dragonDesc: {
    fontFamily: 'Cinzel',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    opacity: 0.7,
    paddingHorizontal: 40,
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
    marginBottom: 8,
  },
  nameInput: {
    width: '80%',
    height: 44,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderWidth: 2,
    borderColor: colors.gold + '60',
    borderRadius: 8,
    color: colors.textPrimary,
    fontFamily: 'MedievalSharp',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  buttonsArea: {
    marginTop: 30,
    alignItems: 'center',
  },
});

export default StartScreen;
