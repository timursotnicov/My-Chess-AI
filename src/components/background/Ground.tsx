import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface GroundProps {
  color?: string;
  height?: number;
}

const Ground: React.FC<GroundProps> = ({
  color = '#4A7C3F',
  height: groundHeight = 120,
}) => {
  // Rolling hills path
  const hillPath = `M 0 30 Q ${width * 0.15} 0, ${width * 0.3} 20 Q ${width * 0.5} 40, ${width * 0.7} 15 Q ${width * 0.85} 0, ${width} 25 L ${width} ${groundHeight} L 0 ${groundHeight} Z`;

  return (
    <View style={[styles.container, { height: groundHeight }]}>
      <Svg
        width={width}
        height={groundHeight}
        viewBox={`0 0 ${width} ${groundHeight}`}
      >
        <Path d={hillPath} fill={color} />
        <Rect
          x="0"
          y="30"
          width={width}
          height={groundHeight - 30}
          fill={color}
          opacity={0.8}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Ground;
