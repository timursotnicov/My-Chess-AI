import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ShelterRoomDefinition, ShelterRoomState } from '../../types';
import { colors } from '../../theme/colors';

interface RoomCardProps {
  definition: ShelterRoomDefinition;
  state: ShelterRoomState;
  isSelected: boolean;
  onPress: () => void;
}

const ROOM_ICONS: Record<string, string> = {
  hearth: '🔥',
  sleeping_den: '🛏️',
  shadow_garden: '🌿',
  training_ground: '⚔️',
  alchemy_lab: '⚗️',
  treasure_vault: '💎',
};

const RoomCard: React.FC<RoomCardProps> = ({ definition, state, isSelected, onPress }) => {
  const { t } = useTranslation();
  const isLocked = !state.isUnlocked;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        isLocked && styles.cardLocked,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconArea}>
        <Text style={[styles.icon, isLocked && styles.iconLocked]}>
          {ROOM_ICONS[definition.id] || '🏠'}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, isLocked && styles.textLocked]}>
          {t(definition.nameKey)}
        </Text>
        <Text style={[styles.description, isLocked && styles.textLocked]}>
          {isLocked ? t('shelter.locked') : t(definition.descriptionKey)}
        </Text>
        {!isLocked && (
          <View style={styles.levelRow}>
            <Text style={styles.levelText}>
              Lv. {state.level}/{definition.maxLevel}
            </Text>
            <View style={styles.levelBar}>
              <View
                style={[
                  styles.levelFill,
                  { width: `${(state.level / definition.maxLevel) * 100}%` },
                ]}
              />
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: colors.gold,
    borderWidth: 2,
  },
  cardLocked: {
    opacity: 0.6,
  },
  iconArea: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 22,
  },
  iconLocked: {
    opacity: 0.4,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: 'MedievalSharp',
    fontSize: 16,
    color: colors.textPrimary,
  },
  description: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  textLocked: {
    color: colors.textDim,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  levelText: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.gold,
    width: 50,
  },
  levelBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.charcoal,
    borderRadius: 2,
  },
  levelFill: {
    height: 4,
    backgroundColor: colors.arcane,
    borderRadius: 2,
  },
});

export default RoomCard;
