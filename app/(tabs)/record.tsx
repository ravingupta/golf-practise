import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Q } from '@nozbe/watermelondb';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  const [lie, setLie] = useState('Tee Box');
  const [wind, setWind] = useState('None');
  const [notes, setNotes] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [currentSetter, setCurrentSetter] = useState<(value: string) => void>(() => {});
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [currentInfoField, setCurrentInfoField] = useState('');
  const [currentInfoDescription, setCurrentInfoDescription] = useState('');
  
  // New fields for different modes
  const [mode, setMode] = useState<'driving_range' | 'golf_course'>('driving_range');
  const [holeNumber, setHoleNumber] = useState('');
  const [par, setPar] = useState('4');
  const [score, setScore] = useState('');
  const [pinPosition, setPinPosition] = useState('Center');
  const [greenSpeed, setGreenSpeed] = useState('Medium');
  const [practiceType, setPracticeType] = useState('Full Swing');
  const [targetDistance, setTargetDistance] = useState('');

  // Load last shot data when component mounts or mode changes
  useEffect(() => {
    loadLastShot();
  }, [mode]);

  const loadLastShot = async () => {
    try {
      const lastShot = await database.get<Shot>('shots').query(
        Q.where('mode', mode),
        Q.sortBy('timestamp', Q.desc),
        Q.take(1)
      ).fetch();

      if (lastShot.length > 0) {
        const shot = lastShot[0];
        
        // Prefill common fields
        setClub(shot.club);
        setLateralDirection(shot.lateralDirection);
        setInclination(shot.inclination);
        setExpectation(shot.expectation);
        setActual(shot.actual);
        setWind(shot.wind);
        setNotes(shot.notes || '');
        
        // Convert distances back to display format (assuming yards stored, show in yards)
        const distanceInYards = shot.distance;
        const carryInYards = shot.carry;
        setDistance(distanceInYards > 0 ? distanceInYards.toString() : '');
        setCarry(carryInYards > 0 ? carryInYards.toString() : '');
        setDistanceUnit('Yards');
        setCarryUnit('Yards');
        
        // Prefill mode-specific fields
        if (mode === 'golf_course') {
          setLie(shot.lie);
          setHoleNumber(shot.holeNumber > 0 ? shot.holeNumber.toString() : '');
          setPar(shot.par.toString());
          setScore(shot.score > 0 ? shot.score.toString() : '');
          setPinPosition(shot.pinPosition);
          setGreenSpeed(shot.greenSpeed);
        } else {
          setLie('Tee Box'); // Default for driving range
          setPracticeType(shot.practiceType);
          setTargetDistance(shot.targetDistance > 0 ? shot.targetDistance.toString() : '');
        }
      }
    } catch (error) {
      console.log('No previous shots found for this mode');
    }
  };

  const clubOptions = ['Driver', '3 Wood', '5 Wood', '3 Iron', '4 Iron', '5 Iron', '6 Iron', '7 Iron', '8 Iron', '9 Iron', 'PW', 'SW', 'Putter'];
  const lieOptions = ['Fairway', 'Rough', 'Sand', 'Tee Box'];
  const windOptions = ['None', 'Light Head', 'Strong Head', 'Light Tail', 'Strong Tail', 'Cross Left', 'Cross Right'];
  const directionOptions = ['Left', 'Center', 'Right'];
  const inclinationOptions = ['Low', 'Center', 'High'];
  const shotShapeOptions = ['Straight', 'Fade', 'Draw', 'Slice', 'Hook'];
  const unitOptions = ['Yards', 'Meters'];
  
  // New options for different modes
  const parOptions = ['3', '4', '5'];
  const pinPositionOptions = ['Front', 'Center', 'Back'];
  const greenSpeedOptions = ['Slow', 'Medium', 'Fast'];
  const practiceTypeOptions = ['Full Swing', 'Short Game', 'Putting', 'Bunker Play', 'Pitching', 'Chipping'];

  // Helper descriptions for dropdown options
  const getOptionDescription = (field: string, option: string): string => {
    const descriptions: { [key: string]: { [key: string]: string } } = {
      'Club': {
        'Driver': 'Longest club, maximum distance from tee',
        '3 Wood': 'Fairway wood for long shots off grass',
        '5 Wood': 'Fairway wood for medium-long shots',
        '3 Iron': 'Long iron for approach shots',
        '4 Iron': 'Long iron for approach shots',
        '5 Iron': 'Mid iron for approach shots',
        '6 Iron': 'Mid iron for approach shots',
        '7 Iron': 'Short iron for approach shots',
        '8 Iron': 'Short iron for approach shots',
        '9 Iron': 'Short iron for approach shots',
        'PW': 'Pitching wedge for short approach shots',
        'SW': 'Sand wedge for shots from sand or rough',
        'Putter': 'For putting on the green'
      },
      'Lie': {
        'Fairway': 'Well-maintained grass area between tee and green',
        'Rough': 'Longer grass bordering the fairway',
        'Sand': 'Sand bunker hazard',
        'Tee Box': 'Starting area for each hole'
      },
      'Wind': {
        'None': 'No significant wind affecting the shot',
        'Light Head': 'Slight wind blowing towards you',
        'Strong Head': 'Strong wind blowing towards you',
        'Light Tail': 'Slight wind blowing with you',
        'Strong Tail': 'Strong wind blowing with you',
        'Cross Left': 'Wind blowing from right to left',
        'Cross Right': 'Wind blowing from left to right'
      },
      'Lateral Direction': {
        'Left': 'Shot went left of the target',
        'Center': 'Shot went straight at the target',
        'Right': 'Shot went right of the target'
      },
      'Inclination': {
        'Low': 'Shot went lower than intended',
        'Center': 'Shot went at the correct height',
        'High': 'Shot went higher than intended'
      },
      'Expectation': {
        'Straight': 'Expected the ball to fly straight',
        'Fade': 'Expected a slight right-to-left curve',
        'Draw': 'Expected a slight left-to-right curve',
        'Slice': 'Expected a strong right-to-left curve',
        'Hook': 'Expected a strong left-to-right curve'
      },
      'Actual': {
        'Straight': 'Ball flew straight without curving',
        'Fade': 'Ball curved slightly right-to-left',
        'Draw': 'Ball curved slightly left-to-right',
        'Slice': 'Ball curved strongly right-to-left',
        'Hook': 'Ball curved strongly left-to-right'
      },
      'Total Distance Unit': {
        'Yards': 'Imperial measurement (1 yard = 0.914 meters)',
        'Meters': 'Metric measurement (1 meter = 1.094 yards)'
      },
      'Carry Distance Unit': {
        'Yards': 'Imperial measurement (1 yard = 0.914 meters)',
        'Meters': 'Metric measurement (1 meter = 1.094 yards)'
      },
      'Par': {
        '3': 'Short hole, typically a par 3',
        '4': 'Medium length hole, typically a par 4',
        '5': 'Long hole, typically a par 5'
      },
      'Pin Position': {
        'Front': 'The pin is positioned at the front of the green',
        'Center': 'The pin is positioned in the center of the green',
        'Back': 'The pin is positioned at the back of the green'
      },
      'Green Speed': {
        'Slow': 'Greens roll slowly, balls stop quickly',
        'Medium': 'Greens roll at a moderate speed',
        'Fast': 'Greens roll quickly, balls travel farther'
      },
      'Practice Type': {
        'Full Swing': 'Practicing full golf swings with various clubs',
        'Short Game': 'Practicing chips, pitches, and bunker shots',
        'Putting': 'Practicing putting on the practice green',
        'Pitching': 'Practicing pitch shots around the green',
        'Chipping': 'Practicing chip shots from just off the green',
        'Bunker Play': 'Practicing shots from sand bunkers'
      }
    };
    return descriptions[field]?.[option] || '';
  };

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

  const showFieldInfo = (fieldName: string) => {
    const fieldDescriptions: { [key: string]: string } = {
      'Club': 'Select the golf club you used for this shot. Different clubs are designed for different distances and shot types.',
      'Lie': 'The position or condition of your golf ball on the course. This affects how you need to play the shot.',
      'Wind': 'Wind conditions that can affect ball flight and shot planning.',
      'Lateral Direction': 'Whether the shot went left, center, or right of the intended target.',
      'Inclination': 'The vertical trajectory of the shot - whether it went low, normal, or high.',
      'Expectation': 'The shot shape you intended or expected to achieve.',
      'Actual': 'The actual shot shape that occurred.',
      'Total Distance': 'The complete distance from where you hit the ball to where it finally comes to rest.',
      'Carry Distance': 'The distance the ball traveled through the air before first contacting the ground.',
      'Notes': 'Any additional observations, conditions, or comments about the shot.',
      'Hole': 'The hole number on the golf course (1-18).',
      'Par': 'The expected number of strokes to complete this hole.',
      'Score': 'The number of strokes you took to complete this hole.',
      'Pin Position': 'The position of the hole (cup) on the green - front, center, or back.',
      'Green Speed': 'How fast the greens are rolling - affects putting and approach shots.',
      'Practice Type': 'The type of practice you were doing on the driving range.',
      'Target Distance': 'The intended distance you were trying to hit (optional).'
    };
    
    setCurrentInfoField(fieldName);
    setCurrentInfoDescription(fieldDescriptions[fieldName] || 'No description available.');
    setInfoModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const shotTime = Date.now();
      
      // Convert distances to yards for consistent storage
      const distanceInYards = distanceUnit === 'Meters' ? Number(distance) * 1.09361 : Number(distance);
      const carryInYards = carryUnit === 'Meters' ? Number(carry) * 1.09361 : Number(carry);
      const targetDistanceInYards = mode === 'driving_range' && targetDistance ? 
        (distanceUnit === 'Meters' ? Number(targetDistance) * 1.09361 : Number(targetDistance)) : 0;
      
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
          shot.lie = mode === 'golf_course' ? lie : (lie || 'Tee Box');
          shot.wind = wind;
          shot.notes = notes;
          shot.timestamp = shotTime;
          
          // New fields
          shot.mode = mode;
          shot.holeNumber = mode === 'golf_course' ? Number(holeNumber) || 0 : 0;
          shot.par = mode === 'golf_course' ? Number(par) || 4 : 4;
          shot.score = mode === 'golf_course' ? Number(score) || 0 : 0;
          shot.pinPosition = mode === 'golf_course' ? pinPosition : 'Center';
          shot.greenSpeed = mode === 'golf_course' ? greenSpeed : 'Medium';
          shot.practiceType = mode === 'driving_range' ? practiceType : 'Full Swing';
          shot.targetDistance = targetDistanceInYards;
        });
      });
      
      // Clear only the shot-specific fields that change per shot
      setDistance('');
      setCarry('');
      setNotes('');
      
      // Clear mode-specific fields that change per shot
      if (mode === 'golf_course') {
        setHoleNumber('');
        setScore('');
      } else {
        setTargetDistance('');
      }
      
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
            <View style={styles.headerContent}>
              <Text style={styles.golfTitle}>Record Shot</Text>
              <Text style={styles.golfSubtitle}>Log your driving range shots</Text>
            </View>
            <TouchableOpacity
              style={styles.helpButton}
              onPress={() => router.push('/help')}
            >
              <MaterialCommunityIcons name="help-circle" size={28} color="#4caf50" />
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <MaterialCommunityIcons name="golf" size={28} color="#4caf50" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Record a Shot</Text>
            </View>
            
            {/* Mode Selector */}
            <View style={styles.modeSelector}>
              <TouchableOpacity
                style={[styles.modeButton, mode === 'driving_range' && styles.modeButtonActive]}
                onPress={() => {
                  setMode('driving_range');
                  // loadLastShot will be called by useEffect
                }}
              >
                <MaterialCommunityIcons name="golf" size={20} color={mode === 'driving_range' ? '#fff' : '#4caf50'} />
                <Text style={[styles.modeButtonText, mode === 'driving_range' && styles.modeButtonTextActive]}>
                  Driving Range
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, mode === 'golf_course' && styles.modeButtonActive]}
                onPress={() => {
                  setMode('golf_course');
                  // loadLastShot will be called by useEffect
                }}
              >
                <MaterialCommunityIcons name="flag-variant" size={20} color={mode === 'golf_course' ? '#fff' : '#4caf50'} />
                <Text style={[styles.modeButtonText, mode === 'golf_course' && styles.modeButtonTextActive]}>
                  Golf Course
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={{ marginBottom: 12 }}>
              {/* Golf Course specific fields */}
              {mode === 'golf_course' && (
                <>
                  <View style={styles.row}>
                    <View style={[styles.pickerContainer, { flex: 1, marginRight: 6 }]}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.pickerLabel}>Hole</Text>
                        <TouchableOpacity onPress={() => showFieldInfo('Hole')}>
                          <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        placeholder="1-18"
                        placeholderTextColor="#888"
                        value={holeNumber}
                        onChangeText={setHoleNumber}
                        keyboardType="numeric"
                        style={styles.input}
                      />
                    </View>
                    <View style={[styles.pickerContainer, { flex: 1, marginLeft: 6 }]}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.pickerLabel}>Par</Text>
                        <TouchableOpacity onPress={() => showFieldInfo('Par')}>
                          <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => openDropdown('Par', parOptions, setPar, par)}
                      >
                        <Text style={styles.dropdownText}>{par}</Text>
                        <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.pickerContainer, { flex: 1, marginRight: 6 }]}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.pickerLabel}>Score</Text>
                        <TouchableOpacity onPress={() => showFieldInfo('Score')}>
                          <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        placeholder="strokes"
                        placeholderTextColor="#888"
                        value={score}
                        onChangeText={setScore}
                        keyboardType="numeric"
                        style={styles.input}
                      />
                    </View>
                    <View style={[styles.pickerContainer, { flex: 1, marginLeft: 6 }]}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.pickerLabel}>Pin Position</Text>
                        <TouchableOpacity onPress={() => showFieldInfo('Pin Position')}>
                          <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => openDropdown('Pin Position', pinPositionOptions, setPinPosition, pinPosition)}
                      >
                        <Text style={styles.dropdownText}>{pinPosition}</Text>
                        <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.pickerContainer}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.pickerLabel}>Green Speed</Text>
                      <TouchableOpacity onPress={() => showFieldInfo('Green Speed')}>
                        <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() => openDropdown('Green Speed', greenSpeedOptions, setGreenSpeed, greenSpeed)}
                    >
                      <Text style={styles.dropdownText}>{greenSpeed}</Text>
                      <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Driving Range specific fields */}
              {mode === 'driving_range' && (
                <View style={styles.pickerContainer}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.pickerLabel}>Practice Type</Text>
                    <TouchableOpacity onPress={() => showFieldInfo('Practice Type')}>
                      <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => openDropdown('Practice Type', practiceTypeOptions, setPracticeType, practiceType)}
                  >
                    <Text style={styles.dropdownText}>{practiceType}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Common fields for both modes */}
              <View style={styles.pickerContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.pickerLabel}>Club</Text>
                  <TouchableOpacity onPress={() => showFieldInfo('Club')}>
                    <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => openDropdown('Club', clubOptions, setClub, club)}
                >
                  <Text style={styles.dropdownText}>{club}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                </TouchableOpacity>
              </View>

              {/* Lie and Wind - Wind always shown, Lie optional for driving range */}
              <View style={styles.row}>
                {mode === 'golf_course' && (
                  <View style={[styles.pickerContainer, { flex: 1, marginRight: 6 }]}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.pickerLabel}>Lie</Text>
                      <TouchableOpacity onPress={() => showFieldInfo('Lie')}>
                        <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() => openDropdown('Lie', lieOptions, setLie, lie)}
                    >
                      <Text style={styles.dropdownText}>{lie}</Text>
                      <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                    </TouchableOpacity>
                  </View>
                )}
                <View style={[styles.pickerContainer, mode === 'golf_course' ? { flex: 1, marginLeft: 6 } : { flex: 1 }]}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.pickerLabel}>Wind</Text>
                    <TouchableOpacity onPress={() => showFieldInfo('Wind')}>
                      <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                    </TouchableOpacity>
                  </View>
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
                  <View style={styles.labelContainer}>
                    <Text style={styles.pickerLabel}>Lateral Direction</Text>
                    <TouchableOpacity onPress={() => showFieldInfo('Lateral Direction')}>
                      <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => openDropdown('Lateral Direction', directionOptions, setLateralDirection, lateralDirection)}
                  >
                    <Text style={styles.dropdownText}>{lateralDirection}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                  </TouchableOpacity>
                </View>
                <View style={[styles.pickerContainer, { flex: 1, marginLeft: 6 }]}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.pickerLabel}>Inclination</Text>
                    <TouchableOpacity onPress={() => showFieldInfo('Inclination')}>
                      <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                    </TouchableOpacity>
                  </View>
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
                  <View style={styles.labelContainer}>
                    <Text style={styles.pickerLabel}>Expectation</Text>
                    <TouchableOpacity onPress={() => showFieldInfo('Expectation')}>
                      <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => openDropdown('Expectation', shotShapeOptions, setExpectation, expectation)}
                  >
                    <Text style={styles.dropdownText}>{expectation}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                  </TouchableOpacity>
                </View>
                <View style={[styles.pickerContainer, { flex: 1, marginLeft: 6 }]}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.pickerLabel}>Actual</Text>
                    <TouchableOpacity onPress={() => showFieldInfo('Actual')}>
                      <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => openDropdown('Actual', shotShapeOptions, setActual, actual)}
                  >
                    <Text style={styles.dropdownText}>{actual}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Target Distance for Driving Range */}
              {mode === 'driving_range' && (
                <View style={styles.inputContainer}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.inputLabel}>Target Distance (optional)</Text>
                    <TouchableOpacity onPress={() => showFieldInfo('Target Distance')}>
                      <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.row}>
                    <TextInput
                      placeholder="distance"
                      placeholderTextColor="#888"
                      value={targetDistance}
                      onChangeText={setTargetDistance}
                      keyboardType="numeric"
                      style={[styles.input, { flex: 1, marginRight: 6 }]}
                    />
                    <TouchableOpacity
                      style={[styles.dropdown, { flex: 0.4 }]}
                      onPress={() => openDropdown('Target Distance Unit', unitOptions, setDistanceUnit, distanceUnit)}
                    >
                      <Text style={styles.dropdownText}>{distanceUnit}</Text>
                      <MaterialCommunityIcons name="chevron-down" size={20} color="#4caf50" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>Total Distance</Text>
                  <TouchableOpacity onPress={() => showFieldInfo('Total Distance')}>
                    <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                  </TouchableOpacity>
                </View>
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
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>Carry Distance</Text>
                  <TouchableOpacity onPress={() => showFieldInfo('Carry Distance')}>
                    <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                  </TouchableOpacity>
                </View>
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
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>Notes (optional)</Text>
                  <TouchableOpacity onPress={() => showFieldInfo('Notes')}>
                    <MaterialCommunityIcons name="information-outline" size={16} color="#4caf50" />
                  </TouchableOpacity>
                </View>
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
                          <Text style={styles.modalOptionDescription}>
                            {getOptionDescription(currentField, item)}
                          </Text>
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

              <Modal
                visible={infoModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setInfoModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{currentInfoField}</Text>
                    <Text style={styles.infoModalDescription}>
                      {currentInfoDescription}
                    </Text>
                    <TouchableOpacity
                      style={styles.modalClose}
                      onPress={() => setInfoModalVisible(false)}
                    >
                      <Text style={styles.modalCloseText}>Close</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#181c20',
  },
  headerContent: {
    alignItems: 'center',
    flex: 1,
  },
  helpButton: {
    position: 'absolute',
    right: 16,
    top: 60,
    padding: 8,
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
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
    fontWeight: 'bold',
  },
  modalOptionDescription: {
    color: '#bbb',
    fontSize: 14,
    marginTop: 4,
    lineHeight: 18,
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
  infoModalDescription: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#181c20',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  modeButtonActive: {
    backgroundColor: '#4caf50',
  },
  modeButtonText: {
    color: '#4caf50',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  modeButtonTextActive: {
    color: '#fff',
  },
});
