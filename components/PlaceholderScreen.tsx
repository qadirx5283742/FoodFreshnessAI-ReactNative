import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

export default function PlaceholderScreen({ name }: { name: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name} Screen Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  text: { fontSize: 18, color: Colors.textSecondary },
});
