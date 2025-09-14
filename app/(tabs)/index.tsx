import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { database } from '../../database';
import Shot from '../../model/Shot';

interface Session {
  date: string;
  shots: number;
  avgDistance: number;
}

export default function HomeScreen() {
  const [totalShots, setTotalShots] = useState(0);
  const [avgDistance, setAvgDistance] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const allShots = await database.get<Shot>('shots').query().fetch();
      setTotalShots(allShots.length);

      if (allShots.length > 0) {
        const totalDist = allShots.reduce((sum, shot) => sum + shot.distance, 0);
        setAvgDistance(Math.round(totalDist / allShots.length));

        const accurateShots = allShots.filter(shot => shot.expectation === shot.actual).length;
        setAccuracy(Math.round((accurateShots / allShots.length) * 100));
      }

      // Group by date for sessions
      const sessionsMap = new Map<string, Shot[]>();
      allShots.forEach(shot => {
        const date = new Date(shot.timestamp).toDateString();
        if (!sessionsMap.has(date)) {
          sessionsMap.set(date, []);
        }
        sessionsMap.get(date)!.push(shot);
      });

      const sessions: Session[] = Array.from(sessionsMap.entries())
        .map(([date, shots]) => ({
          date,
          shots: shots.length,
          avgDistance: Math.round(shots.reduce((sum, s) => sum + s.distance, 0) / shots.length),
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setRecentSessions(sessions);
    } catch (e) {
      console.error('Error loading stats:', e);
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
          <Text style={styles.golfTitle}>Golf Practice</Text>
          <Text style={styles.golfSubtitle}>Track your progress</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="golf" size={32} color="#4caf50" />
            <Text style={styles.statNumber}>{totalShots}</Text>
            <Text style={styles.statLabel}>Total Shots</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="ruler" size={32} color="#4caf50" />
            <Text style={styles.statNumber}>{avgDistance}</Text>
            <Text style={styles.statLabel}>Avg Distance (yards)</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="target" size={32} color="#4caf50" />
            <Text style={styles.statNumber}>{accuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <MaterialCommunityIcons name="calendar" size={28} color="#4caf50" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>Recent Sessions</Text>
          </View>
          {recentSessions.length === 0 ? (
            <Text style={{ color: '#888', fontStyle: 'italic' }}>No sessions yet. Start recording shots!</Text>
          ) : (
            recentSessions.map((session, idx) => (
              <View key={idx} style={styles.sessionRow}>
                <MaterialCommunityIcons name="calendar" size={20} color="#4caf50" style={{ marginRight: 6 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.sessionDate}>{session.date}</Text>
                  <Text style={styles.sessionStats}>{session.shots} shots • Avg: {session.avgDistance} yards</Text>
                </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  statCard: {
    backgroundColor: '#23272b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 4,
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
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  sessionStats: {
    fontSize: 14,
    color: '#bbb',
  },
});
