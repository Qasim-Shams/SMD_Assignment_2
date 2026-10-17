import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export function BookingsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookings Tab</Text>
      <Text style={styles.text}>No active bookings yet.</Text>
      <Button
        title="Go to Services Tab"
        onPress={() => navigation.navigate('Services')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 15, color: 'gray', marginBottom: 20 },
});
