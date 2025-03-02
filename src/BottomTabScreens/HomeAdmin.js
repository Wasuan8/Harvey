import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView, SafeAreaView, useWindowDimensions, Dimensions } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import useTheme from "../constants/ThemeColor";
import StatusAdmin from "../SubComponents/StatusAdmin";
import Headerdash from "../components/Headerdash";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "expo-router";
import ToastAlert from "../utils/ToastAlert";






const HomeAdmin = () => {
  const navigation = useNavigation();
  const toastRef = useRef(null);

  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width;
  const itemSize = screenWidth / numColumns - 25;
  const services = [
    { id: '1', name: 'User List', icon: require('../../assets/Icon/UserList.png'), Tab: 'ComingSoon' },
    { id: '2', name: 'Login List', icon: require('../../assets/Icon/LoginUser.png'), Tab: 'ComingSoon' },
    { id: '3', name: 'Donation Class', icon: require('../../assets/Icon/Zakat.png'), Tab: 'Donate' },
    { id: '4', name: 'Event Manager', icon: require('../../assets/Icon/Event.png'), Tab: 'ComingSoon' },
    { id: '6', name: 'Donate History', icon: require('../../assets/Icon/Donate.png'), Tab: 'ComingSoon' },
    { id: '5', name: 'Live Notify', icon: require('../../assets/Icon/Notify.png'), Tab: 'ComingSoon' },
  ];
  const HandleComigSoon = () => {
    toastRef.current.show({
      type: 'success',
      text: `Coming Soon, Under Development`,
      duration: 2000,
    });
  };

  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const [name, setName] = useState('')
  useEffect(() => {
    const retrieveData = async () => {
      try {
        const userData = await AsyncStorage.getItem('@UserData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setName(parsedData.full_name)

        }
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
    };

    retrieveData();
  }, [name])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Headerdash Heading={'Harvey Masjid'} />
      <ToastAlert ref={toastRef} />

      <FlatList
        style={styles.container}
        data={['section']} // Use a single item to create a single section
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <>
            <Image
              source={require("../../assets/images/bismillah.png")} // Use your Arabic text image
              style={[styles.arabicText, { tintColor: theme.primary }]}
              resizeMode="contain"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.placeholderTextColor }]}>Harvey Masjid</Text>
                <Text style={{ fontSize: 20, fontFamily: 'SemiBold', color: theme.heading }} >{name}</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginRight: 10 }}>
                <Image
                  source={require("../../assets/images/1.png")} // Use your Arabic text image
                  style={styles.masjid}
                  resizeMode="contain"
                />
                <Image
                  source={require("../../assets/images/3.png")} // Use your Arabic text image
                  style={styles.masjid}
                  resizeMode="contain"
                />

              </View>

            </View>


            <Text style={{ fontSize: 20, fontFamily: 'Bold', color: theme.primary, marginLeft: 10 }}>Featured</Text>

            <FlatList
              data={services}
              numColumns={numColumns}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{
                  flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (item.Tab === 'ComingSoon') {
                        HandleComigSoon();
                      } else {
                        navigation.navigate(item.Tab);
                      }
                    }}
                    style={[styles.smallcard, { width: itemSize, backgroundColor: theme.input }]}
                  >
                    <Image source={item.icon} style={styles.icon} />
                  </TouchableOpacity>
                  <Text style={[styles.text, { color: theme.primary }]}>{item.name}</Text>

                </View>
              )}
              contentContainerStyle={styles.container}
            />

            <StatusAdmin />

          </>
        )}
      />


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  header: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 10
  },
  title: {
    fontSize: 16,
    fontFamily: 'Bold'
  },
  smallcard: {
    borderRadius: 15,
    margin: 10,
    padding: 10,
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
  },
  arabicText: {
    width: 350,
    height: 100,
    marginLeft: 20,
  },
  masjid: {
    width: 100,
    height: 70,

  },

});

export default HomeAdmin;
