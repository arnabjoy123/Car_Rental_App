import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { generatePDF } from 'react-native-html-to-pdf';
import Share from 'react-native-share';
const { width } = Dimensions.get('window');

const SingleDetailsPage = () => {
  const route = useRoute();
  const { car } = route.params; 
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const navigation = useNavigation();

  console.log(car);

  const handleScroll = event => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setActiveImageIndex(currentIndex);
  };

  const handleExport = async () => {
    try {
      const htmlContent = `
      <body>
      <h1>${car.make} ${car.model} (${car.year})</h1>
      <p><strong>Seats:</strong> ${car.seats}</p>
      <p><strong>Transmission:</strong> ${car.transmission}</p>
      <p><strong>Price per day:</strong> $${car.pricePerDay}</p>
      <img src="${car.images[0]}" width="150" height="150" />
      <img src="${car.images[1]}" width="150" height="150" />
      <img src="${car.images[2]}" width="150" height="150" />
      <img src="${car.images[3]}" width="150" height="150" />
      <img src="${car.images[4]}" width="150" height="150" />
      </body>
        <style>
            h1 { color: #007BFF; font-size:60px;}
            p  {
            background-color: #f3f3f3ff;
            font-size:40px; 
            border:2px solid #007BFF ; 
            padding:8px ;
            border-radius:15px;
            }
            img{
            background-color: #f3f3f3ff;
            border: 1px solid #007BFF;
            padding:8px ;
            border-radius:5px;
            margin:5px;
            }
            body {padding:70px}
        </style>
    `;

      const pdf = await generatePDF({
        html: htmlContent,
        fileName: `${car.make}_${car.model}`,
        base64: true,
      });

      await Share.open({
        url: `file://${pdf.filePath}`,
        type: 'application/pdf',
        showAppsToView: true,
      });
    } catch (error) {
      console.log('Error generating or sharing PDF:', error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          data={car.images}
          horizontal
          pagingEnabled
          scrollEventThrottle={16}
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item: image }) => (
            <Image source={{ uri: image }} style={styles.carouselImage} />
          )}
        />

        {/* Image Indicators */}
        <View style={styles.indicatorContainer}>
          {car.images.map((_, index) => (
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

      {/* Header Section */}
      <View style={styles.headerSection}>
        <View>
          <Text style={styles.carTitle}>
            {car.make || 'Premium Vehicle'} {car.model}
          </Text>
          <Text style={styles.carYear}>{car.year || '2024'}</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton} onPress={handleExport}>
          <FontAwesome6 name="file-export" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Price Section */}
      <View style={styles.priceSection}>
        <Text style={styles.priceLabel}>Price/day</Text>
        <Text style={styles.price}>
          ${car.pricePerDay?.toLocaleString() || 'Contact for price'}
        </Text>
      </View>

      {/* Specs Grid */}
      <View style={styles.specsGrid}>
        <View style={styles.specCard}>
          <Text style={styles.specLabel}>Seats</Text>
          <Text style={styles.specValue}>{car.seats || '8'}</Text>
        </View>
        <View style={styles.specCard}>
          <Text style={styles.specLabel}>Transmission</Text>
          <Text style={styles.specValue}>{car.transmission || 'Auto'}</Text>
        </View>
        <View style={styles.specCard}>
          <Text style={styles.specLabel}>Fuel Type</Text>
          <Text style={styles.specValue}>{car.fuelType || 'Gasoline'}</Text>
        </View>
        <View style={styles.specCard}>
          <Text style={styles.specLabel}>Mileage</Text>
          <Text style={styles.specValue}>{car.mileage || '13.4 kmpl'}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('BookingForm', { car: car })}
        >
          <Text style={styles.primaryButtonText}>Book Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.secondaryButtonText}>Explore more</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

export default SingleDetailsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  carouselContainer: {
    position: 'relative',
    height: 320,
    backgroundColor: '#1a1a1a',
  },
  carouselImage: {
    width: width,
    height: 320,
    resizeMode: 'cover',
  },
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
    backgroundColor: 'white',
    width: 24,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  carTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  carYear: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
  },
  priceSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  priceLabel: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
  },
  specCard: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222222',
  },
  specLabel: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  specValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f0f0f',
  },
  secondaryButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  spacer: {
    height: 20,
  },
});
