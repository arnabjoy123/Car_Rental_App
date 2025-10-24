/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Home from './screens/Home';
import Profile from './screens/Profile';
import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Bookings from './screens/Bookings';
import Onboarding from './screens/Onboarding';
// import Feather from 'react-native-vector-icons';

const MyTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        tabBarLabel: 'Home',
        // tabBarIcon: ({ color, size }) => (
        //   // <Feather name="home" color={color} size={size} />
        // ),
      },
    },
    Bookings: Bookings,
    Profile: Profile,
  },
});

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Onboarding',
  screens: {
    Onboarding: {
      screen: Onboarding,
      options: { title: 'Welcome' },
    },
    MainTabs: {
      screen: MyTabs,
      options: { headerShown: false },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* <AppContent /> */}
      <Navigation />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hiiiii</Text>
      {/* <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },
  text: {
    color: 'white',
    fontSize: 60,
  },
});

export default App;
