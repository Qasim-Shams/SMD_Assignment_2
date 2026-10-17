import React, { useLayoutEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const SERVICES = ['AC Technician', 'Plumber', 'Mechanic', 'Electrician', 'Carpenter', 'Painter'];

// Header button defined cleanly outside component
const InfoButton = () => (
  <Button
    title="Info"
    onPress={() => Alert.alert('Help', 'Select any service to proceed.')}
  />
);

export function ServiceSelectScreen({ navigation }: any) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Choose Service',
      headerRight: InfoButton,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Services:</Text>
      {SERVICES.map((service) => (
        <View key={service} style={styles.btn}>
          <Button
            title={service}
            onPress={() => navigation.navigate('LocationSelect', { service })}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  btn: { marginBottom: 10 },
});
