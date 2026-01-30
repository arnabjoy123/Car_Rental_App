import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Onboarding from '../screens/Onboarding';
import Signup from '../screens/Signup';

const Stack = createNativeStackNavigator();

export const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Onboarding" component={Onboarding} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} />
  </Stack.Navigator>
);
