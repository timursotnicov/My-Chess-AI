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
  { id: 'home', icon: '🏠', labelKey: 'tabs.home' },
  { id: 'shelter', icon: '🏰', labelKey: 'tabs.shelter' },
  { id: 'explore', icon: '🗺️', labelKey: 'tabs.explore' },
  { id: 'profile', icon: '👤', labelKey: 'tabs.profile' },
];

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {t(tab.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.tabBarBg,
    borderTopWidth: 1,
    borderTopColor: colors.gold + '20',
    paddingBottom: 20, // safe area bottom
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  tabActive: {},
  icon: {
    fontSize: 20,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontFamily: 'Cinzel',
    fontSize: 9,
    color: colors.tabBarInactive,
  },
  labelActive: {
    color: colors.tabBarActive,
  },
});

export default BottomTabBar;
