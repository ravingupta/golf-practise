import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Button, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { database } from '../../database';
import Shot from '../../model/Shot';

export default function RecordScreen() {
  const [club, setClub] = useState('Driver');
  const [lateralDirection, setLateralDirection] = useState('Center');
  const [inclination, setInclination] = useState('Center');
  const [expectation, setExpectation] = useState('Straight');
  const [actual, setActual] = useState('Straight');
  const [distance, setDistance] = useState('');
  const [carry, setCarry] = useState('');
  const [distanceUnit, setDistanceUnit] = useState('Yards');
  const [carryUnit, setCarryUnit] = useState('Yards');
  const [lie, setLie] = useState('Fairway');
  const [wind, setWind] = useState('None');
  const [notes, setNotes] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [currentSetter, setCurrentSetter] = useState<(value: string) => void>(() => {});

  const clubOptions = ['Driver', '3 Wood', '5 Wood', '3 Iron', '4 Iron', '5 Iron', '6 Iron', '7 Iron', '8 Iron', '9 Iron', 'PW', 'SW', 'Putter'];
  const lieOptions = ['Fairway', 'Rough', 'Sand', 'Tee Box'];
  const windOptions = ['None', 'Light Head', 'Strong Head', 'Light Tail', 'Strong Tail', 'Cross Left', 'Cross Right'];
  const directionOptions = ['Left', 'Center', 'Right'];
  const inclinationOptions = ['Low', 'Center', 'High'];
  const shotShapeOptions = ['Straight', 'Fade', 'Draw', 'Slice', 'Hook'];
  const unitOptions = ['Yards', 'Meters'];

  const openDropdown = (field: string, options: string[], setter: (value: string) => void, currentValue: string) => {
    setCurrentField(field);
    setCurrentOptions(options);
    setCurrentSetter(() => setter);
    setModalVisible(true);
  };

  const selectOption = (value: string) => {
    currentSetter(value);
    setModalVisible(false);
  };

  const handleSave = async () => {
    try {
      const shotTime = Date.now();
      
      // Convert distances to yards for consistent storage
      const distanceInYards = distanceUnit === 'Meters' ? Number(distance) * 1.09361 : Number(distance);
      const carryInYards = carryUnit === 'Meters' ? Number(carry) * 1.09361 : Number(carry);
      
      await database.write(async () => {
        await database.get<Shot>('shots').create((shot) => {
          shot.club = club;
          shot.direction = `${lateralDirection}-${inclination}`; // legacy compatibility
          shot.lateralDirection = lateralDirection;
          shot.inclination = inclination;
          shot.expectation = expectation;
          shot.actual = actual;
          shot.distance = distanceInYards;
          shot.carry = carryInYards;
          shot.total = distanceInYards;
          shot.lie = lie;
          shot.wind = wind;
          shot.notes = notes;
          shot.timestamp = shotTime;
        });
      });
      // Reset form
      setClub('Driver');
      setLateralDirection('Center');
      setInclination('Center');
      setExpectation('Straight');
      setActual('Straight');
      setDistance('');
      setCarry('');
      setDistanceUnit('Yards');
      setCarryUnit('Yards');
      setLie('Fairway');
      setWind('None');
      setNotes('');
      alert('Shot recorded successfully!');
    } catch (e) {
      alert('Error saving shot: ' + e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: '#181c20' }}
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <View style={styles.headerContainer}>
            <Image
              source={require('@/assets/images/splash-icon.png')}
              style={styles.golfLogo}
            />
            <Text style={styles.golfTitle}>Record Shot</Text>
            <Text style={styles.golfSubtitle}>Log your driving range shots</Text>
          </View>
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <MaterialCommunityIcons name="golf" size={28} color="#4caf50" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Record a Shot</Text>
            </View>
            <View style={{ marginBottom: 12 }}>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Club</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => openDropdown('Club', clubOptions, setClub, club)}
                >
                  <Text style={styles.dropdownText}>{club}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <View style={[styles.pickerContainer, { flex: 1, marginRight: 6 }]}>
                  <Text style={styles.pickerLabel}>Lie</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => openDropdown('Lie', lieOptions, setLie, lie)}
                  >
                    <Text style={styles.dropdownText}>{lie}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                  </TouchableOpacity>
                </View>
                <View style={[styles.pickerContainer, { flex: 1, marginLeft: 6 }]}>
                  <Text style={styles.pickerLabel}>Wind</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => openDropdown('Wind', windOptions, setWind, wind)}
                  >
                    <Text style={styles.dropdownText}>{wind}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.pickerContainer, { flex: 1, marginRight: 6 }]}>
                  <Text style={styles.pickerLabel}>Lateral Direction</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => openDropdown('Lateral Direction', directionOptions, setLateralDirection, lateralDirection)}
                  >
                    <Text style={styles.dropdownText}>{lateralDirection}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                  </TouchableOpacity>
                </View>
                <View style={[styles.pickerContainer, { flex: 1, marginLeft: 6 }]}>
                  <Text style={styles.pickerLabel}>Inclination</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => openDropdown('Inclination', inclinationOptions, setInclination, inclination)}
                  >
                    <Text style={styles.dropdownText}>{inclination}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.pickerContainer, { flex: 1, marginRight: 6 }]}>
                  <Text style={styles.pickerLabel}>Expectation</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => openDropdown('Expectation', shotShapeOptions, setExpectation, expectation)}
                  >
                    <Text style={styles.dropdownText}>{expectation}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                  </TouchableOpacity>
                </View>
                <View style={[styles.pickerContainer, { flex: 1, marginLeft: 6 }]}>
                  <Text style={styles.pickerLabel}>Actual</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => openDropdown('Actual', shotShapeOptions, setActual, actual)}
                  >
                    <Text style={styles.dropdownText}>{actual}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Total Distance</Text>
                <View style={styles.row}>
                  <TextInput
                    placeholder="distance"
                    placeholderTextColor="#888"
                    value={distance}
                    onChangeText={setDistance}
                    keyboardType="numeric"
                    style={[styles.input, { flex: 1, marginRight: 6 }]}
                  />
                  <TouchableOpacity
                    style={[styles.dropdown, { flex: 0.4 }]}
                    onPress={() => openDropdown('Total Distance Unit', unitOptions, setDistanceUnit, distanceUnit)}
                  >
                    <Text style={styles.dropdownText}>{distanceUnit}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Carry Distance</Text>
                <View style={styles.row}>
                  <TextInput
                    placeholder="distance"
                    placeholderTextColor="#888"
                    value={carry}
                    onChangeText={setCarry}
                    keyboardType="numeric"
                    style={[styles.input, { flex: 1, marginRight: 6 }]}
                  />
                  <TouchableOpacity
                    style={[styles.dropdown, { flex: 0.4 }]}
                    onPress={() => openDropdown('Carry Distance Unit', unitOptions, setCarryUnit, carryUnit)}
                  >
                    <Text style={styles.dropdownText}>{carryUnit}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Notes (optional)</Text>
                <TextInput
                  placeholder="Any additional notes..."
                  placeholderTextColor="#888"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={2}
                  style={[styles.input, styles.notesInput]}
                />
              </View>

              <Button title="Record Shot" color="#4caf50" onPress={handleSave} />

              <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{currentField}</Text>
                    <FlatList
                      data={currentOptions}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.modalOption}
                          onPress={() => selectOption(item)}
                        >
                          <Text style={styles.modalOptionText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                    />
                    <TouchableOpacity
                      style={styles.modalClose}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.modalCloseText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginHorizontal: 12,
    marginVertical: 12,
    padding: 16,
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
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  pickerContainer: {
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    backgroundColor: '#23272b',
    overflow: 'hidden',
  },
  pickerLabel: {
    color: '#fff',
    marginBottom: 4,
    fontSize: 15,
    fontWeight: 'bold',
  },
  picker: {
    color: '#fff',
    height: 50,
    backgroundColor: '#23272b',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
  },
  inputContainer: {
    marginBottom: 8,
  },
  inputLabel: {
    color: '#fff',
    marginBottom: 4,
    fontSize: 15,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#181c20',
    color: '#fff',
    fontSize: 16,
  },
  notesInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    backgroundColor: '#23272b',
    paddingHorizontal: 10,
    paddingVertical: 12,
    height: 50,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#23272b',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  modalClose: {
    marginTop: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#4caf50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
