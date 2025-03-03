import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';

const AlarmScreen = ({ route }) => {
  const [sound, setSound] = useState(null);
  const { alarmName, voice } = route.params;
  console.log("alarm Set Time", alarmName, voice)

  useEffect(() => {
    configurePushNotifications();

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const voice = response.notification.request.content.data.voice;
      playSound(voice);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const configurePushNotifications = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('adhan_channel', {
        name: 'adhan_channel',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: voice,
      });
    }
  };

  const playSound = async (voice) => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });

      const { sound } = await Audio.Sound.createAsync(voice);
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play sound', error);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{alarmName}</Text>
      <Button title="Stop Alarm" onPress={stopSound} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
  },
});

export default AlarmScreen;