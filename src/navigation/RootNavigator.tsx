// src/navigation/RootNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { AppStack } from './AppNavigator';
import { AuthStack } from './AuthNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useSelector(state => state.auth);
  console.log(user);

  return user ? <AppStack /> : <AuthStack />;
}
