import React, { useLayoutEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const LOCATIONS = ['Downtown', 'Uptown', 'Midtown', 'Suburbs'];

export function LocationSelectScreen({ route, navigation }: any) {
  // 1. Get parameter from previous screen
  const { service } = route.params;

  // 2. Customize header title dynamically using parameter
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${service} Location`,
    });
  }, [navigation, service]);

  return (
    <View style={styles.container}>
      {/* 3. Display received parameter on screen */}
      <Text style={styles.param}>Selected Service: {service}</Text>
      <Text style={styles.title}>Select Location:</Text>

      {LOCATIONS.map((location) => (
        <View key={location} style={styles.btn}>
          <Button
            title={location}
            onPress={() => navigation.navigate('Offers', { service, location })}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  param: { fontSize: 16, color: '#2563EB', fontWeight: 'bold', marginBottom: 12 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  btn: { marginBottom: 10 },
});
