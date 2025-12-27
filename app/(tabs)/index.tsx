import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import DatabaseService, { DatabaseScan } from '../../services/DatabaseService';

const SUGGESTED_ITEMS = [
  { id: '1', name: 'Avocado', freshness: '95%', color: '#4CAF50', icon: 'avocado' },
  { id: '2', name: 'Strawberry', freshness: '89%', color: '#FF5252', icon: 'food-apple' }, // Strawberry icon not in MCO, using apple
  { id: '3', name: 'Broccoli', freshness: '92%', color: '#8BC34A', icon: 'leaf' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [recentScans, setRecentScans] = useState<DatabaseScan[]>([]);
  const [lastScan, setLastScan] = useState<DatabaseScan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const fetchRecentScans = async () => {
    try {
      if (!user) {
        setRecentScans([]);
        return;
      }
      const allScans = await DatabaseService.getAllScans(user.id);
      const recent = allScans.slice(0, 5);
      setRecentScans(recent);
      if (recent.length > 0) {
        setLastScan(recent[0]);
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentScans();
  }, []);



  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.itemCard, { backgroundColor: colors.surface }]}
      onPress={() => router.push({
        pathname: '/product-details',
        params: { 
          id: String(item.id),
          name: item.itemName, 
          farm: item.farm || 'Unknown',
          freshness: item.freshnessScore,
          icon: item.icon || 'food',
          scannedAt: item.scannedAt,
          shelfLifeDays: item.shelfLifeDays || 0,
          imageUri: item.imageUri
        }
      })}
    >
      <View style={styles.itemIconContainer}>
         <MaterialCommunityIcons 
            name={item.icon || 'food-apple'} 
            size={50} 
            color={colors.primary} 
         />
      </View>
      <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>{item.itemName}</Text>
      <Text style={[styles.itemFreshness, { color: colors.primary }]}>{item.freshnessScore} fresh</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons name="leaf" size={28} color={colors.primary} />
            <Text style={[styles.headerTitle, { color: colors.primary }]}>Smart Food Freshness</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
            <MaterialCommunityIcons name="account-circle" size={32} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingText, { color: colors.text }]}>Hello, {user?.fullName || 'Guest'} 👋</Text>
        </View>

        {/* Freshness Card */}
        <View style={[styles.freshnessCard, { backgroundColor: colors.surface }]}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="lightning-bolt" size={24} color="#FFD700" />
            <Text style={[styles.cardHeaderText, { color: colors.textSecondary }]}>
              {lastScan ? 'Last Scan Freshness' : 'Start Analyzing'}
            </Text>
          </View>
          <Text style={[styles.freshnessValue, { color: colors.primary }]}>
            {lastScan ? lastScan.freshnessScore : '--'}
          </Text>
          <Text style={[styles.freshnessStatus, { color: colors.textSecondary }]}>
            {lastScan ? `Scanned: ${lastScan.itemName}` : 'Take your first photo'}
          </Text>
        </View>

        {/* Scan Button */}
        <TouchableOpacity style={[styles.scanButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={() => router.push('/scan')}>
          <MaterialCommunityIcons name="scan-helper" size={24} color="white" />
          <Text style={styles.scanButtonText}>Scan Now</Text>
        </TouchableOpacity>

        {/* Recent Scans */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Scans</Text>
          <TouchableOpacity onPress={() => router.push('/list')}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>View All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={recentScans}
          renderItem={renderItem}
          keyExtractor={item => String(item.id)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.itemsList}
          ListEmptyComponent={
            <Text style={{ color: colors.textSecondary, marginTop: 10 }}>No scans yet. Try scanning a fruit!</Text>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  profileButton: {
    padding: 4,
  },
  greetingSection: {
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '600',
  },
  freshnessCard: {
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  freshnessValue: {
    fontSize: 64,
    fontWeight: '800',
  },
  freshnessStatus: {
    fontSize: 16,
    marginTop: 8,
  },
  scanButton: {
    flexDirection: 'row',
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  itemsList: {
    gap: 16,
    paddingBottom: 20,
  },
  itemCard: {
    borderRadius: 20,
    padding: 20,
    width: 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  itemIconContainer: {
    width: 110,
    height: 110,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  recentImage: {
    width: '100%',
    height: '100%',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
    width: '100%',
  },
  itemFreshness: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
