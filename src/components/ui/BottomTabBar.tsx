import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';

export type TabId = 'home' | 'shelter' | 'explore' | 'profile';

interface BottomTabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; icon: string; labelKey: string }[] = [
  { id: 'home', icon: '🐉', labelKey: 'tabs.home' },
  { id: 'shelter', icon: '🏰', labelKey: 'tabs.shelter' },
  { id: 'explore', icon: '🗺️', labelKey: 'tabs.explore' },
  { id: 'profile', icon: '📜', labelKey: 'tabs.profile' },
];

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Ornate top border */}
      <View style={styles.topBorder}>
        <View style={styles.borderLineLeft} />
        <View style={styles.borderGem} />
        <View style={styles.borderLineRight} />
      </View>

      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
            >
              {isActive && <View style={styles.activeGlow} />}
              <Text style={[styles.icon, isActive && styles.iconActive]}>
                {tab.icon}
              </Text>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {t(tab.labelKey)}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(8, 8, 18, 0.95)',
  },
  topBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 3,
  },
  borderLineLeft: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gold + '40',
  },
  borderGem: {
    width: 6,
    height: 6,
    backgroundColor: colors.gold + '60',
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 4,
    marginTop: -2,
  },
  borderLineRight: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gold + '40',
  },
  tabRow: {
    flexDirection: 'row',
    paddingBottom: 24,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  tabActive: {},
  activeGlow: {
    position: 'absolute',
    top: 0,
    width: 50,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gold + '10',
  },
  icon: {
    fontSize: 22,
    opacity: 0.4,
  },
  iconActive: {
    opacity: 1,
    fontSize: 24,
  },
  label: {
    fontFamily: 'Cinzel',
    fontSize: 10,
    color: colors.tabBarInactive,
  },
  labelActive: {
    color: colors.tabBarActive,
    fontWeight: 'bold',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gold,
    marginTop: 2,
  },
});

export default BottomTabBar;
