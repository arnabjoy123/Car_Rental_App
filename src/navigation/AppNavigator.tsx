import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import SingleDetailsPage from '../screens/SingleDetailsPage';
import BookingForm from '../screens/BookingForm';
import PaymentScreen from '../screens/PaymentScreen';

const Stack = createNativeStackNavigator();

export const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={TabNavigator} />
    <Stack.Screen
      name="SingleDetailsPage"
      options={{ presentation: 'modal' }}
      component={SingleDetailsPage}
    />
    <Stack.Screen name="BookingForm" component={BookingForm} />
    <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
  </Stack.Navigator>
);
