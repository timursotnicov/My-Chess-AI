import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

interface LevelBadgeProps {
  level: number;
  xpProgress: number;
  stageName: string;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  xpProgress,
  stageName,
}) => {
  const fillStyle = useAnimatedStyle(() => ({
    width: withTiming(`${Math.min(100, xpProgress * 100)}%` as any, {
      duration: 500,
    }),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.levelCircle}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.stageName}>{stageName}</Text>
          <View style={styles.xpBarBg}>
            <Animated.View style={[styles.xpBarFill, fillStyle]} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.charcoal,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    fontFamily: 'MedievalSharp',
    fontSize: 16,
    color: colors.textGold,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
    marginLeft: 8,
  },
  stageName: {
    fontFamily: 'MedievalSharp',
    fontSize: 14,
    color: colors.textGold,
    marginBottom: 3,
  },
  xpBarBg: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.gold + '40',
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 2,
  },
});

export default LevelBadge;
