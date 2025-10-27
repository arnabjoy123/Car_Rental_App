import React, { useState } from 'react';
import mockresponse from '../mocks/login.json';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ActivityIndicator } from 'react-native';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Too short').required('Required'),
    }),
    onSubmit: async values => {
      console.log(values);

      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        const response = mockresponse;

        if (values.email === mockresponse.user.email) {
          Alert.alert(`Welcome ${response.user.name}!`);
          navigation.replace('MainTabs');
        } else {
          throw new Error('Invalid credentials');
        }
      } catch (error) {
        Alert.alert(`Something went wrong`);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Welcome Back!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formik.values.email}
        onChangeText={formik.handleChange('email')}
        onBlur={formik.handleBlur('email')}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {formik.touched.email && formik.errors.email && (
        <Text style={styles.error}>{formik.errors.email}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        secureTextEntry
      />

      {formik.touched.password && formik.errors.password && (
        <Text style={styles.error}>{formik.errors.password}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log('Button pressed');
          formik.handleSubmit();
        }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.footerLink}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

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
  error: {
    color: 'red',
    fontSize: 14,
    fontWeight: '600',
    paddingBottom: 5,
  },
});
