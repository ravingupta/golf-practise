import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface TermItem {
  term: string;
  definition: string;
}

const golfTerms: TermItem[] = [
  {
    term: "Driver",
    definition: "The longest club in your bag, used for maximum distance off the tee."
  },
  {
    term: "Fairway",
    definition: "The closely mowed area between the tee and the green."
  },
  {
    term: "Rough",
    definition: "The longer grass area bordering the fairway."
  },
  {
    term: "Green",
    definition: "The specially prepared area with short grass around the hole."
  },
  {
    term: "Sand Trap/Bunker",
    definition: "A hazard filled with sand that makes shots more difficult."
  },
  {
    term: "Lie",
    definition: "The position or condition of your golf ball on the ground."
  },
  {
    term: "Carry",
    definition: "The distance the ball travels through the air before first contact with the ground."
  },
  {
    term: "Total Distance",
    definition: "The total distance from where you hit the ball to where it comes to rest."
  },
  {
    term: "Draw",
    definition: "A shot that curves slightly to the left (for right-handed golfers)."
  },
  {
    term: "Fade",
    definition: "A shot that curves slightly to the right (for right-handed golfers)."
  },
  {
    term: "Slice",
    definition: "A shot that curves sharply to the right (for right-handed golfers)."
  },
  {
    term: "Hook",
    definition: "A shot that curves sharply to the left (for right-handed golfers)."
  },
  {
    term: "Straight",
    definition: "A shot that flies directly toward the target without curving."
  },
  {
    term: "Accuracy",
    definition: "How close your shots come to your intended target."
  },
  {
    term: "Lateral Direction",
    definition: "Whether the shot goes left, center, or right of the target."
  },
  {
    term: "Inclination",
    definition: "Whether the shot goes low, center, or high relative to the target."
  },
  {
    term: "Wind Conditions",
    definition: "Weather conditions that can affect ball flight (head wind, tail wind, cross wind)."
  },
  {
    term: "Expectation vs Actual",
    definition: "What you expected the shot to do versus what actually happened."
  }
];

export default function HelpScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#181c20' }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Golf Terms Guide</Text>
          <Text style={styles.subtitle}>Understanding the terminology used in golf practice</Text>
        </View>

        {golfTerms.map((item, index) => (
          <View key={index} style={styles.termCard}>
            <Text style={styles.term}>{item.term}</Text>
            <Text style={styles.definition}>{item.definition}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#181c20',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  termCard: {
    backgroundColor: '#23272b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  term: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 8,
  },
  definition: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
});
