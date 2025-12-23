import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const SETTINGS_KEY = '@app_settings';

export const HapticService = {
  async isEnabled(): Promise<boolean> {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return parsed.hapticFeedback ?? true;
      }
      return true;
    } catch {
      return true;
    }
  },

  async trigger(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) {
    if (await this.isEnabled()) {
      await Haptics.impactAsync(style);
    }
  },

  async notification(type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success) {
    if (await this.isEnabled()) {
      await Haptics.notificationAsync(type);
    }
  },

  async selection() {
    if (await this.isEnabled()) {
      await Haptics.selectionAsync();
    }
  }
};
