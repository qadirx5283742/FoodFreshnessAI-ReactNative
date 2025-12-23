import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { CustomInput } from '../components/CustomInput';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getAuthErrorMessage } from '../utils/authErrors';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const { colors, isDark } = useTheme();
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateUser(fullName);
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (err: any) {
      const message = getAuthErrorMessage(err.code);
      setError(message);
      Alert.alert('Update Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <MaterialCommunityIcons name="account" size={60} color="white" />
            </View>
            <Text style={[styles.avatarSubtext, { color: colors.textSecondary }]}>Profile picture can be changed from the main profile page.</Text>
          </View>

          <View style={styles.form}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
            <CustomInput
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              icon="account-outline"
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address (Read-only)</Text>
            <CustomInput
              value={user?.email || ''}
              editable={false}
              icon="email-outline"
              style={styles.readOnlyInput}
            />

            {error && (
              <View style={[styles.errorContainer, { backgroundColor: isDark ? '#3D1C1C' : '#FFEBEE', borderColor: isDark ? '#A94442' : '#FFCDD2' }]}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <CustomButton
              title={isLoading ? "Saving..." : "Save Changes"}
              onPress={handleSave}
              disabled={isLoading}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarSubtext: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  readOnlyInput: {
    opacity: 0.7,
  },
  saveButton: {
    marginTop: 20,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    marginTop: 10,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
