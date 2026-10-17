import React, { useLayoutEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const OFFERS = ['FastFix - $40', 'ProCare - $50', 'Reliable - $45'];

// Header button defined outside component
const FilterButton = () => (
  <Button
    title="Filter"
    onPress={() => Alert.alert('Filter', 'Showing all verified offers.')}
  />
);

export function OffersScreen({ route, navigation }: any) {
  const { service, location } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Available Offers',
      headerRight: FilterButton,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.param}>Service: {service} | Location: {location}</Text>
      <Text style={styles.title}>Tap an offer to accept:</Text>

      {OFFERS.map((offer) => (
        <View key={offer} style={styles.btn}>
          <Button
            title={`Accept ${offer}`}
            onPress={() =>
              navigation.navigate('Confirmation', { service, location, offer })
            }
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  param: { fontSize: 15, color: '#2563EB', fontWeight: 'bold', marginBottom: 12 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  btn: { marginBottom: 10 },
});
