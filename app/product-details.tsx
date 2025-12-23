import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function ProductDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors, isDark } = useTheme();

  // Mock data for display - in a real app, you'd fetch this based on product ID
  const product = {
    name: params.name || 'Apple',
    farm: params.farm || 'Fresh Farm',
    freshness: params.freshness || '95%',
    expiryDate: '2025-12-12',
    description: 'Crisp and juicy, packed with vitamins. Great for a healthy snack or adding to salads.',
    nutrition: 'Calories: 52, Carbs: 14g, Fiber: 2.4g',
    icon: params.icon || 'apple',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.imageContainer, { backgroundColor: isDark ? colors.surface : '#F9F9F9' }]}>
          {/* Placeholder for real image */}
          <View style={styles.placeholderImage}>
             <MaterialCommunityIcons name={product.icon as any} size={150} color={colors.primary} />
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.productName, { color: isDark ? colors.primary : '#2E7D32' }]}>{product.name}</Text>
          <Text style={[styles.farmName, { color: colors.textSecondary }]}>{product.farm}</Text>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, styles.freshnessBadge, { backgroundColor: colors.primary }]}>
               <MaterialCommunityIcons name="leaf" size={16} color="white" />
               <Text style={styles.badgeText}>{product.freshness} Fresh</Text>
            </View>
            <View style={[styles.badge, styles.expiredBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
               <MaterialCommunityIcons name="calendar-clock" size={16} color={colors.primary} />
               <Text style={[styles.badgeText, { color: colors.primary }]}>Expired</Text>
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

          <View style={styles.detailsGroup}>
            <Text style={[styles.groupTitle, { color: isDark ? colors.primary : '#2E7D32' }]}>Nutrition Facts</Text>
            <Text style={[styles.groupContent, { color: colors.textSecondary }]}>{product.nutrition}</Text>
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
    paddingTop: 45, // Account for status bar
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
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
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
