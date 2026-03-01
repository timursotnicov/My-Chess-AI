import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { OfflineFinding } from '../../types';
import { colors } from '../../theme/colors';

interface WelcomeBackModalProps {
  visible: boolean;
  findings: OfflineFinding[];
  onClose: () => void;
}

const FINDING_ICONS: Record<string, string> = {
  resource: '📦',
  event: '👤',
  mood_change: '💭',
};

const WelcomeBackModal: React.FC<WelcomeBackModalProps> = ({ visible, findings, onClose }) => {
  const { t } = useTranslation();

  if (findings.length === 0 && visible) {
    onClose();
    return null;
  }

  return (
    <Modal
      visible={visible && findings.length > 0}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{t('daily.welcome_back')}</Text>
          <Text style={styles.subtitle}>{t('daily.world_lived')}</Text>

          <ScrollView style={styles.findingsList}>
            {findings.map((finding, i) => (
              <View key={i} style={styles.findingItem}>
                <Text style={styles.findingIcon}>
                  {FINDING_ICONS[finding.type] || '✨'}
                </Text>
                <View style={styles.findingInfo}>
                  <Text style={styles.findingText}>
                    {t(finding.descriptionKey)}
                  </Text>
                  {finding.value !== undefined && finding.resourceType && (
                    <Text style={styles.findingValue}>
                      +{finding.value} {finding.resourceType}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>{t('common.continue')}</Text>
          </TouchableOpacity>
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
    maxHeight: '80%',
    backgroundColor: colors.darkSlate,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.gold + '40',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'MedievalSharp',
    fontSize: 24,
    color: colors.textGold,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Cinzel',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  findingsList: {
    width: '100%',
    maxHeight: 300,
  },
  findingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.charcoal,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  findingIcon: {
    fontSize: 24,
  },
  findingInfo: {
    flex: 1,
  },
  findingText: {
    fontFamily: 'Cinzel',
    fontSize: 12,
    color: colors.textPrimary,
  },
  findingValue: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.arcaneGlow,
    marginTop: 2,
  },
  closeBtn: {
    marginTop: 16,
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold + '60',
  },
  closeBtnText: {
    fontFamily: 'MedievalSharp',
    fontSize: 18,
    color: colors.textGold,
  },
});

export default WelcomeBackModal;
