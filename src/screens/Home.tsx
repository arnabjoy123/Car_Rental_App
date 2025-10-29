import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CarCard from '../components/CarCard';
import { fetchCars } from '../store/slices/carsSlice';

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { list, loading } = useSelector(state => state.cars);

  useEffect(() => {
    dispatch(fetchCars()); 
  }, [dispatch]);

  const renderCarItem = ({ item }) => {
    return <CarCard item={item} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headCont}>
        <Text style={styles.headText}>Welcome {user?.name}</Text>
      </View>
      <FlatList
        data={list}
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
    color: '#ff0101ff',
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
