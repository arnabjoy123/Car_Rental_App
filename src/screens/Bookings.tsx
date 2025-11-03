import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

const AddToWalletButton = ({ booking }) => {
  const handleAddToWallet = async () => {
    try {
      // Step 1: Fetch JWT from backend

      console.log('hiii 1');

      const response = await fetch(
        'http://10.39.18.50:3000/api/generate-pass',
      );

      console.log('hiii 2');
      console.log(response)
      const data = await response.json();

      console.log('hiii 3');
      console.log(data.jwt)
      if (!data.jwt) {
        Alert.alert('Failed to get JWT');
        return;
      }

      // 2️⃣ Construct Google Wallet Save URL
      const saveUrl = `https://pay.google.com/gp/v/save/${data.jwt}`;
      
      console.log('hiii 4');

      // 3️⃣ Open Google Wallet in browser or supported app
      await Linking.openURL(saveUrl);

      console.log('hiii 5');

    } catch (err) {
      console.error('Failed to add pass:', err);
    }
  };

  return (
    <TouchableOpacity style={styles.walletButton} onPress={handleAddToWallet}>
      <Text style={styles.walletButtonText}>Add to Google Wallet</Text>
    </TouchableOpacity>
  );
};

const Bookings = () => {
  const { allBookings } = useSelector(state => state.bookings);
  console.log('Bookings', allBookings);

  const renderBookingItem = ({ item }) => {
    const carName = `${item.car.make} ${item.car.model}`;
    const year = item.car.year;

    return (
      <View style={styles.card}>
        {/* Car Image */}
        <Image
          style={styles.carImage}
          source={{ uri: item.car.images[0] }}
          resizeMode="cover"
        />
        {/* Overlay gradient effect */}
        <View style={styles.imageOverlay} />

        {/* Card Content */}
        <View style={styles.cardContent}>
          {/* Car Title Section */}
          <View style={styles.titleSection}>
            <View>
              <Text style={styles.carName}>{carName}</Text>
              <Text style={styles.carYear}>{year}</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceLabel}>Total</Text>
              <Text style={styles.price}>${item.totalCost}</Text>
            </View>
          </View>

          {/* Specs Row */}
          <View style={styles.specsRow}>
            <View style={styles.specItem}>
              <Text style={styles.specIcon}>👥</Text>
              <Text style={styles.specText}>{item.car.seats} Seats</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.specItem}>
              <Text style={styles.specIcon}>⚙️</Text>
              <Text style={styles.specText}>{item.car.transmission}</Text>
            </View>
          </View>

          {/* Location & Date Section */}
          <View style={styles.detailsSection}>
            {/* Pickup */}
            <View style={styles.locationItem}>
              <View style={styles.locationIconBox}>
                <Text style={styles.locationIcon}>📍</Text>
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Pickup</Text>
                <Text style={styles.locationText}>{item.pickupLocation}</Text>
                <Text style={styles.dateText}>
                  {item.pickupDate.slice(0, 10)}
                </Text>
              </View>
            </View>

            {/* Arrow connector */}
            <View style={styles.connector}>
              <Text style={styles.connectorArrow}>→</Text>
            </View>

            {/* Dropoff */}
            <View style={styles.locationItem}>
              <View style={styles.locationIconBox}>
                <Text style={styles.locationIcon}>📍</Text>
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Dropoff</Text>
                <Text style={styles.locationText}>{item.dropLocation}</Text>
                <Text style={styles.dateText}>
                  {item.dropDate.slice(0, 10)}
                </Text>
              </View>
            </View>
          </View>
          <AddToWalletButton booking={item} />
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🚗</Text>
      <Text style={styles.emptyTitle}>No Bookings Yet</Text>
      <Text style={styles.emptyText}>
        Start exploring and book your next ride
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Bookings</Text>
        <Text style={styles.subheading}>
          {allBookings?.length || 0} active booking
          {allBookings?.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={allBookings}
        renderItem={renderBookingItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Bookings;

const styles = StyleSheet.create({
  walletButton: {
    backgroundColor: '#4285F4',
    borderRadius: 6,
    marginTop: 10,
    paddingVertical: 10,
  },
  walletButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#0f1419',
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: '#8b92a8',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    borderColor: '#1a1f2e',
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1a1f2e',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  carImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#2a3142',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  cardContent: {
    padding: 20,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  carName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  carYear: {
    fontSize: 12,
    color: '#8b92a8',
    fontWeight: '500',
  },
  priceTag: {
    backgroundColor: '#2a3142',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 11,
    color: '#8b92a8',
    fontWeight: '600',
    marginBottom: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4fb5ff',
  },
  specsRow: {
    flexDirection: 'row',
    backgroundColor: '#0f1419',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  specItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  specIcon: {
    fontSize: 18,
  },
  specText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#2a3142',
    marginHorizontal: 8,
  },
  detailsSection: {
    marginBottom: 16,
    gap: 12,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  locationIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2a3142',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 20,
  },
  locationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  locationLabel: {
    fontSize: 11,
    color: '#8b92a8',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 3,
  },
  dateText: {
    fontSize: 12,
    color: '#4fb5ff',
    fontWeight: '500',
  },
  connector: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
  },
  connectorArrow: {
    fontSize: 16,
    color: '#4fb5ff',
    fontWeight: '700',
  },
  actionButton: {
    backgroundColor: '#4fb5ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    color: '#0f1419',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#8b92a8',
    textAlign: 'center',
  },
});
