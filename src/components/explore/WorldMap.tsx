import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Circle, Path, Text as SvgText, G } from 'react-native-svg';
import { LocationState, LocationId } from '../../types';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');
const MAP_WIDTH = width - 32;
const MAP_HEIGHT = 180;

interface WorldMapProps {
  locations: LocationState[];
  onLocationPress: (id: LocationId) => void;
}

const LOCATION_POSITIONS: Record<LocationId, { x: number; y: number; icon: string }> = {
  whispering_forest: { x: 0.2, y: 0.5, icon: '🌲' },
  drowned_ruins: { x: 0.5, y: 0.35, icon: '🏛️' },
  bellless_tower: { x: 0.8, y: 0.55, icon: '🗼' },
};

const WorldMap: React.FC<WorldMapProps> = ({ locations, onLocationPress }) => {
  return (
    <View style={styles.container}>
      <Svg width={MAP_WIDTH} height={MAP_HEIGHT} viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}>
        {/* Map background */}
        <Rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} rx="12" fill={colors.darkSlate} />
        <Rect x="2" y="2" width={MAP_WIDTH - 4} height={MAP_HEIGHT - 4} rx="10" fill="none" stroke={colors.cardBorder} strokeWidth="1" />

        {/* Connecting paths */}
        <Path
          d={`M ${MAP_WIDTH * 0.2} ${MAP_HEIGHT * 0.5} Q ${MAP_WIDTH * 0.35} ${MAP_HEIGHT * 0.3} ${MAP_WIDTH * 0.5} ${MAP_HEIGHT * 0.35}`}
          stroke={colors.goldDim}
          strokeWidth="1.5"
          strokeDasharray="6,4"
          fill="none"
          opacity={0.5}
        />
        <Path
          d={`M ${MAP_WIDTH * 0.5} ${MAP_HEIGHT * 0.35} Q ${MAP_WIDTH * 0.65} ${MAP_HEIGHT * 0.55} ${MAP_WIDTH * 0.8} ${MAP_HEIGHT * 0.55}`}
          stroke={colors.goldDim}
          strokeWidth="1.5"
          strokeDasharray="6,4"
          fill="none"
          opacity={0.5}
        />

        {/* Location nodes */}
        {locations.map((loc) => {
          const pos = LOCATION_POSITIONS[loc.id];
          if (!pos) return null;
          const x = MAP_WIDTH * pos.x;
          const y = MAP_HEIGHT * pos.y;
          const isLocked = !loc.isUnlocked;
          const isDiscovered = loc.isDiscovered;

          return (
            <G key={loc.id} onPress={() => !isLocked && onLocationPress(loc.id)}>
              {/* Glow effect for unlocked */}
              {!isLocked && (
                <Circle cx={x} cy={y} r={28} fill={colors.arcane} opacity={0.15} />
              )}
              <Circle
                cx={x}
                cy={y}
                r={22}
                fill={isLocked ? colors.charcoal : colors.arcaneDim}
                stroke={isLocked ? colors.textDim : colors.arcane}
                strokeWidth={1.5}
                opacity={isLocked ? 0.5 : 1}
              />
              <SvgText
                x={x}
                y={y + 6}
                fontSize="20"
                textAnchor="middle"
                opacity={isLocked ? 0.3 : 1}
              >
                {isLocked ? '🔒' : pos.icon}
              </SvgText>
              {/* Progress indicator */}
              {!isLocked && loc.explorationProgress > 0 && (
                <SvgText
                  x={x}
                  y={y + 38}
                  fontSize="9"
                  fill={colors.textSecondary}
                  textAnchor="middle"
                >
                  {Math.floor(loc.explorationProgress)}%
                </SvgText>
              )}
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
});

export default WorldMap;
