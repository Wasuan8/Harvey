import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';

const AlarmScreen = ({ route }) => {
    const [sound, setSound] = useState(null);
    const { alarmName } = route.params;

    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
            const voice = response.notification.request.content.data.voice;
            playSound(voice);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    // Play the selected Azan voice
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

    // Stop the Azan voice
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