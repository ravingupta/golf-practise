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
    term: "Fairway Woods (3W, 5W)",
    definition: "Long clubs used for shots off the fairway or tee when less distance than a driver is needed."
  },
  {
    term: "Irons (3-9 Iron)",
    definition: "Clubs numbered 3 through 9, used for approach shots to the green. Lower numbers are longer clubs."
  },
  {
    term: "Pitching Wedge (PW)",
    definition: "A short iron used for approach shots and chips around the green."
  },
  {
    term: "Sand Wedge (SW)",
    definition: "Specialized club with a high loft, designed for shots from sand bunkers and high chips."
  },
  {
    term: "Putter",
    definition: "Club used for putting on the green to roll the ball into the hole."
  },
  {
    term: "Fairway",
    definition: "Well-maintained grass area between the tee and green where shots are intended to land."
  },
  {
    term: "Rough",
    definition: "Longer grass bordering the fairway that makes shots more difficult."
  },
  {
    term: "Sand Bunker",
    definition: "Hazard filled with sand that requires special technique to escape."
  },
  {
    term: "Tee Box",
    definition: "Starting area for each hole where the first shot is played."
  },
  {
    term: "Wind Conditions",
    definition: "Weather factors affecting ball flight: Head wind (against you), Tail wind (with you), Cross wind (sideways)."
  },
  {
    term: "Lateral Direction",
    definition: "Horizontal ball flight: Left (missed target left), Center (on target), Right (missed target right)."
  },
  {
    term: "Inclination",
    definition: "Vertical ball flight: Low (ball stayed low), Center (normal trajectory), High (ball went high)."
  },
  {
    term: "Shot Shape - Straight",
    definition: "Ball flies directly toward the target without curving."
  },
  {
    term: "Shot Shape - Fade",
    definition: "Ball curves slightly right-to-left (for right-handed golfers)."
  },
  {
    term: "Shot Shape - Draw",
    definition: "Ball curves slightly left-to-right (for right-handed golfers)."
  },
  {
    term: "Shot Shape - Slice",
    definition: "Ball curves sharply right-to-left, often unwanted."
  },
  {
    term: "Shot Shape - Hook",
    definition: "Ball curves sharply left-to-right, often unwanted."
  },
  {
    term: "Carry Distance",
    definition: "Distance the ball travels through the air before first ground contact."
  },
  {
    term: "Total Distance",
    definition: "Complete distance from shot start to where ball comes to rest."
  },
  {
    term: "Accuracy",
    definition: "Percentage of shots that match your intended outcome."
  },
  {
    term: "Expectation vs Actual",
    definition: "Comparison between what you expected the shot to do versus what actually happened."
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
