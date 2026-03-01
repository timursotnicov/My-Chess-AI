import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShelterView from '../components/shelter/ShelterView';
import RoomCard from '../components/shelter/RoomCard';
import UpgradePanel from '../components/shelter/UpgradePanel';
import { useShelterStore } from '../store/shelterStore';
import { SHELTER_ROOMS } from '../data/shelterRooms';
import { RoomType } from '../types';
import { colors } from '../theme/colors';

const ShelterScreen: React.FC = () => {
  const { t } = useTranslation();
  const shelter = useShelterStore((s) => s.shelter);
  const upgradeRoom = useShelterStore((s) => s.upgradeRoom);
  const unlockRoom = useShelterStore((s) => s.unlockRoom);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);

  const selectedRoomState = selectedRoom
    ? shelter.rooms.find((r) => r.id === selectedRoom)
    : null;
  const selectedRoomDef = selectedRoom
    ? SHELTER_ROOMS.find((r) => r.id === selectedRoom)
    : null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('shelter.title')}</Text>
          <View style={styles.resourceBar}>
            <Text style={styles.resourceText}>🪨 {shelter.resources.stone}</Text>
            <Text style={styles.resourceText}>🪵 {shelter.resources.wood}</Text>
            <Text style={styles.resourceText}>🌿 {shelter.resources.herbs}</Text>
            <Text style={styles.resourceText}>💎 {shelter.resources.crystals}</Text>
          </View>
        </View>

        {/* Shelter SVG visualization */}
        <ShelterView
          rooms={shelter.rooms}
          onRoomPress={setSelectedRoom}
          selectedRoom={selectedRoom}
        />

        {/* Room cards grid */}
        <ScrollView style={styles.roomsList} contentContainerStyle={styles.roomsContent}>
          {SHELTER_ROOMS.map((roomDef) => {
            const roomState = shelter.rooms.find((r) => r.id === roomDef.id);
            if (!roomState) return null;
            return (
              <RoomCard
                key={roomDef.id}
                definition={roomDef}
                state={roomState}
                isSelected={selectedRoom === roomDef.id}
                onPress={() => setSelectedRoom(roomDef.id)}
              />
            );
          })}
        </ScrollView>

        {/* Upgrade panel */}
        {selectedRoom && selectedRoomState && selectedRoomDef && (
          <UpgradePanel
            definition={selectedRoomDef}
            state={selectedRoomState}
            resources={shelter.resources}
            onUpgrade={() => {
              if (selectedRoomState.isUnlocked) {
                upgradeRoom(selectedRoom);
              } else {
                unlockRoom(selectedRoom);
              }
            }}
            onClose={() => setSelectedRoom(null)}
          />
        )}
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
    marginBottom: 6,
  },
  resourceBar: {
    flexDirection: 'row',
    gap: 12,
  },
  resourceText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: 'Cinzel',
  },
  roomsList: {
    flex: 1,
  },
  roomsContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 10,
  },
});

export default ShelterScreen;
