import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Button, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import useTheme from '@/src/constants/ThemeColor';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av'; // Import expo-av for playing sound
import CustomTimePicker from '@/src/components/CustomTimePicker';
import HedearSave from '@/src/components/HedearSave';

const AlaramSetPage = ({ route }) => {
    const { prayerName, azanTime } = route.params;

    const theme = useTheme();
    const [alarmTime, setAlarmTime] = useState(null);
    console.log(alarmTime)
    console.log(azanTime)
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [alarmOn, setAlarmOn] = useState(false);
    const [sound, setSound] = useState(null); // State to manage the sound object

    const timePickerRef = useRef(null);
    const navigation = useNavigation();
    

    // Request notification permissions
    useEffect(() => {
        const requestPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('You need to enable notifications for alarms to work.');
            }
        };
        requestPermissions();
    }, []);

    const scheduleNotification = async () => {
        if (!selectedVoice) {
            alert('Please select an Azan voice.');
            return;
        }

        const trigger = {
            type: 'date', 
            timestamp: alarmTime.getTime(),
        };

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `Azan for ${prayerName}`,
                body: `It's time for ${prayerName} prayer!`,
                sound: true, // Play a sound
                data: { voice: selectedVoice }, 
            },
            trigger,
        });
        console.log(`Alarm set for ${prayerName} at ${azanTime}`);
    };

    // Handle alarm toggle
    const handleAlarmToggle = () => {
        if (alarmOn) {
            setAlarmOn(false);
        } else {
            if (alarmTime) {
                setAlarmOn(true);
                scheduleNotification();
            } else {
                alert('Please set an alarm time.');
            }
        }
    };

    const playSoundForTesting = async () => {
        if (!selectedVoice) {
            alert('Please select an Azan voice first.');
            return;
        }

        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
                staysActiveInBackground: true, 
            });

            const { sound } = await Audio.Sound.createAsync(selectedVoice);
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

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <HedearSave Heading='Alaram Set' />
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
                style={[
                    styles.voiceButton,
                    selectedVoice === require('../../../assets/AdhaanVioce/Asia.mp3') && styles.selectedVoiceButton,
                ]}
                onPress={() => setSelectedVoice(require('../../../assets/AdhaanVioce/Asia.mp3'))}
            >
                <Text>Select Voice 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.voiceButton,
                    selectedVoice === require('../../../assets/AdhaanVioce/Harvey.mp3') && styles.selectedVoiceButton,
                ]}
                onPress={() => setSelectedVoice(require('../../../assets/AdhaanVioce/Harvey.mp3'))}
            >
                <Text>Select Voice 2</Text>
            </TouchableOpacity>

            {/* Play Sound for Testing */}
            <TouchableOpacity style={styles.testButton} onPress={playSoundForTesting}>
                <Text style={styles.testButtonText}>Play Selected Voice</Text>
            </TouchableOpacity>

            {/* Stop Sound */}
            <TouchableOpacity style={styles.stopButton} onPress={stopSound}>
                <Text style={styles.stopButtonText}>Stop Sound</Text>
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
        backgroundColor: '#007BFF', // Highlight selected voice button
    },
    testButton: {
        padding: 10,
        backgroundColor: '#28a745',
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    testButtonText: {
        color: 'white',
        fontSize: 16,
    },
    stopButton: {
        padding: 10,
        backgroundColor: '#dc3545',
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    stopButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default AlaramSetPage;