import React from 'react';
import { View, StyleSheet } from 'react-native';
import Sky from './Sky';
import Ground from './Ground';
import Castle from './Castle';
import AmbientEvents from './AmbientEvents';
import { BackgroundConfig } from '../../data/backgrounds';

interface BackgroundProps {
  config: BackgroundConfig;
}

const Background: React.FC<BackgroundProps> = ({ config }) => {
  return (
    <View style={styles.container}>
      <Sky topColor={config.skyColorTop} bottomColor={config.skyColorBottom} />

      {config.hasMountains && <Mountains />}
      {config.hascastle && <Castle x={40} scale={0.5} />}
      {config.hasVillage && <Village />}

      <AmbientEvents events={config.ambientEvents} />

      <Ground color={config.groundColor} />
    </View>
  );
};

// Simple mountain silhouettes
const Mountains: React.FC = () => {
  const Svg = require('react-native-svg').default;
  const { Path } = require('react-native-svg');
  const { Dimensions } = require('react-native');
  const { width } = Dimensions.get('window');

  return (
    <View style={{ position: 'absolute', bottom: 100, left: 0, right: 0 }}>
      <Svg width={width} height={150} viewBox={`0 0 ${width} 150`}>
        <Path
          d={`M 0 150 L ${width * 0.15} 40 L ${width * 0.3} 150 Z`}
          fill="#3D3D5C"
          opacity={0.5}
        />
        <Path
          d={`M ${width * 0.2} 150 L ${width * 0.45} 20 L ${width * 0.65} 150 Z`}
          fill="#2D2D4C"
          opacity={0.6}
        />
        <Path
          d={`M ${width * 0.55} 150 L ${width * 0.75} 50 L ${width} 150 Z`}
          fill="#3D3D5C"
          opacity={0.5}
        />
      </Svg>
    </View>
  );
};

// Simple village huts
const Village: React.FC = () => {
  const Svg = require('react-native-svg').default;
  const { Rect, Path: SvgPath } = require('react-native-svg');

  return (
    <View style={{ position: 'absolute', bottom: 105, right: 30 }}>
      <Svg width={80} height={50} viewBox="0 0 80 50">
        {/* Hut 1 */}
        <Rect x="5" y="25" width="20" height="25" fill="#8B6914" />
        <SvgPath d="M 0 25 L 15 5 L 30 25" fill="#6B3A1F" />
        {/* Hut 2 */}
        <Rect x="35" y="30" width="18" height="20" fill="#8B6914" />
        <SvgPath d="M 30 30 L 44 12 L 58 30" fill="#6B3A1F" />
        {/* Hut 3 */}
        <Rect x="58" y="28" width="16" height="22" fill="#8B6914" />
        <SvgPath d="M 55 28 L 66 10 L 77 28" fill="#6B3A1F" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Background;
