import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');
const GAME_WIDTH = width - 40;
const GAME_HEIGHT = height * 0.55;
const GAME_DURATION = 30000; // 30 seconds
const SPAWN_INTERVAL = 800;

interface Firefly {
  id: number;
  x: number;
  y: number;
  caught: boolean;
}

interface FireflyCatchProps {
  onComplete: (score: number) => void;
}

const FireflyCatch: React.FC<FireflyCatchProps> = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [fireflies, setFireflies] = useState<Firefly[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const gameEndRef = useRef(false);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(30);
    setFireflies([]);
    gameEndRef.current = false;
  };

  // Timer
  useEffect(() => {
    if (!gameStarted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!gameEndRef.current) {
            gameEndRef.current = true;
            clearInterval(interval);
            setTimeout(() => onComplete(score), 500);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStarted, score]);

  // Spawn fireflies
  useEffect(() => {
    if (!gameStarted || gameEndRef.current) return;
    const interval = setInterval(() => {
      const newFirefly: Firefly = {
        id: Date.now() + Math.random(),
        x: 20 + Math.random() * (GAME_WIDTH - 40),
        y: 20 + Math.random() * (GAME_HEIGHT - 40),
        caught: false,
      };
      setFireflies((prev) => [...prev.slice(-8), newFirefly]);
    }, SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [gameStarted]);

  const catchFirefly = useCallback((id: number) => {
    setFireflies((prev) =>
      prev.map((f) => (f.id === id ? { ...f, caught: true } : f)),
    );
    setScore((prev) => prev + 1);
  }, []);

  if (!gameStarted) {
    return (
      <View style={styles.startArea}>
        <Text style={styles.startTitle}>🌟</Text>
        <Text style={styles.startDesc}>Tap the fireflies!</Text>
        <TouchableOpacity style={styles.startBtn} onPress={startGame}>
          <Text style={styles.startBtnText}>Start</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HUD */}
      <View style={styles.hud}>
        <Text style={styles.hudText}>Score: {score}</Text>
        <Text style={styles.hudText}>{timeLeft}s</Text>
      </View>

      {/* Game field */}
      <View style={styles.field}>
        {fireflies.map((f) =>
          f.caught ? null : (
            <TouchableOpacity
              key={f.id}
              style={[styles.firefly, { left: f.x, top: f.y }]}
              onPress={() => catchFirefly(f.id)}
              activeOpacity={0.5}
            >
              <Text style={styles.fireflyGlow}>{'✨'}</Text>
            </TouchableOpacity>
          ),
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: GAME_WIDTH,
    alignItems: 'center',
  },
  startArea: {
    alignItems: 'center',
    gap: 16,
  },
  startTitle: {
    fontSize: 60,
  },
  startDesc: {
    fontFamily: 'MedievalSharp',
    fontSize: 18,
    color: colors.textPrimary,
  },
  startBtn: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold + '60',
  },
  startBtnText: {
    fontFamily: 'MedievalSharp',
    fontSize: 20,
    color: colors.textGold,
  },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  hudText: {
    fontFamily: 'MedievalSharp',
    fontSize: 18,
    color: colors.gold,
  },
  field: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: 'rgba(10, 10, 20, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.arcane + '30',
    overflow: 'hidden',
  },
  firefly: {
    position: 'absolute',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fireflyGlow: {
    fontSize: 28,
  },
});

export default FireflyCatch;
