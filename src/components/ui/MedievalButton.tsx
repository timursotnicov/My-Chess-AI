import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';

interface MedievalButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'gold';
  subtitle?: string;
}

const MedievalButton: React.FC<MedievalButtonProps> = ({
  title,
  onPress,
  disabled = false,
  icon,
  size = 'medium',
  variant = 'primary',
  subtitle,
}) => {
  const isGold = variant === 'gold';
  const isSecondary = variant === 'secondary';

  const bgColor = isGold
    ? '#5C4320'
    : isSecondary
      ? colors.buttonSecondary
      : colors.buttonPrimary;

  const borderColor = isGold
    ? colors.gold
    : isSecondary
      ? colors.silver + '50'
      : colors.arcaneGlow + '50';

  const textColor = isGold
    ? '#FFD875'
    : isSecondary
      ? colors.textPrimary
      : colors.moonlight;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[size],
        {
          backgroundColor: disabled ? colors.buttonDisabled : bgColor,
          borderColor: disabled ? colors.buttonDisabled : borderColor,
        },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {/* Top highlight shine */}
      <View
        style={[
          styles.shine,
          {
            backgroundColor: isGold
              ? 'rgba(255, 216, 117, 0.12)'
              : isSecondary
                ? 'rgba(160, 160, 184, 0.08)'
                : 'rgba(155, 111, 208, 0.1)',
          },
        ]}
      />

      {icon && (
        <Text style={[styles.icon, size === 'small' && styles.iconSmall]}>
          {icon}
        </Text>
      )}
      <View>
        <Text
          style={[
            styles.text,
            { color: disabled ? colors.textDim : textColor },
            size === 'small' && styles.smallText,
            size === 'large' && styles.largeText,
          ]}
        >
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    minWidth: 80,
    borderRadius: 8,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 130,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    minWidth: 240,
  },
  disabled: {
    opacity: 0.4,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  iconSmall: {
    fontSize: 16,
    marginRight: 6,
  },
  text: {
    fontFamily: 'MedievalSharp',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  smallText: {
    fontSize: 13,
  },
  largeText: {
    fontSize: 21,
  },
  subtitle: {
    fontFamily: 'Cinzel',
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    opacity: 0.8,
    marginTop: 1,
  },
});

export default MedievalButton;
