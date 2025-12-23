import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { HapticService } from '../services/HapticService';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ 
  title, 
  loading, 
  style, 
  onPress,
  ...props 
}) => {
  const { colors } = useTheme();

  const handlePress = (e: any) => {
    HapticService.trigger();
    if (onPress) onPress(e);
  };

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: colors.primary, shadowColor: colors.primary }, style]} 
      disabled={loading}
      activeOpacity={0.8}
      onPress={handlePress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
