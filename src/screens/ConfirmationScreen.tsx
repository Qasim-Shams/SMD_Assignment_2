import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export function ConfirmationScreen({ route, navigation }: any) {
  // 1. Get all passed parameters
  const { service, location, offer } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Offer Accepted!</Text>

      {/* 2. Display received parameters */}
      <Text style={styles.detail}>Service: {service}</Text>
      <Text style={styles.detail}>Location: {location}</Text>
      <Text style={styles.detail}>Offer: {offer}</Text>

      <View style={styles.btn}>
        <Button
          title="Book Another Service (popToTop)"
          onPress={() => navigation.popToTop()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: 'green', marginBottom: 16, textAlign: 'center' },
  detail: { fontSize: 16, marginBottom: 8 },
  btn: { marginTop: 20 },
});
