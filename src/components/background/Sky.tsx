import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { getTimeOfDay } from '../../systems/timeSystem';

const { width, height } = Dimensions.get('window');

interface SkyProps {
  topColor?: string;
  bottomColor?: string;
}

const TIME_COLORS = {
  dawn: { top: '#FF7E5F', bottom: '#FEB47B' },
  day: { top: '#87CEEB', bottom: '#B0E0E6' },
  dusk: { top: '#C06C84', bottom: '#6C5B7B' },
  night: { top: '#1A0F2E', bottom: '#2D1B4E' },
};

const Sky: React.FC<SkyProps> = ({ topColor, bottomColor }) => {
  const time = getTimeOfDay();
  const colors = TIME_COLORS[time];
  const top = topColor ?? colors.top;
  const bottom = bottomColor ?? colors.bottom;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={top} />
            <Stop offset="1" stopColor={bottom} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={width} height={height} fill="url(#skyGrad)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Sky;
