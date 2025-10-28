import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const CarCard = ({ item }) => {
  const navigation = useNavigation();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleScroll = event => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setActiveImageIndex(currentIndex);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imgCont}>
        <FlatList
          data={item.images}
          horizontal
          pagingEnabled
          nestedScrollEnabled
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(img, index) => index.toString()}
          renderItem={({ item: image }) => (
            <Image source={{ uri: image }} style={styles.carouselImage} />
          )}
        />
        <View style={styles.indicatorContainer}>
          {item.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                activeImageIndex === index && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      </View>
      <Text style={styles.title}>
        {item.make} {item.model} ({item.year})
      </Text>
      <Text style={styles.details}>
        Seats: {item.seats} | Transmission: {item.transmission}
      </Text>
      <Text style={styles.price}>${item.pricePerDay} / day</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SingleDetailsPage', { car: item })}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CarCard;

const styles = StyleSheet.create({
  indicatorContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  indicatorActive: {
    backgroundColor: 'black',
    width: 24,
  },
  card: {
    backgroundColor: '#3e3e3eff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#fff',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  carouselImage: {
    width: 329, // fixed width ensures proper paging scroll
    height: '100%',
    marginRight: 0,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  imgCont: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    marginBottom: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: 'white',
  },
  details: {
    fontSize: 14,
    color: 'white',
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
