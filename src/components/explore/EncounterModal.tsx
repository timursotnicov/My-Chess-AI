import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { EncounterDefinition } from '../../types';
import { colors } from '../../theme/colors';

interface EncounterModalProps {
  encounter: EncounterDefinition | null;
  onChoice: (index: number) => void;
  onClose: () => void;
}

const ENCOUNTER_ICONS: Record<string, string> = {
  discovery: '🔍',
  challenge: '⚔️',
  mystery: '🌀',
  treasure: '💰',
  creature: '🐾',
};

const EncounterModal: React.FC<EncounterModalProps> = ({ encounter, onChoice, onClose }) => {
  const { t } = useTranslation();

  if (!encounter) return null;

  return (
    <Modal
      visible={!!encounter}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.typeIcon}>
            {ENCOUNTER_ICONS[encounter.type] || '❓'}
          </Text>
          <Text style={styles.title}>{t(encounter.titleKey)}</Text>
          <Text style={styles.description}>{t(encounter.descriptionKey)}</Text>

          <View style={styles.choices}>
            {encounter.choices.map((choice, i) => (
              <TouchableOpacity
                key={i}
                style={styles.choiceBtn}
                onPress={() => onChoice(i)}
              >
                <Text style={styles.choiceBtnText}>{t(choice.labelKey)}</Text>
                {choice.rewards && choice.rewards.length > 0 && (
                  <Text style={styles.choiceReward}>
                    {choice.rewards.map((r) => `+${r.amount ?? 1} ${r.id ?? r.type}`).join(', ')}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    backgroundColor: colors.darkSlate,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.arcane + '60',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'MedievalSharp',
    fontSize: 22,
    color: colors.textGold,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontFamily: 'Cinzel',
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  choices: {
    width: '100%',
    gap: 10,
  },
  choiceBtn: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gold + '30',
    alignItems: 'center',
  },
  choiceBtnText: {
    fontFamily: 'MedievalSharp',
    fontSize: 16,
    color: colors.textPrimary,
  },
  choiceReward: {
    fontFamily: 'Cinzel',
    fontSize: 10,
    color: colors.arcaneGlow,
    marginTop: 4,
  },
});

export default EncounterModal;
