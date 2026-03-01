import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface MedievalFrameProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const MedievalFrame: React.FC<MedievalFrameProps> = ({ children, style }) => {
  return <View style={[styles.frame, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  frame: {
    backgroundColor: colors.cardBg,
    borderWidth: 2,
    borderColor: colors.gold + '60',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default MedievalFrame;
