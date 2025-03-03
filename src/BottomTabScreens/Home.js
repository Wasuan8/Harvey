import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, Alert, SafeAreaView, Dimensions, StyleSheet, Image, ScrollView, FlatList, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import Carousel from "../SubComponents/Carousel";
import Headerdash from "../components/Headerdash";
import useTheme from "../constants/ThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import LottieView from "lottie-react-native";
import Icon from 'react-native-vector-icons/FontAwesome'; // Use any icon library you prefer
import ToastAlert from "../utils/ToastAlert";


const Home = () => {
  const toastRef = useRef(null);

  const theme = useTheme()
  const [prayerTimes, setPrayerTimes] = useState({});
  const [ishaAngle, setIshaAngle] = useState(18); // Default Isha Angle
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();
  const [islamicDate, setIslamicDate] = useState('')
  const [locationAddress, setLocationAddress] = useState('');
  


  const services = [
    { id: '1', name: 'Prayer time', icon: require('../../assets/Icon/Prayer.png'), Tab: 'Namaj' },
    { id: '2', name: 'Al-Quran', icon: require('../../assets/Icon/Quran.png'), Tab: 'ComingSoon' },
    { id: '3', name: 'Qibla', icon: require('../../assets/Icon/Qibla.png'), Tab: 'QiblaFinder' },
    { id: '4', name: 'Mosque', icon: require('../../assets/Icon/Mosque.png'), Tab: 'ComingSoon' },
    { id: '5', name: 'Duas', icon: require('../../assets/Icon/Duas.png'), Tab: 'ComingSoon' },
    { id: '6', name: 'Community', icon: require('../../assets/Icon/Community.png'), Tab: 'ComingSoon' },
    { id: '7', name: 'Donation', icon: require('../../assets/Icon/Donation.png'), Tab: 'Donate' },
    { id: '4', name: 'Donate Zakat', icon: require('../../assets/Icon/Zakat.png'), Tab: 'ZakatCalculator' },

  ];

  const HandleComigSoon = () => {
    toastRef.current.show({
      type: 'success',
      text: `Coming Soon, Under Development`,
      duration: 2000,
    });
  };
  const numColumns = 4; // 4 columns in grid
  const screenWidth = Dimensions.get('window').width;
  const itemSize = screenWidth / numColumns - 25; // Calculate item width


  useEffect(() => {
    requestLocation();
  }, [ishaAngle]);

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Enable location to get prayer times.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
    fetchPrayerTimes(location.coords.latitude, location.coords.longitude);
  };

  const fetchPrayerTimes = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=99&school=1&latitudeAdjustmentMethod=3&params=18,null,null,null,${ishaAngle}`
      );

      if (response.data && response.data.data) {
        const { date, meta } = response.data.data;
        const timings = response.data.data.timings;

        const islamicYear = date.hijri.year;
        const islamicDay = date.hijri.day;
        const islamicMonth = date.hijri.month.en; // Month name in English
        // Extract location address
        const locationAddress = meta.timezone; // Example: "Asia/Karachi"

        // Format the Islamic date
        const islamicDateFormatted = `${islamicDay} ${islamicMonth} ${islamicYear}`;

        setPrayerTimes(timings);
        setIslamicDate(islamicDateFormatted);
        setLocationAddress(locationAddress);
      }
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
  };





  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Headerdash Heading={'Harvey Masjid'} />
      <ToastAlert ref={toastRef} />

      <FlatList
        style={{ marginBottom: 70 }}
        data={['section']} // Use a single item to create a single section
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <>
            <Carousel />
            <Image
              source={require("../../assets/images/bismillah.png")} // Use your Arabic text image
              style={[styles.arabicText, { tintColor: theme.primary }]}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 16, marginLeft: 15, fontFamily: 'Bold', color: theme.primary }}>Featured</Text>
            <FlatList
              data={services}
              numColumns={numColumns}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{
                  flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginLeft: 5
                }}>
                  <TouchableOpacity onPress={() => {
                    if (item.Tab === 'ComingSoon') {
                      HandleComigSoon();
                    } else {
                      navigation.navigate(item.Tab);
                    }
                  }} style={[styles.smallcard, { width: itemSize, backgroundColor: theme.input, }]}>
                    <Image source={item.icon} style={styles.icon} />
                  </TouchableOpacity>
                  <Text style={[styles.text, { color: theme.primary }]}>{item.name}</Text>

                </View>
              )}
              contentContainerStyle={styles.container}
            />

            <Text style={{ fontSize: 16, marginLeft: 15, marginTop: 10, fontFamily: 'Bold', color: theme.primary }}>More Featured</Text>

            <View style={styles.centeredView}>
              <View style={[styles.modalView, { backgroundColor: theme.input, borderColor: theme.textBorder, shadowColor: theme.input }]}>
                {location ? (
                  <>
                    <View style={styles.taskContainer}>
                      <Text style={{ color: theme.dropdown, fontSize: 18, fontFamily: 'Bold' }}>Live Location</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Icon name={'map-marker'} size={20} color={theme.dropdown} />
                        <Text style={{ color: theme.InActive, fontSize: 12, alignSelf: 'center', fontFamily: 'Light', marginLeft: 10 }}>{locationAddress}</Text>
                      </View>
                    </View>
                    <View style={styles.prayerTime}>
                      <Text style={[styles.label, { color: theme.dropdown }]}>Fajr:</Text>
                      <Text style={styles.time}>{prayerTimes.Fajr}</Text>
                    </View>
                    <View style={styles.prayerTime}>
                      <Text style={[styles.label, { color: theme.dropdown }]}>Zuhr:</Text>
                      <Text style={styles.time}>{prayerTimes.Dhuhr}</Text>
                    </View>
                    <View style={styles.prayerTime}>
                      <Text style={[styles.label, { color: theme.dropdown }]}>Asr (Hanafi):</Text>
                      <Text style={styles.time}>{prayerTimes.Asr}</Text>
                    </View>
                    <View style={styles.prayerTime}>
                      <Text style={[styles.label, { color: theme.dropdown }]}>Maghrib:</Text>
                      <Text style={styles.time}>{prayerTimes.Maghrib}</Text>
                    </View>
                    <View style={styles.prayerTime}>
                      <Text style={[styles.label, { color: theme.dropdown }]}>Isha ({ishaAngle}°):</Text>
                      <Text style={styles.time}>{prayerTimes.Isha}</Text>
                    </View>

                    <TouchableOpacity onPress={() => setIshaAngle(ishaAngle === 18 ? 15 : 18)} style={{ backgroundColor: theme.button, padding: 5, borderRadius: 10, alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, fontFamily: 'SemiBold', alignSelf: 'center', color: theme.input }}>Switch Isha to ${ishaAngle === 18 ? 15 : 18}</Text>
                    </TouchableOpacity>


                  </>
                ) : (

                  <View style={styles.animationContainer}>
                    <LottieView
                      style={{ height: '100%', width: '100%', }}
                      source={require('../../assets/Animation/Loader.json')}
                      autoPlay
                      loop
                    />
                  </View>
                )}
              </View>
            </View>
          </>
        )}
      />

    </SafeAreaView>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexWrap:'wrap'
  },
  smallcard: {
    borderRadius: 15,
    padding: 15,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'SemiBold',
    textAlign: 'center',
    // width: '80%'
  },

  title: {
    fontSize: 18,
    fontWeight: 'Bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  prayerTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Medium'
  },
  time: {
    fontSize: 16,
    fontWeight: 'Bold',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  animationContainer: {
    width: '50%',
    height: 50,
    alignItems: 'center',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  modalView: {
    borderRadius: 20,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  arabicText: {
    width: 350,
    height: 100,
    marginLeft: 20,
  },

});
