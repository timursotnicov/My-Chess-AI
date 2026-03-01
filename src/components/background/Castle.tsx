import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Rect, G } from 'react-native-svg';

interface CastleProps {
  x?: number;
  scale?: number;
  color?: string;
}

const Castle: React.FC<CastleProps> = ({
  x = 50,
  scale = 0.5,
  color = '#4A3728',
}) => {
  return (
    <View style={[styles.container, { left: x }]}>
      <Svg width={120 * scale} height={160 * scale} viewBox="0 0 120 160">
        <G>
          {/* Main tower */}
          <Rect x="30" y="40" width="60" height="120" fill={color} />
          {/* Left tower */}
          <Rect x="10" y="20" width="30" height="140" fill={color} />
          {/* Right tower */}
          <Rect x="80" y="20" width="30" height="140" fill={color} />

          {/* Battlements - left tower */}
          <Rect x="5" y="14" width="10" height="12" fill={color} />
          <Rect x="20" y="14" width="10" height="12" fill={color} />
          <Rect x="35" y="14" width="10" height="12" fill={color} />

          {/* Battlements - right tower */}
          <Rect x="75" y="14" width="10" height="12" fill={color} />
          <Rect x="90" y="14" width="10" height="12" fill={color} />
          <Rect x="105" y="14" width="10" height="12" fill={color} />

          {/* Battlements - center */}
          <Rect x="30" y="34" width="10" height="10" fill={color} />
          <Rect x="47" y="34" width="10" height="10" fill={color} />
          <Rect x="63" y="34" width="10" height="10" fill={color} />
          <Rect x="80" y="34" width="10" height="10" fill={color} />

          {/* Gate */}
          <Path
            d="M 48 160 L 48 120 Q 60 105, 72 120 L 72 160"
            fill="#1A0F2E"
          />

          {/* Windows */}
          <Rect x="18" y="60" width="8" height="12" fill="#1A0F2E" rx="4" />
          <Rect x="18" y="100" width="8" height="12" fill="#1A0F2E" rx="4" />
          <Rect x="93" y="60" width="8" height="12" fill="#1A0F2E" rx="4" />
          <Rect x="93" y="100" width="8" height="12" fill="#1A0F2E" rx="4" />

          {/* Flag pole */}
          <Rect x="58" y="0" width="2" height="38" fill="#4A4A4A" />
          {/* Flag */}
          <Path d="M 60 2 L 80 10 L 60 18" fill="#C9302C" />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
  },
});

export default Castle;
