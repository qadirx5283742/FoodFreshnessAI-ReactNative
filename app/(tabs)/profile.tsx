import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { colors, isDark } = useTheme();

  const ProfileOption = ({ icon, label, onPress, color }: any) => {
    const iconColor = color || colors.primary;
    return (
      <TouchableOpacity style={styles.optionRow} onPress={onPress}>
        <View style={styles.optionLeft}>
          <View style={[styles.iconWrapper, { backgroundColor: iconColor + '15' }]}>
            <MaterialCommunityIcons name={icon} size={22} color={iconColor} />
          </View>
          <Text style={[styles.optionLabel, { color: colors.text }]}>{label}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.headerCard, { backgroundColor: colors.surface }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <MaterialCommunityIcons name="account" size={60} color="white" />
            </View>
            <TouchableOpacity style={[styles.editAvatarBtn, { backgroundColor: isDark ? colors.primary : '#2E7D32' }]}>
              <MaterialCommunityIcons name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.userName, { color: isDark ? colors.primary : '#1B5E20' }]}>{user?.fullName || 'Guest User'}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email || 'guest@example.com'}</Text>
          <TouchableOpacity 
            style={[styles.editProfileBadge, { backgroundColor: colors.primary + '15' }]}
            onPress={() => router.push('/edit-profile')}
          >
            <Text style={[styles.editProfileText, { color: colors.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Account</Text>
          <View style={[styles.optionsCard, { backgroundColor: colors.surface }]}>
            <ProfileOption 
              icon="account-edit-outline" 
              label="Personal Info" 
              onPress={() => router.push('/edit-profile')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>App</Text>
          <View style={[styles.optionsCard, { backgroundColor: colors.surface }]}>
            <ProfileOption 
              icon="cog-outline" 
              label="Settings" 
              onPress={() => router.push('/settings')}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <ProfileOption 
              icon="information-outline" 
              label="About App" 
              onPress={() => router.push('/about')}
            />
          </View>
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: '#FF5252' }]} onPress={signOut}>
          <MaterialCommunityIcons name="logout" size={22} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 15,
  },
  editProfileBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  optionsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
