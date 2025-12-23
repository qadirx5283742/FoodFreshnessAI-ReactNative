import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Query } from 'react-native-appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APPWRITE_CONFIG, databases, storage } from '../../config/appwriteConfig';
import { auth } from '../../config/firebaseConfig';
import { useTheme } from '../../context/ThemeContext';

export default function HistoryScreen() {
  const [scans, setScans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const fetchScans = async (showLoading = true) => {
    if (!auth.currentUser) return;
    if (showLoading) setIsLoading(true);

    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.scansCollectionId,
        [
          Query.equal('userId', auth.currentUser.uid),
          Query.orderDesc('scannedAt')
        ]
      );
      setScans(response.documents);
    } catch (error) {
      console.error("Fetch Scans Error:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchScans(false);
  };

  const getImageUrl = (imageId: string) => {
    try {
      return storage.getFilePreview(APPWRITE_CONFIG.bucketId, imageId).toString();
    } catch (error) {
      return '';
    }
  };

  const renderProductItem = ({ item }: any) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => router.push({
        pathname: '/product-details',
        params: { 
          id: item.$id,
          name: item.itemName, 
          farm: item.farm || 'Unknown', 
          freshness: item.freshnessScore, 
          imageId: item.imageId 
        }
      })}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: colors.iconBackground }]}>
            <Image 
              source={{ uri: getImageUrl(item.imageId) }}
              style={styles.productImage}
              contentFit="cover"
              transition={200}
            />
        </View>
        <View style={styles.infoContainer}>
          <Text style={[styles.productName, { color: colors.primary }]}>{item.itemName}</Text>
          <Text style={[styles.farmName, { color: colors.textSecondary }]}>{item.farm || 'Unknown'}</Text>
          <Text style={[styles.freshnessText, { color: colors.textSecondary }]}>Freshness: <Text style={[styles.freshnessValue, { color: colors.primary }]}>{item.freshnessScore}</Text></Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="history" size={80} color={colors.border} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Scans Yet</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Capture your first fruit scan to see the history here.
      </Text>
      <TouchableOpacity 
        style={[styles.scanPromptButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/scan')}
      >
        <Text style={styles.scanPromptText}>Start Scanning</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
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
        data={scans.filter(p => p.itemName.toLowerCase().includes(searchQuery.toLowerCase()))}
        renderItem={renderProductItem}
        keyExtractor={item => item.$id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        ListEmptyComponent={!isLoading ? <EmptyState /> : null}
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
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  scanPromptButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  scanPromptText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
