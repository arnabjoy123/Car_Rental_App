import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const Bookings = () => {
  return (
    <View>
      <Text style={styles.heading}>Bookings</Text>
    </View>
  );
};

export default Bookings;

const styles = StyleSheet.create({
  heading: {
    fontSize: 50,
  },
});
