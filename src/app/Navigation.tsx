import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import StartScreen from '../screens/StartScreen';
import HomeScreen from '../screens/HomeScreen';
import ShelterScreen from '../screens/ShelterScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BottomTabBar, { TabId } from '../components/ui/BottomTabBar';
import { usePetStore } from '../store/petStore';
import { useShelterStore } from '../store/shelterStore';
import { useExplorationStore } from '../store/explorationStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useDailyStore } from '../store/dailyStore';
import { useProfileStore } from '../store/profileStore';
import { loadGame } from '../utils/storage';
import { colors } from '../theme/colors';

type Screen = 'start' | 'game';

const Navigation: React.FC = () => {
  const dragon = usePetStore((s) => s.dragon);
  const setDragon = usePetStore((s) => s.setDragon);
  const setHasExistingSave = usePetStore((s) => s.setHasExistingSave);
  const processOfflineTime = usePetStore((s) => s.processOfflineTime);
  const setShelter = useShelterStore((s) => s.setShelter);
  const setLocations = useExplorationStore((s) => s.setLocations);
  const setExpedition = useExplorationStore((s) => s.setExpedition);
  const setInventory = useInventoryStore((s) => s.setInventory);
  const setCollections = useInventoryStore((s) => s.setCollections);
  const setDaily = useDailyStore((s) => s.setDaily);
  const setProfile = useProfileStore((s) => s.setProfile);
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [activeTab, setActiveTab] = useState<TabId>('home');

  useEffect(() => {
    const checkSave = async () => {
      const save = await loadGame();
      if (save) {
        setHasExistingSave(true);
      }
    };
    checkSave();
  }, []);

  const handleStartGame = () => {
    setCurrentScreen('game');
  };

  const handleLoadGame = async () => {
    const save = await loadGame();
    if (save) {
      const elapsed = Date.now() - save.timestamp;
      setDragon(save.dragon, save.cooldowns);
      setShelter(save.shelter);
      setLocations(save.locations);
      setExpedition(save.expedition);
      setInventory(save.inventory);
      setCollections(save.collections);
      setDaily(save.daily);
      setProfile(save.profile);
      if (elapsed > 60000) {
        processOfflineTime(elapsed);
      }
      setCurrentScreen('game');
    }
  };

  if (currentScreen === 'start') {
    return (
      <StartScreen
        onStartGame={handleStartGame}
        onLoadGame={handleLoadGame}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.screenArea}>
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'shelter' && <ShelterScreen />}
        {activeTab === 'explore' && <ExploreScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </View>
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  screenArea: {
    flex: 1,
  },
});

export default Navigation;
