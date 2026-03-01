import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Path, Circle, Text as SvgText, G } from 'react-native-svg';
import { ShelterRoomState, RoomType } from '../../types';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');
const MAP_WIDTH = width - 32;
const MAP_HEIGHT = 200;

interface ShelterViewProps {
  rooms: ShelterRoomState[];
  onRoomPress: (roomId: RoomType) => void;
  selectedRoom: RoomType | null;
}

const ROOM_POSITIONS: Record<RoomType, { x: number; y: number; icon: string }> = {
  hearth: { x: 0.5, y: 0.3, icon: '🔥' },
  sleeping_den: { x: 0.2, y: 0.5, icon: '🛏️' },
  shadow_garden: { x: 0.8, y: 0.5, icon: '🌿' },
  training_ground: { x: 0.15, y: 0.8, icon: '⚔️' },
  alchemy_lab: { x: 0.5, y: 0.75, icon: '⚗️' },
  treasure_vault: { x: 0.85, y: 0.8, icon: '💎' },
};

const ShelterView: React.FC<ShelterViewProps> = ({ rooms, onRoomPress, selectedRoom }) => {
  return (
    <View style={styles.container}>
      <Svg width={MAP_WIDTH} height={MAP_HEIGHT} viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}>
        {/* Cave background */}
        <Rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} rx="12" fill={colors.darkSlate} />
        <Rect x="2" y="2" width={MAP_WIDTH - 4} height={MAP_HEIGHT - 4} rx="10" fill="none" stroke={colors.cardBorder} strokeWidth="1" />

        {/* Connecting paths */}
        <Path
          d={`M ${MAP_WIDTH * 0.5} ${MAP_HEIGHT * 0.3} L ${MAP_WIDTH * 0.2} ${MAP_HEIGHT * 0.5}`}
          stroke={colors.goldDim}
          strokeWidth="1"
          strokeDasharray="4,4"
          opacity={0.4}
        />
        <Path
          d={`M ${MAP_WIDTH * 0.5} ${MAP_HEIGHT * 0.3} L ${MAP_WIDTH * 0.8} ${MAP_HEIGHT * 0.5}`}
          stroke={colors.goldDim}
          strokeWidth="1"
          strokeDasharray="4,4"
          opacity={0.4}
        />
        <Path
          d={`M ${MAP_WIDTH * 0.5} ${MAP_HEIGHT * 0.3} L ${MAP_WIDTH * 0.5} ${MAP_HEIGHT * 0.75}`}
          stroke={colors.goldDim}
          strokeWidth="1"
          strokeDasharray="4,4"
          opacity={0.4}
        />

        {/* Room nodes */}
        {rooms.map((room) => {
          const pos = ROOM_POSITIONS[room.id];
          if (!pos) return null;
          const x = MAP_WIDTH * pos.x;
          const y = MAP_HEIGHT * pos.y;
          const isSelected = selectedRoom === room.id;
          const isLocked = !room.isUnlocked;

          return (
            <G key={room.id} onPress={() => onRoomPress(room.id)}>
              <Circle
                cx={x}
                cy={y}
                r={isSelected ? 22 : 18}
                fill={isLocked ? colors.charcoal : colors.arcaneDim}
                stroke={isSelected ? colors.gold : isLocked ? colors.textDim : colors.arcane}
                strokeWidth={isSelected ? 2 : 1}
                opacity={isLocked ? 0.5 : 1}
              />
              <SvgText
                x={x}
                y={y + 5}
                fontSize="16"
                textAnchor="middle"
                opacity={isLocked ? 0.3 : 1}
              >
                {pos.icon}
              </SvgText>
              {room.level > 0 && !isLocked && (
                <SvgText
                  x={x + 14}
                  y={y - 10}
                  fontSize="10"
                  fill={colors.gold}
                  textAnchor="middle"
                >
                  {room.level}
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

export default ShelterView;
