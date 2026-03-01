import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface MedievalFrameProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'gold' | 'arcane';
}

const MedievalFrame: React.FC<MedievalFrameProps> = ({
  children,
  style,
  variant = 'default',
}) => {
  const borderColor =
    variant === 'gold'
      ? colors.gold + '50'
      : variant === 'arcane'
        ? colors.arcaneGlow + '40'
        : colors.gold + '30';

  return (
    <View style={[styles.frame, { borderColor }, style]}>
      {/* Corner ornaments */}
      <View style={[styles.corner, styles.cornerTL, { borderColor }]} />
      <View style={[styles.corner, styles.cornerTR, { borderColor }]} />
      <View style={[styles.corner, styles.cornerBL, { borderColor }]} />
      <View style={[styles.corner, styles.cornerBR, { borderColor }]} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    backgroundColor: 'rgba(16, 16, 30, 0.85)',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  corner: {
    position: 'absolute',
    width: 14,
    height: 14,
  },
  cornerTL: {
    top: -1,
    left: -1,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: -1,
    right: -1,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: -1,
    left: -1,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: -1,
    right: -1,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 12,
  },
});

export default MedievalFrame;
