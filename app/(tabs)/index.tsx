import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const SUGGESTED_ITEMS = [
  { id: '1', name: 'Avocado', freshness: '95%', color: '#4CAF50', icon: 'avocado' },
  { id: '2', name: 'Strawberry', freshness: '89%', color: '#FF5252', icon: 'food-apple' }, // Strawberry icon not in MCO, using apple
  { id: '3', name: 'Broccoli', freshness: '92%', color: '#8BC34A', icon: 'leaf' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const renderItem = ({ item }: { item: typeof SUGGESTED_ITEMS[0] }) => (
    <TouchableOpacity 
      style={[styles.itemCard, { backgroundColor: colors.surface }]}
      onPress={() => router.push({
        pathname: '/product-details',
        params: { name: item.name, freshness: item.freshness, icon: item.icon }
      })}
    >
      <View style={[styles.itemIconContainer, { backgroundColor: item.color + '20' }]}>
        <MaterialCommunityIcons name={item.icon as any} size={40} color={isDark ? colors.primary : item.color} />
      </View>
      <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
      <Text style={[styles.itemFreshness, { color: isDark ? colors.primary : item.color }]}>{item.freshness} fresh</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
            <MaterialCommunityIcons name="apple" size={24} color="#FF9800" />
            <Text style={[styles.cardHeaderText, { color: colors.textSecondary }]}>Today's Freshness Level</Text>
          </View>
          <Text style={[styles.freshnessValue, { color: colors.primary }]}>94%</Text>
          <Text style={[styles.freshnessStatus, { color: colors.textSecondary }]}>Excellent condition</Text>
        </View>

        {/* Scan Button */}
        <TouchableOpacity style={[styles.scanButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={() => router.push('/scan')}>
          <MaterialCommunityIcons name="scan-helper" size={24} color="white" />
          <Text style={styles.scanButtonText}>Scan Now</Text>
        </TouchableOpacity>

        {/* Suggested Items */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Suggested Items</Text>
        </View>

        <FlatList
          data={SUGGESTED_ITEMS}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.itemsList}
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
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemFreshness: {
    fontSize: 14,
    fontWeight: '500',
  },
});
