import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Button, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import useTheme from '../../constants/ThemeColor';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import CustomTimePicker from '../../components/CustomTimePicker';
import HedearSave from '../../components/HedearSave';

const AlaramSetPage = ({ route }) => {
    const { prayerName, azanTime } = route.params;
    const theme = useTheme();
    const [alarmTime, setAlarmTime] = useState(null);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [alarmOn, setAlarmOn] = useState(false);
    const [sound, setSound] = useState(null);
    const timePickerRef = useRef(null);
    const navigation = useNavigation();

    useEffect(() => {
        const requestPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('You need to enable notifications for alarms to work.');
            }
        };
        requestPermissions();

        // Listener to play the sound when the notification is received
        const notificationListener = Notifications.addNotificationReceivedListener(async (notification) => {
            const voicePath = notification.request.content.data.voice;
            if (voicePath) {
                console.log("Received notification for sound:", voicePath);
                await playSound(voicePath);
            }
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
        };
    }, []);

    // Function to play sound
    const playSound = async (voiceFile) => {
        try {
            console.log("Playing Sound File:", voiceFile); // Debugging
    
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
                staysActiveInBackground: true,
            });
    
            let soundPath;
            if (voiceFile === 'asia.mp3') {
                soundPath = require('../../../assets/AdhaanVioce/asia.mp3');
            } else if (voiceFile === 'harvey.mp3') {
                soundPath = require('../../../assets/AdhaanVioce/harvey.mp3');
            }
    
            if (!soundPath) {
                console.error('Invalid sound path:', voiceFile);
                return;
            }
    
            const { sound } = await Audio.Sound.createAsync(soundPath);
            setSound(sound);
            await sound.playAsync();
        } catch (error) {
            console.error('Failed to play sound:', error);
        }
    };
    

    // Schedule notification
    const scheduleNotification = async () => {
        console.log("Selected voice:", selectedVoice);
        if (!selectedVoice) {
            alert('Please select an Azan voice.');
            return;
        }

        if (!alarmTime) {
            alert('Please set an alarm time.');
            return;
        }

        const trigger = new Date(alarmTime); // Use the selected alarm time

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `Azan for ${prayerName}`,
                body: `It's time for ${prayerName} prayer!`,
                data: { voice: selectedVoice, alarmName: prayerName }, // Pass voice path
                sound: "harvey.mp3", // Ensure no default sound is played
            },
            trigger,
        });

        console.log(`Alarm set for ${prayerName} with sound ${selectedVoice} at ${moment(alarmTime).format('hh:mm A')}`);
        setAlarmOn(true);
    };

    // Handle alarm toggle
    const handleAlarmToggle = () => {
        if (alarmOn) {
            setAlarmOn(false);
            Notifications.cancelAllScheduledNotificationsAsync();
            console.log('Alarm turned off');
        } else {
            scheduleNotification();
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <HedearSave Heading='Alarm Set' />
            <Text style={styles.title}>Set Alarm for {prayerName}</Text>
            <Text style={styles.time}>Azan Time: {azanTime}</Text>

            <View style={styles.detailRow}>
                <Image
                    style={[styles.Icon, { tintColor: theme.heading }]}
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/128/17127/17127455.png' }}
                />
                <Text style={[styles.detailLabel, { color: theme.heading }]}>Task Time:</Text>
                <TouchableOpacity
                    onPress={() => timePickerRef.current.open()}
                    style={[styles.detailButton, { backgroundColor: theme.selectColor }]}
                >
                    <Text style={[styles.detailButtonText, { color: theme.heading }]}>
                        Alarm Time: {alarmTime ? moment(alarmTime).format('hh:mm A') : 'Set Time'}
                    </Text>
                </TouchableOpacity>
            </View>

            <CustomTimePicker ref={timePickerRef} onConfirm={(time) => setAlarmTime(time)} />

            {/* Voice Selection Buttons */}
            <TouchableOpacity
                style={[styles.voiceButton, selectedVoice === 'asia.mp3' && styles.selectedVoiceButton]}
                onPress={() => setSelectedVoice('asia.mp3')} // Store as a string name
            >
                <Text>Select Voice 1</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.voiceButton, selectedVoice === 'harvey.mp3' && styles.selectedVoiceButton]}
                onPress={() => setSelectedVoice('harvey.mp3')}
            >
                <Text>Select Voice 2</Text>
            </TouchableOpacity>


            <Button title={alarmOn ? 'Turn Off Alarm' : 'Turn On Alarm'} onPress={handleAlarmToggle} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: 'white',
    },
    time: {
        fontSize: 18,
        marginTop: 10,
        color: 'white',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    detailLabel: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    detailButton: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    detailButtonText: {
        fontSize: 14,
    },
    Icon: {
        width: 26,
        height: 26,
    },
    voiceButton: {
        padding: 10,
        backgroundColor: '#ddd',
        marginVertical: 5,
        borderRadius: 5,
    },
    selectedVoiceButton: {
        backgroundColor: '#007BFF',
    },
});

export default AlaramSetPage;