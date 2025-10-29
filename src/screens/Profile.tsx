import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const navigation = useNavigation();

  async function handleLogout() {
    await dispatch(logoutUser());
    navigation.navigate('Onboarding');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.user}>{user?.name}</Text>
      <View>
        <EvilIcons name="user" size={280} color="white" />
      </View>

      {/* items */}
      <View style={styles.itemCont}>
        <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate('Bookings')}>
          <FontAwesome5 name="car" size={45} color="white" />
          <Text style={styles.itemText}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <EvilIcons name="credit-card" size={45} color="white" />
          <Text style={styles.itemText}>Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Feather name="info" size={45} color="white" />
          <Text style={styles.itemText}> FAQ'S </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Feather name="settings" size={45} color="white" />
          <Text style={styles.itemText}>Settings</Text>
        </TouchableOpacity>
      </View>
      {/* end */}

      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  user: {
    color: 'white',
    fontSize: 40,
  },
  itemCont: {
    display: 'flex',
    width: '80%',
    gap: 15,
    marginBottom: 25,
  },
  item: {
    height:60,
    display: 'flex',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  itemText: {
    color: 'white',
    fontSize: 20,
  },
  button: {
    backgroundColor: 'white',
    width: 190,
    borderRadius: 10,
  },
  buttonText: {
    padding: 10,
    textAlign: 'center',
    color: 'black',
    fontSize: 30,
  },
});
