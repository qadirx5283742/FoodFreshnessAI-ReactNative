import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Image as RNImage,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function ProductDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors, isDark } = useTheme();



  // Calculate Expiry
  const scannedDate = params.scannedAt ? new Date(params.scannedAt as string) : new Date();
  const expiryDate = new Date(scannedDate);
  
  // Derive shelf life from freshness score percentage (e.g., "95%" -> 3 days)
  const freshnessStr = (params.freshness as string) || "0%";
  const freshnessPercentage = parseInt(freshnessStr.replace('%', '')) / 100;
  
  let shelfLife = 0;
  if (freshnessPercentage >= 0.90) shelfLife = 3;
  else if (freshnessPercentage >= 0.75) shelfLife = 2;
  else if (freshnessPercentage >= 0.65) shelfLife = 1;

  expiryDate.setDate(scannedDate.getDate() + shelfLife);
  const formattedExpiry = expiryDate.toISOString().split('T')[0];

  // If shelfLife is 0, it means it's already spoiled/expired
  const isExpired = shelfLife <= 0;

  const product = {
    name: (params.name as string) || 'Apple',
    farm: (params.farm as string) || 'Fresh Farm',
    freshness: (params.freshness as string) || '95%',
    expiryDate: formattedExpiry,
    description: isExpired 
      ? "Spoiled. Best consumed right now" 
      : "Fresh and healthy food item. Best consumed while fresh.",
    imageId: params.imageId as string, // Kept for type safety though likely unused
    icon: (params.icon as string) || 'food-apple',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.imageContainer, { backgroundColor: isDark ? colors.surface : '#F9F9F9' }]}>
          <RNImage 
            source={{ uri: params.imageUri as string }} 
            style={styles.fullImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.productName, { color: isDark ? colors.primary : '#2E7D32' }]}>{product.name}</Text>
          <Text style={[styles.farmName, { color: colors.textSecondary }]}>{product.farm}</Text>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, styles.freshnessBadge, { backgroundColor: colors.primary }]}>
               <MaterialCommunityIcons name="leaf" size={16} color="white" />
               <Text style={styles.badgeText}>{product.freshness} Fresh</Text>
            </View>
            <View style={[styles.badge, isExpired ? styles.expiredBadge : { borderRadius: 20 }, { backgroundColor: isExpired ? colors.error : colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
               <MaterialCommunityIcons name={isExpired ? "alert-circle" : "calendar-clock"} size={16} color={isExpired ? "white" : colors.primary} />
               <Text style={[styles.badgeText, { color: isExpired ? "white" : colors.primary }]}>
                 {isExpired ? 'Expired' : `${shelfLife} Day${shelfLife > 1 ? 's' : ''} Left`}
               </Text>
            </View>
          </View>

          <View style={[styles.expiryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="information-outline" size={24} color={colors.primary} />
            <Text style={[styles.expiryText, { color: colors.text }]}>Expiry Date: {product.expiryDate}</Text>
          </View>

          <View style={styles.detailsGroup}>
            <Text style={[styles.groupTitle, { color: isDark ? colors.primary : '#2E7D32' }]}>Description</Text>
            <Text style={[styles.groupContent, { color: colors.textSecondary }]}>{product.description}</Text>
          </View>


        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  imageContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    padding: 24,
  },
  productName: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  farmName: {
    fontSize: 16,
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  freshnessBadge: {
  },
  expiredBadge: {
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  expiryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  expiryText: {
    fontSize: 16,
    fontWeight: '500',
  },
  detailsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  groupContent: {
    fontSize: 16,
    lineHeight: 22,
  },
});
