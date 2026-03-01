import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import WorldMap from '../components/explore/WorldMap';
import LocationCard from '../components/explore/LocationCard';
import ExpeditionProgress from '../components/explore/ExpeditionProgress';
import EncounterModal from '../components/explore/EncounterModal';
import { useExplorationStore } from '../store/explorationStore';
import { usePetStore } from '../store/petStore';
import { useShelterStore } from '../store/shelterStore';
import { useInventoryStore } from '../store/inventoryStore';
import { LOCATIONS } from '../data/locations';
import { getRandomEncounter } from '../data/encounters';
import { generateExpeditionRewards } from '../systems/explorationSystem';
import { LocationId, EncounterDefinition, ResourceType } from '../types';
import { colors } from '../theme/colors';

const ExploreScreen: React.FC = () => {
  const { t } = useTranslation();
  const dragon = usePetStore((s) => s.dragon);
  const locations = useExplorationStore((s) => s.locations);
  const expedition = useExplorationStore((s) => s.expedition);
  const startExpedition = useExplorationStore((s) => s.startExpedition);
  const updateExpedition = useExplorationStore((s) => s.updateExpedition);
  const completeExpedition = useExplorationStore((s) => s.completeExpedition);
  const unlockLocation = useExplorationStore((s) => s.unlockLocation);
  const addResource = useShelterStore((s) => s.addResource);
  const addItem = useInventoryStore((s) => s.addItem);

  const [activeEncounter, setActiveEncounter] = useState<EncounterDefinition | null>(null);

  // Check for location unlocks
  useEffect(() => {
    if (!dragon) return;
    for (const locDef of LOCATIONS) {
      const locState = locations.find((l) => l.id === locDef.id);
      if (locState && !locState.isUnlocked) {
        if (dragon.level >= locDef.unlockLevel && dragon.bond.level >= locDef.unlockBond) {
          unlockLocation(locDef.id);
        }
      }
    }
  }, [dragon?.level, dragon?.bond.level]);

  // Update expedition progress
  useEffect(() => {
    if (!expedition || expedition.status === 'completed') return;
    const interval = setInterval(updateExpedition, 5000);
    return () => clearInterval(interval);
  }, [expedition?.status]);

  const handleStartExpedition = (locationId: LocationId) => {
    if (expedition && expedition.status !== 'completed') {
      Alert.alert(t('explore.busy'), t('explore.busy_desc'));
      return;
    }
    startExpedition(locationId);
  };

  const handleCompleteExpedition = () => {
    if (!expedition) return;

    const locState = locations.find((l) => l.id === expedition.locationId);
    const rewards = generateExpeditionRewards(
      expedition.locationId,
      locState?.explorationProgress ?? 0,
    );

    // Trigger encounter chance
    const encounter = getRandomEncounter(
      expedition.locationId,
      locState?.explorationProgress ?? 0,
    );
    if (encounter) {
      setActiveEncounter(encounter);
    }

    // Apply rewards
    for (const reward of rewards) {
      if (reward.type === 'resource' && reward.id && reward.amount) {
        addResource(reward.id as ResourceType, reward.amount);
      } else if (reward.type === 'item' && reward.id) {
        addItem(reward.id);
      }
    }

    completeExpedition();
  };

  const handleEncounterChoice = (choiceIndex: number) => {
    if (!activeEncounter) return;
    const choice = activeEncounter.choices[choiceIndex];
    if (choice.rewards) {
      for (const reward of choice.rewards) {
        if (reward.type === 'resource' && reward.id && reward.amount) {
          addResource(reward.id as ResourceType, reward.amount);
        } else if (reward.type === 'item' && reward.id) {
          addItem(reward.id);
        }
      }
    }
    setActiveEncounter(null);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('explore.title')}</Text>
        </View>

        {/* World map */}
        <WorldMap
          locations={locations}
          onLocationPress={handleStartExpedition}
        />

        {/* Active expedition */}
        {expedition && (
          <ExpeditionProgress
            expedition={expedition}
            onComplete={handleCompleteExpedition}
          />
        )}

        {/* Location cards */}
        <ScrollView style={styles.locationsList} contentContainerStyle={styles.locationsContent}>
          {LOCATIONS.map((locDef) => {
            const locState = locations.find((l) => l.id === locDef.id);
            if (!locState) return null;
            return (
              <LocationCard
                key={locDef.id}
                definition={locDef}
                state={locState}
                isExpeditionActive={expedition?.locationId === locDef.id}
                onExplore={() => handleStartExpedition(locDef.id)}
              />
            );
          })}
        </ScrollView>

        {/* Encounter modal */}
        <EncounterModal
          encounter={activeEncounter}
          onChoice={handleEncounterChoice}
          onClose={() => setActiveEncounter(null)}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    fontFamily: 'MedievalSharp',
    fontSize: 24,
    color: colors.textGold,
  },
  locationsList: {
    flex: 1,
  },
  locationsContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 10,
  },
});

export default ExploreScreen;
