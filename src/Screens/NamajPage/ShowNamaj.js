import { FlatList, Image, SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import useTheme from '../../constants/ThemeColor';
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { makeRequest } from '../../utils/CustomeApiCall';
import { GetMonthPrayer } from '../../utils/api';
import ToastAlert from '../../utils/ToastAlert';
import moment from 'moment';
import axios from 'axios';

// const prayerData = {
//     month: "March",
//     year: "2025",
//     days: [
//         {
//             Fajr: { azanTime: "5:28 AM", salatTime: "5:43 AM" },
//             Dhuhr: { azanTime: "12:43 PM", salatTime: "12:58 PM" },
//             Asr: { azanTime: "4:13 PM", salatTime: "4:28 PM" },
//             Maghrib: { azanTime: "6:32 PM", salatTime: "6:47 PM" },
//             Isha: { azanTime: "7:47 PM", salatTime: "8:02 PM" },
//             date: "2025-02-20",
//             day: "Sunday",
//         },
//         {
//             Fajr: { azanTime: "5:27 AM", salatTime: "5:42 AM" },
//             Dhuhr: { azanTime: "12:42 PM", salatTime: "12:57 PM" },
//             Asr: { azanTime: "4:12 PM", salatTime: "4:27 PM" },
//             Maghrib: { azanTime: "6:33 PM", salatTime: "6:48 PM" },
//             Isha: { azanTime: "7:48 PM", salatTime: "8:02 PM" },
//             date: "2025-02-21",
//             day: "Monday",

//         },
//         {
//             Fajr: { azanTime: "5:26 AM", salatTime: "5:41 AM" },
//             Dhuhr: { azanTime: "12:41 PM", salatTime: "12:56 PM" },
//             Asr: { azanTime: "4:11 PM", salatTime: "4:26 PM" },
//             Maghrib: { azanTime: "6:34 PM", salatTime: "6:49 PM" },
//             Isha: { azanTime: "7:49 PM", salatTime: "8:04 PM" },
//             date: "2025-02-22",
//             day: "Tuesday",

//         },
//         {
//             Fajr: { azanTime: "5:25 AM", salatTime: "5:40 AM" },
//             Dhuhr: { azanTime: "12:40 PM", salatTime: "12:55 PM" },
//             Asr: { azanTime: "4:10 PM", salatTime: "4:25 PM" },
//             Maghrib: { azanTime: "6:35 PM", salatTime: "6:50 PM" },
//             Isha: { azanTime: "7:50 PM", salatTime: "8:05 PM" },
//             date: "2025-02-23",
//             day: "Wednesday",

//         },
//         {
//             Fajr: { azanTime: "5:24 AM", salatTime: "5:39 AM" },
//             Dhuhr: { azanTime: "12:39 PM", salatTime: "12:54 PM" },
//             Asr: { azanTime: "4:09 PM", salatTime: "4:24 PM" },
//             Maghrib: { azanTime: "6:36 PM", salatTime: "6:51 PM" },
//             Isha: { azanTime: "7:51 PM", salatTime: "8:06 PM" },
//             date: "2025-02-24",
//             day: "Thursday",

//         },
//         {
//             Fajr: { azanTime: "5:23 AM", salatTime: "5:38 AM" },
//             Dhuhr: { azanTime: "12:38 PM", salatTime: "12:53 PM" },
//             Asr: { azanTime: "4:08 PM", salatTime: "4:23 PM" },
//             Maghrib: { azanTime: "6:37 PM", salatTime: "6:52 PM" },
//             Isha: { azanTime: "7:52 PM", salatTime: "8:07 PM" },
//             date: "2025-02-25",
//             day: "Friday",

//         },
//         {
//             Fajr: { azanTime: "5:22 AM", salatTime: "5:37 AM" },
//             Dhuhr: { azanTime: "12:37 PM", salatTime: "12:52 PM" },
//             Asr: { azanTime: "4:07 PM", salatTime: "4:22 PM" },
//             Maghrib: { azanTime: "6:38 PM", salatTime: "6:53 PM" },
//             Isha: { azanTime: "7:53 PM", salatTime: "8:08 PM" },
//             date: "2025-02-26",
//             day: "Saturday",

//         },
//         {
//             Fajr: { azanTime: "5:21 AM", salatTime: "5:36 AM" },
//             Dhuhr: { azanTime: "12:36 PM", salatTime: "12:51 PM" },
//             Asr: { azanTime: "4:06 PM", salatTime: "4:21 PM" },
//             Maghrib: { azanTime: "6:39 PM", salatTime: "6:54 PM" },
//             Isha: { azanTime: "7:54 PM", salatTime: "8:09 PM" },
//             date: "2025-02-27",
//             day: "Sunday",

//         },
//         {
//             Fajr: { azanTime: "5:21 AM", salatTime: "5:36 AM" },
//             Dhuhr: { azanTime: "12:36 PM", salatTime: "12:51 PM" },
//             Asr: { azanTime: "4:06 PM", salatTime: "4:21 PM" },
//             Maghrib: { azanTime: "6:39 PM", salatTime: "6:54 PM" },
//             Isha: { azanTime: "7:54 PM", salatTime: "8:09 PM" },
//             date: "2025-02-28",
//             day: "Monday",

//         },
//         {
//             Fajr: { azanTime: "5:21 AM", salatTime: "5:36 AM" },
//             Dhuhr: { azanTime: "12:36 PM", salatTime: "12:51 PM" },
//             Asr: { azanTime: "4:06 PM", salatTime: "4:21 PM" },
//             Maghrib: { azanTime: "6:39 PM", salatTime: "6:54 PM" },
//             Isha: { azanTime: "7:54 PM", salatTime: "8:09 PM" },
//             date: "2025-03-01",
//             day: "Monday",

//         },

//     ]
// };

const ShowNamaj = () => {
    const theme = useTheme();
    const toastRef = useRef(null);
    const navigation = useNavigation();
    const [islamicDate, setIslamicDate] = useState('');
    const [locationAddress, setLocationAddress] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [nextPrayerIndex, setNextPrayerIndex] = useState(-1);
    const [prayerData, setPrayerData] = useState({ days: [] }); // Initialize with days as an empty array
    const currentYear = moment().year().toString();

    useEffect(() => {
        setTimeout(() => {
            SearchDataByMonths();
        }, 2000);
    }, []);

    const SearchDataByMonths = async () => {
        const fullMonthName = moment().format("MMMM");
        console.log(`${GetMonthPrayer}?month=${fullMonthName}&year=${currentYear}`);

        makeRequest(`${GetMonthPrayer}?month=${fullMonthName}&year=${currentYear}`, "get")
            .then((returnData) => {
                if (returnData?.status === 1 && returnData?.data?.days) {
                    const finalData = returnData.data.days;
                    const filteredData = finalData.map(({ _id, ...rest }) => rest);

                    setPrayerData({ days: filteredData }); // Ensure days is always an array
                    console.log(filteredData);
                } else {
                    setPrayerData({ days: [] }); // Set days to an empty array if no data is returned
                }
            })
            .catch((error) => {
                toastRef.current.show({
                    type: 'error',
                    text: `${error.msg}`,
                    duration: 2000,
                });
                setPrayerData({ days: [] }); // Set days to an empty array on error
                setTimeout(() => {
                    SearchDataByMonths();
                }, 2000);
            });
    };

    const findTodayIndex = () => {
        const todayDate = new Date().toISOString().split('T')[0];
        const index = prayerData.days.findIndex((day) => day.date === todayDate);
        return index !== -1 ? index : 0;
    };

    useEffect(() => {
        const todayIndex = findTodayIndex();
        setCurrentIndex(todayIndex);
    }, [prayerData.days]); // Re-run when prayerData.days changes

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const today = prayerData.days[currentIndex] || {}; // Fallback to an empty object if today is undefined

    const findNextPrayerIndex = () => {
        if (!today || !today.Fajr) return -1; // Return -1 if today or today.Fajr is undefined

        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const currentTotalMinutes = currentHours * 60 + currentMinutes;

        let nextIndex = -1;
        let minDiff = Infinity;

        prayers.forEach((prayer, index) => {
            const azanTime = today[prayer.key]?.azanTime;
            if (!azanTime) return; // Skip if azanTime is undefined

            const [azanHours, azanMinutes] = azanTime
                .replace(/AM|PM/, '')
                .trim()
                .split(':')
                .map(Number);

            const isPM = azanTime.includes('PM') && azanHours !== 12;
            const isAM = azanTime.includes('AM') && azanHours === 12;
            const azan24Hours = isPM ? azanHours + 12 : isAM ? 0 : azanHours;

            const azanTotalMinutes = azan24Hours * 60 + azanMinutes;

            let diff = azanTotalMinutes - currentTotalMinutes;
            if (diff < 0) diff += 1440; // Handle wrap-around (next day)

            if (diff > 0 && diff < minDiff) {
                minDiff = diff;
                nextIndex = index;
            }
        });

        return nextIndex;
    };

    useEffect(() => {
        const nextIndex = findNextPrayerIndex();
        setNextPrayerIndex(nextIndex);
    }, [currentTime, currentIndex, today]);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < prayerData.days.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prayers = [
        { name: 'Fajr', key: 'Fajr' },
        { name: 'Dhuhr', key: 'Dhuhr' },
        { name: 'Asr', key: 'Asr' },
        { name: 'Maghrib', key: 'Maghrib' },
        { name: 'Isha', key: 'Isha' },
    ];

    const handlePrayerPress = (prayer) => {
        navigation.navigate('AlaramSetPage', {
            prayerName: prayer.name,
            azanTime: today[prayer.key]?.azanTime || 'N/A', // Fallback to 'N/A' if azanTime is undefined
        });
    };

    // Render function with null checks
    const renderPrayerItem = ({ item, index }) => {
        const isNextPrayer = index === nextPrayerIndex;
        const prayerTimes = today[item.key] || {}; 

        return (
            <TouchableOpacity
                style={[
                    styles.prayerTimeContainer,
                    isNextPrayer && { backgroundColor: theme.InActive, borderRadius: 10 },
                ]}
                // onPress={() => handlePrayerPress(item)}
            >
                <Text style={[styles.prayerTimeLabel, { color: theme.input, fontFamily: 'SemiBold' }]}>
                    {item.name}
                </Text>
                <View style={styles.timeContainer}>
                    <Text style={[styles.prayerTime, { color: theme.input, fontFamily: 'SemiBold' }]}>
                        {prayerTimes.azanTime || 'N/A'} {/* Fallback to 'N/A' if azanTime is undefined */}
                    </Text>
                    <Text style={[styles.prayerTime, { color: theme.input, fontFamily: 'SemiBold' }]}>
                        {prayerTimes.salatTime || 'N/A'} {/* Fallback to 'N/A' if salatTime is undefined */}
                    </Text>
                    <Image
                        style={{ height: 25, width: 25, tintColor: theme.input }}
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/3817/3817595.png' }}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        requestLocation();

    }, [islamicDate]);

    const requestLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "Enable location to get prayer times.");
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        fetchPrayerTimes(location.coords.latitude, location.coords.longitude);
    };

    const fetchPrayerTimes = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=99&school=1&latitudeAdjustmentMethod=3&params=18,null,null,null`
            );

            if (response.data && response.data.data) {
                const { date, meta } = response.data.data;

                const islamicYear = date.hijri.year;
                const islamicDay = date.hijri.day;
                const islamicMonth = date.hijri.month.en; 
                const locationAddress = meta.timezone; 

                const islamicDateFormatted = `${islamicDay} ${islamicMonth} ${islamicYear}`;

                setIslamicDate(islamicDateFormatted);
                setLocationAddress(locationAddress);

            }
        } catch (error) {
            console.error("Error fetching prayer times:", error);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <ToastAlert ref={toastRef} />

            <LinearGradient
                colors={[
                    '#863ED5',
                    '#3B1E77',
                    '#240F4F',
                    '#994EF8',
                    '#4E2999',
                    '#54DAF5',
                    '#DF98FA',
                    '#9055FF',
                    '#DFCBF4',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                <Image
                    source={require('../../../assets/images/Book.png')} // Use your image path
                    style={styles.overlayImage}
                    resizeMode="contain"
                />

                <View style={styles.overlay}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.header}>Prayers Time</Text>
                                <Text style={styles.subHeader}>{locationAddress}</Text>
                                <Text style={styles.hijriDate}>{islamicDate}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity>
                                    <Image
                                        style={{ width: 25, height: 25, tintColor: theme.input, marginRight: 20 }}
                                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/7099/7099096.png' }}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image
                                        style={{ width: 25, height: 25, tintColor: theme.input }}
                                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1358/1358023.png' }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                 

                    <View style={styles.navigationContainer}>
                        <TouchableOpacity onPress={handlePrevious} style={styles.navigationButton}>
                            <Image
                                style={{ width: 25, height: 25, tintColor: theme.input }}
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/9903/9903646.png' }}
                            />
                        </TouchableOpacity>
                        <Text style={[styles.date, { color: theme.input, fontFamily: 'Regular' }]}>
                            {today.day || 'N/A'}, {today.date || 'N/A'} 
                        </Text>
                        <TouchableOpacity onPress={handleNext} style={styles.navigationButton}>
                            <Image
                                style={{ width: 25, height: 25, tintColor: theme.input }}
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/9903/9903638.png' }}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.prayerTimeContainer}>
                        <Text style={[styles.prayerTimeLabel, { color: theme.input, fontFamily: 'Bold' }]}>
                            Salat
                        </Text>
                        <View style={styles.timeContainer}>
                            <Text style={[styles.prayerTime, { color: theme.input, fontFamily: 'Bold' }]}>
                                Azan Time
                            </Text>
                            <Text style={[styles.prayerTime, { color: theme.input, fontFamily: 'Bold' }]}>
                                Salat Time
                            </Text>
                        </View>
                    </View>

                    <FlatList
                        data={prayers}
                        renderItem={renderPrayerItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <Image
                    source={require('../../../assets/images/bismillah.png')}
                    style={[styles.arabicText, {tintColor: theme.input}]}
                    resizeMode="contain"
                />
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    header: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    subHeader: {
        fontSize: 16,
        color: '#fff',
        marginTop: 5,
    },
    date: {
        fontSize: 18,
        marginTop: 10,
    },
    hijriDate: {
        fontSize: 16,
        color: '#fff',
        marginTop: 5,
    },
    prayerTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        padding: 10,
    },
    prayerTimeLabel: {
        fontSize: 18,
        flex: 1,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    prayerTime: {
        fontSize: 18,
        marginHorizontal: 10,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    navigationButton: {
        padding: 10,
        borderRadius: 10,
    },
    overlayImage: {
        position: 'absolute',
        width: 400,
        height: 200,
        opacity: 0.3,
        marginTop: '50%',
    },
    arabicText: {
        position: 'absolute',
        width: 350,
        height: 100,
        opacity: 0.3,
        marginTop: '150%',
        marginLeft: 20,
    },
});

export default ShowNamaj;