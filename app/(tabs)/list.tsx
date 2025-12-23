import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const PRODUCTS_DATA = [
  { id: '1', name: 'Apple', farm: 'Fresh Farm', freshness: '95%', icon: 'apple' },
  { id: '2', name: 'Banana', farm: 'Tropical Gold', freshness: '89%', icon: 'food-apple' }, // Banana icon approximation
  { id: '3', name: 'Tomato', farm: 'Green Valley', freshness: '91%', icon: 'fruit-watermelon' }, // Approximation
  { id: '4', name: 'Broccoli', farm: 'Green Valley', freshness: '93%', icon: 'leaf' },
  { id: '5', name: 'Carrot', farm: 'Organic Roots', freshness: '90%', icon: 'carrot' },
];

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const renderProductItem = ({ item }: any) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => router.push({
        pathname: '/product-details',
        params: { name: item.name, farm: item.farm, freshness: item.freshness, icon: item.icon }
      })}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: colors.iconBackground }]}>
            <MaterialCommunityIcons name={item.icon} size={40} color={colors.primary} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={[styles.productName, { color: colors.primary }]}>{item.name}</Text>
          <Text style={[styles.farmName, { color: colors.textSecondary }]}>{item.farm}</Text>
          <Text style={[styles.freshnessText, { color: colors.textSecondary }]}>Freshness: <Text style={[styles.freshnessValue, { color: colors.primary }]}>{item.freshness}</Text></Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Products</Text>
        <TouchableOpacity onPress={() => router.push('/scan')}>
          <MaterialCommunityIcons name="scan-helper" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search product..."
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <FlatList
        data={PRODUCTS_DATA.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  farmName: {
    fontSize: 14,
    marginBottom: 4,
  },
  freshnessText: {
    fontSize: 14,
  },
  freshnessValue: {
    fontWeight: '600',
  },
});
