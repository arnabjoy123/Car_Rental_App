'use client';

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addBooking } from '../store/slices/bookingsSlice';

const validationSchema = Yup.object().shape({
  cardholderName: Yup.string()
    .required('Cardholder name is required')
    .min(3, 'Name must be at least 3 characters'),
  cardNumber: Yup.string()
    .required('Card number is required')
    .matches(/^\d{16}$/, 'Card number must be 16 digits'),
  expiryDate: Yup.string()
    .required('Expiry date is required')
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format must be MM/YY'),
  cvv: Yup.string()
    .required('CVV is required')
    .matches(/^\d{3,4}$/, 'CVV must be 3-4 digits'),
});

interface PaymentFormValues {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export default function PaymentScreen() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { bookingData } = route.params;
  console.log(bookingData);
  const initialValues: PaymentFormValues = {
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  };

  const handleSubmit = async (values: PaymentFormValues) => {
    console.log('Processing payment:', values);
    setIsSubmitted(true);

    const finalBooking = {
      ...bookingData,
      pickupDate:
        bookingData.pickupDate.toISOString?.() || bookingData.pickupDate,
      dropDate: bookingData.dropDate.toISOString?.() || bookingData.dropDate,
      payment: {
        cardholderName: values.cardholderName,
        last4: values.cardNumber.slice(-4),
        paymentDate: new Date().toISOString(),
        status: 'Paid',
      },
    };
    console.log(finalBooking);
    // Dispatch to store
    dispatch(addBooking(finalBooking));

    // Simulate payment delay
    setTimeout(() => {
      setIsSubmitted(false);
      // Navigate to Bookings tab
      navigation.navigate('MainTabs', { screen: 'Bookings' }); // 👈 name of your tab route
    }, 1500);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Secure Payment</Text>
            <Text style={styles.subtitle}>Complete your booking safely</Text>
          </View>

          {/* Card Preview */}
          <View style={styles.cardPreviewContainer}>
            <View style={styles.cardPreview}>
              <View style={styles.cardTop}>
                <View style={styles.cardChip} />
                <Text style={styles.cardBrand}>VISA</Text>
              </View>
              <Text style={styles.cardNumber}>
                {values.cardNumber
                  ? `•••• •••• •••• ${values.cardNumber.slice(-4)}`
                  : '•••• •••• •••• ••••'}
              </Text>
              <View style={styles.cardBottom}>
                <View>
                  <Text style={styles.cardLabel}>CARDHOLDER</Text>
                  <Text style={styles.cardName}>
                    {values.cardholderName || 'YOUR NAME'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.cardLabel}>EXPIRES</Text>
                  <Text style={styles.cardExpiry}>
                    {values.expiryDate || 'MM/YY'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Cardholder Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Name on Card</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'cardholderName' && styles.inputFocused,
                  touched.cardholderName &&
                    errors.cardholderName &&
                    styles.inputError,
                ]}
                placeholder="John Doe"
                placeholderTextColor="#6B7280"
                value={values.cardholderName}
                onChangeText={handleChange('cardholderName')}
                onBlur={() => {
                  handleBlur('cardholderName');
                  setFocusedField(null);
                }}
                onFocus={() => setFocusedField('cardholderName')}
              />
              {touched.cardholderName && errors.cardholderName && (
                <Text style={styles.errorText}>{errors.cardholderName}</Text>
              )}
            </View>

            {/* Card Number */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'cardNumber' && styles.inputFocused,
                  touched.cardNumber && errors.cardNumber && styles.inputError,
                ]}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#6B7280"
                value={values.cardNumber}
                onChangeText={handleChange('cardNumber')}
                onBlur={() => {
                  handleBlur('cardNumber');
                  setFocusedField(null);
                }}
                onFocus={() => setFocusedField('cardNumber')}
                maxLength={16}
                keyboardType="numeric"
              />
              {touched.cardNumber && errors.cardNumber && (
                <Text style={styles.errorText}>{errors.cardNumber}</Text>
              )}
            </View>

            {/* Expiry Date and CVV */}
            <View style={styles.rowContainer}>
              <View style={[styles.fieldContainer, styles.halfWidth]}>
                <Text style={styles.label}>Expiry Date</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === 'expiryDate' && styles.inputFocused,
                    touched.expiryDate &&
                      errors.expiryDate &&
                      styles.inputError,
                  ]}
                  placeholder="MM/YY"
                  placeholderTextColor="#6B7280"
                  value={values.expiryDate}
                  onChangeText={text => {
                    let formatted = text.replace(/[^0-9]/g, '');

                    if (formatted.length > 2) {
                      formatted =
                        formatted.slice(0, 2) + '/' + formatted.slice(2);
                    }

                    formatted = formatted.slice(0, 5);

                    handleChange('expiryDate')(formatted);
                  }}
                  onBlur={() => {
                    handleBlur('expiryDate');
                    setFocusedField(null);
                  }}
                  onFocus={() => setFocusedField('expiryDate')}
                  maxLength={5}
                  keyboardType="numeric"
                />
                {touched.expiryDate && errors.expiryDate && (
                  <Text style={styles.errorText}>{errors.expiryDate}</Text>
                )}
              </View>

              <View style={[styles.fieldContainer, styles.halfWidth]}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === 'cvv' && styles.inputFocused,
                    touched.cvv && errors.cvv && styles.inputError,
                  ]}
                  placeholder="123"
                  placeholderTextColor="#6B7280"
                  value={values.cvv}
                  onChangeText={handleChange('cvv')}
                  onBlur={() => {
                    handleBlur('cvv');
                    setFocusedField(null);
                  }}
                  onFocus={() => setFocusedField('cvv')}
                  maxLength={4}
                  keyboardType="numeric"
                  secureTextEntry
                />
                {touched.cvv && errors.cvv && (
                  <Text style={styles.errorText}>{errors.cvv}</Text>
                )}
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitted && styles.submitButtonSuccess,
                (isSubmitting || isSubmitted) && styles.submitButtonDisabled,
              ]}
              onPress={() => handleSubmit()}
              disabled={isSubmitting || isSubmitted}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator
                  color={isSubmitted ? '#FFFFFF' : '#FFFFFF'}
                />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isSubmitted ? '✓ Payment Confirmed' : 'Confirm Payment'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Order Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            <View style={styles.summaryItems}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Daily Rate</Text>
                <Text style={styles.summaryValue}>
                  ${bookingData?.car?.pricePerDay?.toFixed(2) || '0.00'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Rental Days</Text>
                <Text style={styles.summaryValue}>
                  {Math.ceil(
                    (new Date(bookingData?.dropDate) -
                      new Date(bookingData?.pickupDate)) /
                      (1000 * 60 * 60 * 24),
                  ) || 0}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Insurance</Text>
                <Text style={styles.summaryValue}>$30.00</Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryCalculation}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  {' '}
                  $
                  {(
                    bookingData?.car?.pricePerDay *
                      Math.ceil(
                        (new Date(bookingData?.dropDate) -
                          new Date(bookingData?.pickupDate)) /
                          (1000 * 60 * 60 * 24),
                      ) +
                    30
                  ).toFixed(2) || '0.00'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>
                  $
                  {(
                    (bookingData?.car?.pricePerDay *
                      Math.ceil(
                        (new Date(bookingData?.dropDate) -
                          new Date(bookingData?.pickupDate)) /
                          (1000 * 60 * 60 * 24),
                      ) +
                      30) *
                    0.08
                  ).toFixed(2) || '0.00'}
                </Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                $
                {(
                  bookingData?.car?.pricePerDay *
                    Math.ceil(
                      (new Date(bookingData?.dropDate) -
                        new Date(bookingData?.pickupDate)) /
                        (1000 * 60 * 60 * 24),
                    ) +
                  30 +
                  (bookingData?.car?.pricePerDay *
                    Math.ceil(
                      (new Date(bookingData?.dropDate) -
                        new Date(bookingData?.pickupDate)) /
                        (1000 * 60 * 60 * 24),
                    ) +
                    30) *
                    0.08
                ).toFixed(2) || '0.00'}
              </Text>
            </View>

            {/* Benefits */}
            <View style={styles.benefitsSection}>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>🔒</Text>
                <Text style={styles.benefitText}>Secure payment</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>↩️</Text>
                <Text style={styles.benefitText}>Free cancellation</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>📞</Text>
                <Text style={styles.benefitText}>24/7 support</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '400',
  },
  cardPreviewContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  cardPreview: {
    width: '100%',
    backgroundColor: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  cardChip: {
    width: 48,
    height: 38,
    backgroundColor: '#FFD700',
    borderRadius: 6,
  },
  cardBrand: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 24,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardExpiry: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  formSection: {
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  inputFocused: {
    borderColor: '#3B82F6',
    backgroundColor: '#0F172A',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonSuccess: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  summarySection: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  summaryItems: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#475569',
    marginVertical: 16,
  },
  summaryCalculation: {
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
  },
  benefitsSection: {
    borderTopWidth: 1,
    borderTopColor: '#475569',
    paddingTop: 16,
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitIcon: {
    fontSize: 18,
  },
  benefitText: {
    fontSize: 13,
    color: '#CBD5E1',
    fontWeight: '500',
  },
});
