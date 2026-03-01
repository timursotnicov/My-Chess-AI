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
  const bgColor =
    variant === 'gold'
      ? colors.gold
      : variant === 'secondary'
        ? colors.buttonSecondary
        : colors.buttonPrimary;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[size],
        { backgroundColor: disabled ? colors.buttonDisabled : bgColor },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <View>
        <Text
          style={[
            styles.text,
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
    borderWidth: 2,
    borderColor: colors.gold,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
  },
  small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 70,
  },
  medium: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 100,
  },
  large: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    minWidth: 200,
  },
  disabled: {
    opacity: 0.5,
    borderColor: colors.buttonDisabled,
  },
  icon: {
    fontSize: 18,
    marginRight: 6,
  },
  text: {
    fontFamily: 'MedievalSharp',
    fontSize: 16,
    color: colors.textGold,
    textAlign: 'center',
  },
  smallText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 20,
  },
  subtitle: {
    fontFamily: 'Cinzel',
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default MedievalButton;
