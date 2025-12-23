import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CustomInputProps extends TextInputProps {
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onRightIconPress?: () => void;
}

export const CustomInput: React.FC<CustomInputProps> = ({ 
  icon, 
  rightIcon, 
  onRightIconPress, 
  style, 
  ...props 
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      {icon && (
        <MaterialCommunityIcons 
          name={icon} 
          size={20} 
          color={colors.textSecondary} 
          style={styles.leftIcon} 
        />
      )}
      <TextInput
        style={[styles.input, { color: colors.text }, style]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
          <MaterialCommunityIcons 
            name={rightIcon} 
            size={20} 
            color={colors.textSecondary} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    marginLeft: 4,
  },
});
