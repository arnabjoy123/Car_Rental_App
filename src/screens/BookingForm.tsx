import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

const BookingForm = () => {
  const route = useRoute();
  const { car } = route.params;
  const navigation = useNavigation();
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>
        {car.make} {car.model} {car.year}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Location"
        // value={formik.values.name}
        // onChangeText={formik.handleChange('name')}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Landmark"
        // value={formik.values.email}
        // onChangeText={formik.handleChange('email')}
        // onBlur={formik.handleBlur('email')}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Destination"
        // value={formik.values.password}
        // onChangeText={formik.handleChange('password')}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Not Sure?</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SingleDetailsPage', { car: car })
          }
        >
          <Text style={styles.footerLink}> Go back</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default BookingForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    height: 50,
    backgroundColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: 'white',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#555',
    fontSize: 14,
  },
  footerLink: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
