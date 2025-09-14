import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { database } from '../../database';
import Shot from '../../model/Shot';

interface Session {
  date: string;
  shots: number;
  avgDistance: number;
}

interface ClubStats {
  club: string;
  shots: number;
  avgDistance: number;
  accuracy: number;
}

export default function HomeScreen() {
  const [totalShots, setTotalShots] = useState(0);
  const [avgDistance, setAvgDistance] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [clubStats, setClubStats] = useState<ClubStats[]>([]);

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

      // Group by club for club analysis
      const clubMap = new Map<string, Shot[]>();
      allShots.forEach(shot => {
        if (!clubMap.has(shot.club)) {
          clubMap.set(shot.club, []);
        }
        clubMap.get(shot.club)!.push(shot);
      });

      const clubs: ClubStats[] = Array.from(clubMap.entries())
        .map(([club, shots]) => {
          const avgDist = Math.round(shots.reduce((sum, s) => sum + s.distance, 0) / shots.length);
          const accurateShots = shots.filter(shot => shot.expectation === shot.actual).length;
          const acc = Math.round((accurateShots / shots.length) * 100);
          return {
            club,
            shots: shots.length,
            avgDistance: avgDist,
            accuracy: acc,
          };
        })
        .sort((a, b) => b.shots - a.shots) // Sort by most used clubs first
        .slice(0, 6); // Show top 6 clubs

      setClubStats(clubs);
    } catch (e) {
      console.error('Error loading stats:', e);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#181c20' }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View>
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.golfTitle}>Golf Practice</Text>
            <Text style={styles.golfSubtitle}>Track your progress</Text>
          </View>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => router.push('/help')}
          >
            <MaterialCommunityIcons name="help-circle" size={28} color="#4caf50" />
          </TouchableOpacity>
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

        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <MaterialCommunityIcons name="golf" size={28} color="#4caf50" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>Club Analysis</Text>
          </View>
          {clubStats.length === 0 ? (
            <Text style={{ color: '#888', fontStyle: 'italic' }}>No club data yet. Start recording shots!</Text>
          ) : (
            clubStats.map((club, idx) => (
              <View key={idx} style={styles.clubRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.clubName}>{club.club}</Text>
                  <Text style={styles.clubStats}>{club.shots} shots • Avg: {club.avgDistance} yards • {club.accuracy}% accuracy</Text>
                </View>
                <View style={styles.clubAccuracy}>
                  <Text style={styles.accuracyText}>{club.accuracy}%</Text>
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
  clubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#181c20',
    borderRadius: 8,
  },
  clubName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  clubStats: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 2,
  },
  clubAccuracy: {
    backgroundColor: '#4caf50',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  accuracyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
