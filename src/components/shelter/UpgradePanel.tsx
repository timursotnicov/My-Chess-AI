import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ShelterRoomDefinition, ShelterRoomState, ResourceInventory, ResourceType } from '../../types';
import { colors } from '../../theme/colors';

interface UpgradePanelProps {
  definition: ShelterRoomDefinition;
  state: ShelterRoomState;
  resources: ResourceInventory;
  onUpgrade: () => void;
  onClose: () => void;
}

const RESOURCE_ICONS: Record<ResourceType, string> = {
  stone: '🪨',
  wood: '🪵',
  herbs: '🌿',
  crystals: '💎',
  ancient_dust: '✨',
  moonwater: '🌙',
};

const UpgradePanel: React.FC<UpgradePanelProps> = ({
  definition,
  state,
  resources,
  onUpgrade,
  onClose,
}) => {
  const { t } = useTranslation();
  const isLocked = !state.isUnlocked;
  const isMaxLevel = state.level >= definition.maxLevel;
  const costIndex = isLocked ? 0 : state.level - 1;
  const cost = definition.upgradeCosts[costIndex];

  const canAfford = cost
    ? Object.entries(cost).every(
        ([res, amount]) => (resources[res as ResourceType] ?? 0) >= (amount ?? 0),
      )
    : false;

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isLocked ? t('shelter.unlock') : t('shelter.upgrade')}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>{'✕'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.roomName}>{t(definition.nameKey)}</Text>

      {isMaxLevel ? (
        <Text style={styles.maxLevel}>{t('shelter.max_level')}</Text>
      ) : (
        <>
          {/* Cost display */}
          <View style={styles.costSection}>
            <Text style={styles.costTitle}>{t('shelter.cost')}:</Text>
            <View style={styles.costGrid}>
              {cost &&
                Object.entries(cost).map(([res, amount]) => {
                  const has = resources[res as ResourceType] ?? 0;
                  const enough = has >= (amount ?? 0);
                  return (
                    <View key={res} style={styles.costItem}>
                      <Text style={styles.costIcon}>
                        {RESOURCE_ICONS[res as ResourceType]}
                      </Text>
                      <Text
                        style={[
                          styles.costAmount,
                          !enough && styles.costInsufficient,
                        ]}
                      >
                        {has}/{amount}
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>

          {/* Upgrade button */}
          <TouchableOpacity
            style={[styles.upgradeBtn, !canAfford && styles.upgradeBtnDisabled]}
            onPress={onUpgrade}
            disabled={!canAfford}
          >
            <Text style={styles.upgradeBtnText}>
              {isLocked ? t('shelter.unlock') : `${t('shelter.upgrade')} → Lv.${state.level + 1}`}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.darkSlate,
    borderTopWidth: 2,
    borderTopColor: colors.gold + '60',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'MedievalSharp',
    fontSize: 16,
    color: colors.textGold,
  },
  closeText: {
    fontSize: 20,
    color: colors.textSecondary,
    padding: 4,
  },
  roomName: {
    fontFamily: 'MedievalSharp',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  maxLevel: {
    fontFamily: 'Cinzel',
    fontSize: 14,
    color: colors.gold,
    textAlign: 'center',
    paddingVertical: 10,
  },
  costSection: {
    marginBottom: 12,
  },
  costTitle: {
    fontFamily: 'Cinzel',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  costGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  costItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  costIcon: {
    fontSize: 16,
  },
  costAmount: {
    fontFamily: 'Cinzel',
    fontSize: 13,
    color: colors.textPrimary,
  },
  costInsufficient: {
    color: colors.healthRedBright,
  },
  upgradeBtn: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gold + '40',
  },
  upgradeBtnDisabled: {
    backgroundColor: colors.buttonDisabled,
    borderColor: colors.textDim + '40',
  },
  upgradeBtnText: {
    fontFamily: 'MedievalSharp',
    fontSize: 16,
    color: colors.textGold,
  },
});

export default UpgradePanel;
