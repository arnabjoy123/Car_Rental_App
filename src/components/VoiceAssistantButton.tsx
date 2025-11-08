// src/components/VoiceAssistantButton.js
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  startListening,
  stopListening,
  destroy,
  addEventListener,
  removeAllListeners,
  setRecognitionLanguage,
} from '@ascendtis/react-native-voice-to-text';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '@env';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const chrono = require('chrono-node');

export default function VoiceAssistantButton({
  onDatesDetected,
  loading,
  setLoading,
}) {
  const [listening, setListening] = useState(false);
  const [animValue] = useState(new Animated.Value(1));
  useEffect(() => {
    // 🟢 Register event listeners
    const resultListener = addEventListener('onSpeechResults', event => {
      console.log(event);
      const speech = event?.value || event?.text || '';
      console.log('Recognized speech:', speech);
      handleResults(speech);
    });

    const errorListener = addEventListener('onSpeechError', event => {
      console.error('Speech error:', event);
      stopVoiceRecognition();
    });

    // 🧹 Cleanup
    return () => {
      removeAllListeners('onSpeechResults');
      removeAllListeners('onSpeechError');
      destroy();
    };
  }, []);

  const requestMicPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'App requires microphone access to detect voice commands',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const startVoiceRecognition = async () => {
    const hasPermission = await requestMicPermission();
    if (!hasPermission) return;

    try {
      setListening(true);
      console.log('🎤 Starting voice recognition...');

      // Mic animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      await setRecognitionLanguage('en-US');
      await startListening();
    } catch (e) {
      console.error('Error starting voice recognition:', e);
      setListening(false);
    }
  };

  const stopVoiceRecognition = async () => {
    try {
      setListening(false);
      Animated.timing(animValue).stop();
      await stopListening();
      console.log('🛑 Voice recognition stopped');
    } catch (e) {
      console.error('Error stopping voice recognition:', e);
    }
  };

  const handleResults = async speech => {
    try {
      setLoading(true);
      console.log('raw:', speech);
      const text = (speech || '').toLowerCase().trim();
      console.log('Final recognized text:', text);

      const dates = chrono.parse(text);
      console.log('Chrono parsed:', dates);

      // // ----------------- CASE 1: One date + duration (e.g., "book on 10th for 2 days")
      if (dates.length > 1 && text.includes('for')) {
        console.log('Case: date + duration logic');

        const durationMatch = text.match(/for (\d+) (day|days|week|weeks)/);
        if (durationMatch) {
          const num = parseInt(durationMatch[1]);
          const unit = durationMatch[2];
          const startDate = dates[0].start.date();
          const endDate = new Date(startDate);
          if (unit.startsWith('day'))
            endDate.setDate(startDate.getDate() + num);
          if (unit.startsWith('week'))
            endDate.setDate(startDate.getDate() + num * 7);

          console.log(
            'Pickup:',
            startDate.toLocaleDateString(),
            'Drop:',
            endDate.toLocaleDateString(),
          );
          onDatesDetected({ pickup: startDate, drop: endDate });
          stopVoiceRecognition();
          return;
        }
      }

      // // ----------------- CASE 2: Single start-end range (e.g., "from 10th to 12th")
      if (dates.length === 1 && dates[0].end) {
        console.log('Case: direct range logic');

        const pickup = dates[0].start.date();
        const drop = dates[0].end ? dates[0].end.date() : pickup;
        console.log(
          'Pickup:',
          pickup.toLocaleDateString(),
          'Drop:',
          drop.toLocaleDateString(),
        );
        onDatesDetected({ pickup, drop });
        stopVoiceRecognition();
        return;
      }
      // // ----------------- LAST CASE: Fallback to OpenAI
      console.log('No valid dates detected, falling back to OpenAI...');

      const prompt = `
    Extract the start and end date (or duration) for a car booking request in natural language.
    Today's date is ${new Date().toDateString()}.
    Return ONLY JSON: { "pickup": "YYYY-MM-DD", "drop": "YYYY-MM-DD" }.
    Input: "${text}"
    `;

      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`, // ensure key is valid and accessible
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
          }),
        },
      );

      const data = await response.json();
      console.log('AI raw result:', data);

      const resultText = data?.choices?.[0]?.message?.content;
      if (resultText) {
        try {
          const cleaned = resultText
            .replace(/```json/i, '') // remove ```json
            .replace(/```/g, '') // remove ```
            .replace(/[\n\r]/g, '') // remove newlines
            .trim();

          // 🧠 Find JSON substring if AI wrapped it in explanation
          const jsonMatch = cleaned.match(/\{.*\}/s);
          const jsonStr = jsonMatch ? jsonMatch[0] : cleaned;

          // ✅ Parse safely
          const { pickup, drop } = JSON.parse(jsonStr);

          onDatesDetected({
            pickup: new Date(pickup),
            drop: new Date(drop),
          });
        } catch (err) {
          console.error('❌ Failed to parse AI result', err, resultText);
        }
      } else {
        console.warn('No valid response from AI.');
      }
    } catch (error) {
      console.error('handleResults error:', error);
    } finally {
      setLoading(false);
      stopVoiceRecognition();
    }
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: animValue }] }]}
    >
      <TouchableOpacity
        onPress={listening ? stopVoiceRecognition : startVoiceRecognition}
        style={[styles.button, listening && { backgroundColor: '#d9534f' }]}
      >
        <Text style={styles.icon}>
          {listening ? (
            <FontAwesome name="stop" size={24} color="white" />
          ) : (
            <Feather name="mic" size={24} color="white" />
          )}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    right: 25,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 50,
    padding: 20,
    elevation: 5,
  },
  icon: {
    fontSize: 24,
    color: 'white',
  },
});
