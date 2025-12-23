import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { CustomButton } from "../../components/CustomButton";
import { CustomInput } from "../../components/CustomInput";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getAuthErrorMessage } from "../../utils/authErrors";

export default function Register() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const { signUp } = useAuth();

  const handleCreateAccount = async () => {
    if (!fullName || !email || !password) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be minimum 6 characters long.');
      return;
    }

    setError(null);
    try {
      await signUp(email, fullName, password);
    } catch (err: any) {
      const message = getAuthErrorMessage(err.code);
      setError(message);
      Alert.alert('Registration Error', message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.title, { color: colors.primary }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Start tracking food freshness smarter</Text>

            <View style={styles.form}>
              <CustomInput
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                icon="account-outline"
              />

              <CustomInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="email-outline"
              />

              <CustomInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                icon="lock-outline"
                rightIcon={showPassword ? "eye-off" : "eye"}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              {error && (
                <View style={[styles.errorContainer, { backgroundColor: isDark ? '#3D1C1C' : '#FFEBEE', borderColor: isDark ? '#A94442' : '#FFCDD2' }]}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <CustomButton 
                title="Create Account" 
                onPress={handleCreateAccount}
                style={styles.button}
              />

              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: colors.textSecondary }]}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={[styles.loginLink, { color: colors.primary }]}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 15,
  },
  loginLink: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
