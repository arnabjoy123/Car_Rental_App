// src/navigation/RootNavigator.js
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { AppStack } from './AppNavigator';
import { AuthStack } from './AuthNavigator';
import {
  hydrate,
  loadUserFromStorage,
  storage,
} from '../store/slices/authSlice';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const dispatch = useDispatch();
  const { loggedIn } = useSelector(state => state.auth);

  useEffect(() => {
    const persistedState = loadUserFromStorage();
    dispatch(hydrate(persistedState));
  }, [dispatch]);

  return loggedIn ? <AppStack /> : <AuthStack />;
}
