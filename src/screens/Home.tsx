import React from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import data from '../mocks/cars.json';
import { useSelector } from 'react-redux';

const Home = () => {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);

  const renderCarItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.images[0] }} style={styles.image} />
      <Text style={styles.title}>
        {item.make} {item.model} ({item.year})
      </Text>
      <Text style={styles.details}>
        Seats: {item.seats} | Transmission: {item.transmission}
      </Text>
      <Text style={styles.price}>${item.pricePerDay} / day</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headCont}>
        <Text style={styles.headText}>Welcome {user?.name}</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCarItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  headCont: {
    height: 50,
  },
  headText: {
    color: 'white',
    fontSize: 30,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: 'black',
  },
  card: {
    backgroundColor: '#ffffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#fff',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFA001',
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  button: {
    backgroundColor: 'black',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
