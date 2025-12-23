import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { registerForPushNotificationsAsync, scheduleLocalNotification } from '../services/NotificationService';

import { HapticService } from '../services/HapticService';

const SETTINGS_KEY = '@app_settings';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, isDark, setTheme } = useTheme();

  // Settings State
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setNotificationsEnabled(parsed.notificationsEnabled ?? true);
        setHapticFeedback(parsed.hapticFeedback ?? true);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSetting = async (key: string, value: boolean) => {
    if (key === 'notificationsEnabled') {
      setNotificationsEnabled(value);
      if (value) {
        await registerForPushNotificationsAsync();
      }
    }
    if (key === 'hapticFeedback') setHapticFeedback(value);

    // Provide immediate haptic feedback for the toggle itself
    HapticService.selection();

    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      const currentSettings = savedSettings ? JSON.parse(savedSettings) : {};
      const newSettings = { ...currentSettings, [key]: value };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const handleTestNotification = async () => {
    HapticService.notification();
    await scheduleLocalNotification(
      "Test Notification 🍎",
      "FoodFreshnessAI notification system is working perfectly!"
    );
  };

  const SettingRow = ({ icon, label, subLabel, value, onToggle, type = 'switch', onPress }: any) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.iconBackground }]}>
          <MaterialCommunityIcons name={icon} size={22} color={colors.primary} />
        </View>
        <View>
          <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
          {subLabel && <Text style={[styles.settingSubLabel, { color: colors.textSecondary }]}>{subLabel}</Text>}
        </View>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#D1D1D1', true: colors.primary + '80' }}
          thumbColor={value ? colors.primary : '#F4F3F4'}
          ios_backgroundColor="#3e3e3e"
        />
      ) : (
        <TouchableOpacity onPress={onPress}>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <SettingRow
              icon="theme-light-dark"
              label="Dark Mode"
              subLabel="Switch between light and dark themes"
              value={isDark}
              onToggle={(val: boolean) => setTheme(val ? 'dark' : 'light')}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Notifications</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <SettingRow
              icon="bell-outline"
              label="Push Notifications"
              subLabel="Get alerts about food freshness"
              value={notificationsEnabled}
              onToggle={(val: boolean) => saveSetting('notificationsEnabled', val)}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <TouchableOpacity 
              style={[styles.testButton, { backgroundColor: colors.primary + '10' }]}
              onPress={handleTestNotification}
              disabled={!notificationsEnabled}
            >
              <MaterialCommunityIcons name="bell-ring-outline" size={20} color={colors.primary} />
              <Text style={[styles.testButtonText, { color: colors.primary }]}>Send Test Notification</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* System Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>System</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <SettingRow
              icon="vibrate"
              label="Haptic Feedback"
              subLabel="Subtle vibrations for interactions"
              value={hapticFeedback}
              onToggle={(val: boolean) => saveSetting('hapticFeedback', val)}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingRow
              icon="earth"
              label="Language"
              subLabel="English (United States)"
              type="chevron"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Support</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <SettingRow
              icon="help-circle-outline"
              label="Help & Support"
              subLabel="FAQs and contact info"
              type="chevron"
              onPress={() => router.push('/help-support')}
            />
          </View>
        </View>

        <Text style={[styles.footerText, { color: colors.textSecondary }]}>Version 1.0.0 (Build 124)</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    marginLeft: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingSubLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 10,
  },
});
