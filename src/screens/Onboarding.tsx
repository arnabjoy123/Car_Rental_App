import { View, Text, Button } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const Onboarding = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Onboarding</Text>
      <Button
        title="Lets Begin"
        onPress={() => navigation.replace('MainTabs')}
      />
    </View>
  );
};

export default Onboarding;
