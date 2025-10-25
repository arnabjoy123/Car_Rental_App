import {
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const Onboarding = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../assets/images/avis-first-fleet-750x750.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            source={require('../assets/images/Avis_Car_Rental-Logo.wine.png')}
            style={styles.logo}
          />
          <View>
            <Text style={styles.titleText}>Premium cars, enjoy the luxury</Text>
            <Text style={styles.text}>
              Premium and prestige car daily and monthly rental. Experience the
              thrill at a lower price.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace('MainTabs')}
          >
            <Text style={styles.buttonText}>Lets Begin!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-around',
  },
  logo: {
    width: 400,
    height: 120,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: 'white',
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    marginHorizontal: 40,
  },
  titleText: {
    color: 'white',
    fontSize: 40,
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 28,
    fontWeight: '600',
  },
});

export default Onboarding;
