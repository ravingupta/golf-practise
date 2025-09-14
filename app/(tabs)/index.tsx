import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

export default function HomeScreen() {
  const [club, setClub] = useState('');
  const [direction, setDirection] = useState('');
  const [expectation, setExpectation] = useState('');
  const [actual, setActual] = useState('');
  const [distance, setDistance] = useState('');

  const handleSave = () => {
    // TODO: Save to WatermelonDB
    alert('Shot recorded (not yet saved to DB)');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Driving Range Shot Recorder</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Record a Shot</Text>
        <View style={{ gap: 8 }}>
          <TextInput
            placeholder="Club (e.g. Driver, 7 Iron)"
            value={club}
            onChangeText={setClub}
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 }}
          />
          <TextInput
            placeholder="Direction (left/right/high/low)"
            value={direction}
            onChangeText={setDirection}
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 }}
          />
          <TextInput
            placeholder="Expectation (e.g. straight, fade)"
            value={expectation}
            onChangeText={setExpectation}
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 }}
          />
          <TextInput
            placeholder="Actual (e.g. slice, hook)"
            value={actual}
            onChangeText={setActual}
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 }}
          />
          <TextInput
            placeholder="Distance (yards/meters)"
            value={distance}
            onChangeText={setDistance}
            keyboardType="numeric"
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 }}
          />
          <Button title="Record Shot" onPress={handleSave} />
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
