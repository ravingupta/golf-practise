import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { database } from '../../database';
import Shot from '../../model/Shot';


export default function HomeScreen() {
  const [club, setClub] = useState('Driver');
  const [direction, setDirection] = useState('Center');
  const [expectation, setExpectation] = useState('Straight');
  const [actual, setActual] = useState('Straight');
  const [distance, setDistance] = useState('');
  const [recentShots, setRecentShots] = useState<any[]>([]);

  const handleSave = async () => {
    try {
      const shotTime = Date.now();
      let newShot;
      await database.write(async () => {
        newShot = await database.get<Shot>('shots').create((shot) => {
          shot.club = club;
          shot.direction = direction;
          shot.expectation = expectation;
          shot.actual = actual;
          shot.distance = Number(distance);
          shot.timestamp = shotTime;
        });
      });
      setClub('Driver');
      setDirection('Center');
      setExpectation('Straight');
      setActual('Straight');
      setDistance('');
      setRecentShots((prev) => [{
        club,
        direction,
        expectation,
        actual,
        distance,
        timestamp: shotTime,
      }, ...prev].slice(0, 5));
    } catch (e) {
      alert('Error saving shot: ' + e);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#181c20' }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View>
        <View style={styles.headerContainer}>
          <Image
            source={require('@/assets/images/splash-icon.png')}
            style={styles.golfLogo}
          />
          <Text style={styles.golfTitle}>Golf Range Practice</Text>
          <Text style={styles.golfSubtitle}>Track your driving range shots</Text>
        </View>
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <MaterialCommunityIcons name="golf" size={28} color="#4caf50" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>Record a Shot</Text>
          </View>
          <View style={{ gap: 12 }}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Club</Text>
              <Picker
                selectedValue={club}
                onValueChange={setClub}
                style={styles.picker}
                dropdownIconColor="#4caf50"
              >
                <Picker.Item label="Driver" value="Driver" />
                <Picker.Item label="3 Wood" value="3 Wood" />
                <Picker.Item label="5 Wood" value="5 Wood" />
                <Picker.Item label="3 Iron" value="3 Iron" />
                <Picker.Item label="4 Iron" value="4 Iron" />
                <Picker.Item label="5 Iron" value="5 Iron" />
                <Picker.Item label="6 Iron" value="6 Iron" />
                <Picker.Item label="7 Iron" value="7 Iron" />
                <Picker.Item label="8 Iron" value="8 Iron" />
                <Picker.Item label="9 Iron" value="9 Iron" />
                <Picker.Item label="PW" value="PW" />
                <Picker.Item label="SW" value="SW" />
                <Picker.Item label="Putter" value="Putter" />
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Direction</Text>
              <Picker
                selectedValue={direction}
                onValueChange={setDirection}
                style={styles.picker}
                dropdownIconColor="#4caf50"
              >
                <Picker.Item label="Left" value="Left" />
                <Picker.Item label="Center" value="Center" />
                <Picker.Item label="Right" value="Right" />
                <Picker.Item label="High" value="High" />
                <Picker.Item label="Low" value="Low" />
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Expectation</Text>
              <Picker
                selectedValue={expectation}
                onValueChange={setExpectation}
                style={styles.picker}
                dropdownIconColor="#4caf50"
              >
                <Picker.Item label="Straight" value="Straight" />
                <Picker.Item label="Fade" value="Fade" />
                <Picker.Item label="Draw" value="Draw" />
                <Picker.Item label="Slice" value="Slice" />
                <Picker.Item label="Hook" value="Hook" />
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Actual</Text>
              <Picker
                selectedValue={actual}
                onValueChange={setActual}
                style={styles.picker}
                dropdownIconColor="#4caf50"
              >
                <Picker.Item label="Straight" value="Straight" />
                <Picker.Item label="Fade" value="Fade" />
                <Picker.Item label="Draw" value="Draw" />
                <Picker.Item label="Slice" value="Slice" />
                <Picker.Item label="Hook" value="Hook" />
              </Picker>
            </View>
            <TextInput
              placeholder="Distance (yards/meters)"
              placeholderTextColor="#888"
              value={distance}
              onChangeText={setDistance}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button title="Record Shot" color="#4caf50" onPress={handleSave} />
          </View>
        </View>
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <MaterialCommunityIcons name="clipboard-list-outline" size={28} color="#4caf50" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>Recent Shots</Text>
          </View>
          {recentShots.length === 0 ? (
            <Text style={{ color: '#888', fontStyle: 'italic' }}>No shots recorded yet.</Text>
          ) : (
            recentShots.map((shot, idx) => (
              <View key={idx} style={styles.shotRow}>
                <MaterialCommunityIcons name="golf" size={20} color="#4caf50" style={{ marginRight: 6 }} />
                <Text style={styles.shotText}>{shot.club} | {shot.direction} | {shot.expectation} | {shot.actual} | {shot.distance}m | {new Date(shot.timestamp).toLocaleString()}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: '#181c20',
  },
  golfLogo: {
    width: 80,
    height: 80,
    marginBottom: 8,
    tintColor: '#4caf50',
  },
  golfTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  golfSubtitle: {
    fontSize: 16,
    color: '#bbb',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#23272b',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#181c20',
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    marginBottom: 8,
  },
  pickerLabel: {
    color: '#fff',
    marginBottom: 4,
    fontSize: 15,
    fontWeight: 'bold',
  },
  picker: {
    backgroundColor: '#23272b',
    color: '#fff',
    borderRadius: 8,
    marginBottom: 4,
  },
  shotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  shotText: {
    fontSize: 15,
    color: '#fff',
  },
});
