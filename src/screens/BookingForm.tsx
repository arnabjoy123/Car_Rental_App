'use client';

import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MapView, { Marker } from 'react-native-maps';
import DatePicker from 'react-native-date-picker';

const BookingForm = () => {
  const route = useRoute();
  const { car } = route.params;
  const navigation = useNavigation();
  const [openMap, setOpenMap] = useState(false);
  const [dropMap, setDropMap] = useState(false);

  const [marker, setMarker] = useState(null);

  const [pickupDate, setPickupDate] = useState(new Date());
  const [dropDate, setDropDate] = useState(new Date());
  const [openPickup, setOpenPickup] = useState(false);
  const [openDrop, setOpenDrop] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');

  const [dropLocation, setDropLocation] = useState('');

  const ratePerDay = 50;

  const getTotalCost = () => {
    const diffTime = dropDate - pickupDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 0;
    return diffDays > 0 ? diffDays * ratePerDay : 0;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>Complete Your Booking</Text>
          <Text style={styles.title}>
            {car.make} {car.model}
          </Text>
          <Text style={styles.year}>{car.year}</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Pickup Location</Text>

          <TouchableOpacity
            style={[
              styles.locationField,
              openMap && styles.locationFieldActive,
            ]}
            onPress={() => setOpenMap(prev => !prev)}
          >
            <EvilIcons name="location" size={24} color="white" />
            <TextInput
              style={styles.locationInput}
              placeholder="Select pickup location"
              placeholderTextColor="#888"
              autoCapitalize="words"
              editable={false}
              value={pickupLocation}
            />
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {openMap && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 20.5937,
                  longitude: 78.9629,
                  latitudeDelta: 10,
                  longitudeDelta: 10,
                }}
                onPress={e => {
                  setMarker(e.nativeEvent.coordinate);
                  setPickupLocation(
                    `${e.nativeEvent.coordinate.latitude.toFixed(
                      2,
                    )}, ${e.nativeEvent.coordinate.longitude.toFixed(2)}`,
                  );
                }}
              >
                {marker && (
                  <Marker coordinate={marker} title="Selected Location" />
                )}
              </MapView>
            </View>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Drop Location</Text>

          <TouchableOpacity
            style={[
              styles.locationField,
              openMap && styles.locationFieldActive,
            ]}
            onPress={() => setDropMap(prev => !prev)}
          >
            <EvilIcons name="location" size={24} color="white" />
            <TextInput
              style={styles.locationInput}
              placeholder="Select drop location"
              placeholderTextColor="#888"
              autoCapitalize="words"
              editable={false}
              value={dropLocation}
            />
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {dropMap && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 20.5937,
                  longitude: 78.9629,
                  latitudeDelta: 10,
                  longitudeDelta: 10,
                }}
                onPress={e => {
                  setMarker(e.nativeEvent.coordinate);
                  setDropLocation(
                    `${e.nativeEvent.coordinate.latitude.toFixed(
                      2,
                    )}, ${e.nativeEvent.coordinate.longitude.toFixed(2)}`,
                  );
                }}
              >
                {marker && (
                  <Marker coordinate={marker} title="Selected Location" />
                )}
              </MapView>
            </View>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Pickup & Return Dates</Text>

          <View style={styles.dateRow}>
            <TouchableOpacity
              style={styles.dateField}
              onPress={() => setOpenPickup(true)}
            >
              <Text style={styles.dateLabel}>Pickup</Text>
              <Text style={styles.dateValue}>
                {pickupDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateField}
              onPress={() => setOpenDrop(true)}
            >
              <Text style={styles.dateLabel}>Return</Text>
              <Text style={styles.dateValue}>
                {dropDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <DatePicker
          modal
          mode="date"
          open={openPickup}
          date={pickupDate}
          minimumDate={new Date()}
          onConfirm={date => {
            setOpenPickup(false);
            setPickupDate(date);
          }}
          onCancel={() => setOpenPickup(false)}
        />

        <DatePicker
          modal
          mode="date"
          open={openDrop}
          date={dropDate}
          minimumDate={pickupDate}
          onConfirm={date => {
            setOpenDrop(false);
            setDropDate(date);
          }}
          onCancel={() => setOpenDrop(false)}
        />

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Total Cost</Text>
          <View style={styles.totalCostContainer}>
            <Text style={styles.totalDays}>
              {Math.ceil((dropDate - pickupDate) / (1000 * 60 * 60 * 24)) || 0}{' '}
              days
            </Text>
            <Text style={styles.totalCostValue}>${getTotalCost()}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Confirm Booking</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Need to review the car?</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SingleDetailsPage', { car: car })
            }
            activeOpacity={0.7}
          >
            <Text style={styles.footerLink}>Go back to details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BookingForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  year: {
    fontSize: 16,
    color: '#A0A0A0',
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  locationField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#2A3050',
  },
  locationFieldActive: {
    borderColor: 'white',
    backgroundColor: '#1a1a1a',
  },
  locationInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  chevron: {
    fontSize: 24,
    color: 'white',
    marginLeft: 8,
  },
  mapContainer: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    height: 280,
    borderWidth: 1.5,
    borderColor: '#2A3050',
  },
  map: {
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateField: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#2A3050',
    justifyContent: 'center',
  },
  dateLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  dateValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  dateIcon: {
    fontSize: 20,
  },
  button: {
    backgroundColor: 'white',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    flexDirection: 'row',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#0A0E27',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonArrow: {
    color: '#0A0E27',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#2A3050',
  },
  footerText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  footerLink: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  totalCostContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2A3050',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  totalDays: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  totalCostValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
});
