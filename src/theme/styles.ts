import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const commonStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  medievalText: {
    color: colors.textGold,
    fontFamily: 'MedievalSharp',
  },
  bodyText: {
    color: colors.textPrimary,
    fontFamily: 'Cinzel',
    fontSize: 14,
  },
  medievalPanel: {
    backgroundColor: colors.cardBg,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  medievalButton: {
    backgroundColor: colors.buttonPrimary,
    borderWidth: 2,
    borderColor: colors.gold,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  medievalButtonText: {
    color: colors.textGold,
    fontFamily: 'MedievalSharp',
    fontSize: 16,
  },
});
