import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
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
      <View style={styles.badge}>
        {/* Shield icon */}
        <View style={styles.shieldContainer}>
          <Svg width={44} height={48} viewBox="0 0 44 48">
            <Defs>
              <LinearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.gold} />
                <Stop offset="1" stopColor="#8E6A20" />
              </LinearGradient>
            </Defs>
            {/* Shield shape */}
            <Path
              d="M 22 2 L 40 10 L 40 26 Q 40 40, 22 46 Q 4 40, 4 26 L 4 10 Z"
              fill="url(#shieldGrad)"
              opacity={0.9}
            />
            <Path
              d="M 22 2 L 40 10 L 40 26 Q 40 40, 22 46 Q 4 40, 4 26 L 4 10 Z"
              fill="none"
              stroke={colors.gold}
              strokeWidth="1.5"
            />
            {/* Inner shield */}
            <Path
              d="M 22 6 L 36 12 L 36 25 Q 36 37, 22 42 Q 8 37, 8 25 L 8 12 Z"
              fill={colors.deepViolet}
              opacity={0.8}
            />
            {/* Star decoration */}
            <Circle cx="22" cy="22" r="2" fill={colors.gold} opacity={0.6} />
          </Svg>
          <Text style={styles.levelText}>{level}</Text>
        </View>

        {/* Info section */}
        <View style={styles.info}>
          <Text style={styles.stageName}>{stageName}</Text>
          <View style={styles.xpBarOuter}>
            <View style={styles.xpBarBg}>
              <Animated.View style={[styles.xpBarFill, fillStyle]} />
              <View style={styles.xpBarShine} />
            </View>
          </View>
          <Text style={styles.xpLabel}>
            {Math.round(xpProgress * 100)}% XP
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 10, 20, 0.55)',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.gold + '25',
  },
  shieldContainer: {
    width: 44,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    position: 'absolute',
    fontFamily: 'MedievalSharp',
    fontSize: 18,
    color: colors.textGold,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    top: 14,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  stageName: {
    fontFamily: 'MedievalSharp',
    fontSize: 15,
    color: colors.textGold,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  xpBarOuter: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  xpBarBg: {
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.gold + '30',
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 4,
  },
  xpBarShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  xpLabel: {
    fontFamily: 'Cinzel',
    fontSize: 10,
    color: colors.goldDim,
    marginTop: 2,
    textAlign: 'right',
  },
});

export default LevelBadge;
