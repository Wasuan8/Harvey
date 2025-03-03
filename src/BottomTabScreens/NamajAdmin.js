import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import moment from "moment";
import { makeRequest } from "../utils/CustomeApiCall";
import { AddPrayer, GetMonthPrayer } from "../utils/api";
import useTheme from "../constants/ThemeColor";
import { SafeAreaView } from "react-native";
import SubmitButton from "../components/SubmitButton";
import Headerdash from "../components/Headerdash";
import CustomTimePicker from "../components/CustomTimePicker";
import { useNavigation } from "@react-navigation/native";
import ToastAlert from "../utils/ToastAlert";

const months = Array.from({ length: 12 }, (_, i) => ({
  label: moment().month(i).format("MMMM"),
  value: String(i + 1).padStart(2, "0"),
}));

const NamajAdmin = () => {
  const toastRef = useRef(null);
  const theme = useTheme();
  const navigation = useNavigation();
  const currentYear = moment().year().toString();
  const [month, setMonth] = useState("");
  const [days, setDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [addedDays, setAddedDays] = useState([]);
  const [backendData, setBackendData] = useState([]);
  const [prayerTimes, setPrayerTimes] = useState({
    Fajr: { azanTime: "", salatTime: "" },
    Dhuhr: { azanTime: "", salatTime: "" },
    Asr: { azanTime: "", salatTime: "" },
    Maghrib: { azanTime: "", salatTime: "" },
    Isha: { azanTime: "", salatTime: "" },
  });
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    generateDays(month, currentYear);
    SearchDataByMonths();
  }, [month]);

  const toggleDropdown = (date) => {
    setExpandedItems((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const generateDays = (month, year) => {
    if (!month || !year) return;

    const totalDays = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
    const allDays = [...Array(totalDays).keys()].map((d) => String(d + 1).padStart(2, "0"));

    const filteredDays = allDays.filter((day) => {
      const date = `${year}-${month}-${day}`;
      return !backendData.some((backendDay) => backendDay.date === date);
    });

    setDays(filteredDays);
    setSelectedDate(null);
  };

  const addPrayerTime = () => {
    if (!selectedDate) {
      toastRef.current.show({
        type: 'warning',
        text: "Error Please select a date.",
        duration: 2000,
      });
      return;
    }

    if (addedDays.some((day) => day.date === `${currentYear}-${month}-${selectedDate}`)) {
      toastRef.current.show({
        type: 'warning',
        text: "Prayer times for this date already exist.",
        duration: 2000,
      });
      return;
    }

    const formattedPrayerTimes = Object.keys(prayerTimes).reduce((acc, prayer) => {
      acc[prayer] = {
        azanTime: typeof prayerTimes[prayer].azanTime === "object" ? moment(prayerTimes[prayer].azanTime).format("hh:mm A") : prayerTimes[prayer].azanTime,
        salatTime: typeof prayerTimes[prayer].salatTime === "object" ? moment(prayerTimes[prayer].salatTime).format("hh:mm A") : prayerTimes[prayer].salatTime,
      };
      return acc;
    }, {});

    const newEntry = {
      date: `${currentYear}-${month}-${selectedDate}`,
      day: getDayOfWeek(selectedDate),
      ...formattedPrayerTimes,
    };
    setAddedDays([...addedDays, newEntry]);

    setDays(days.filter((day) => day !== selectedDate));
    setSelectedDate(null);

    setPrayerTimes({
      Fajr: { azanTime: "", salatTime: "" },
      Dhuhr: { azanTime: "", salatTime: "" },
      Asr: { azanTime: "", salatTime: "" },
      Maghrib: { azanTime: "", salatTime: "" },
      Isha: { azanTime: "", salatTime: "" },
    });

    toastRef.current.show({
      type: 'success',
      text: `Prayer time added for ${selectedDate}-${month}-${currentYear}`,
      duration: 2000,
    });
  };

  const submitData = async () => {
    if (addedDays.length === 0) {
      Alert.alert("Error", "No prayer times added.");
      toastRef.current.show({
        type: 'warning',
        text: "Error: No prayer times added",
        duration: 2000,
      });
      return;
    }

    const formattedData = {
      month: moment().month(parseInt(month) - 1).format("MMMM"),
      year: currentYear,
      days: addedDays,
    };

    console.log("Formatted Data:", formattedData);

    makeRequest(
      AddPrayer,
      "post",
      formattedData
    )
      .then((returnData) => {
        if (returnData.status === 1) {
          console.log(returnData);
          toastRef.current.show({
            type: 'success',
            text: `${returnData.msg}`,
            duration: 2000,
          });
          setAddedDays([]);
          setBackendData((prev) => [...prev, ...addedDays]);
        } else {
          toastRef.current.show({
            type: 'warning',
            text: `${returnData.msg}`,
            duration: 2000,
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
        toastRef.current.show({
          type: 'error',
          text: `${error.msg}`,
          duration: 2000,
        });
      });
  };

  const getDayOfWeek = (day) => {
    return moment(`${currentYear}-${month}-${day}`, "YYYY-MM-DD").format("dddd");
  };

  const handleDateSelection = (day) => {
    const date = `${currentYear}-${month}-${day}`;

    const isDateAlreadyAdded = backendData.some((backendDay) => backendDay.date === date);

    if (isDateAlreadyAdded) {
      toastRef.current.show({
        type: 'warning',
        text: "Prayer times for this date already exist.",
        duration: 2000,
      });
      return;
    }

    setSelectedDate(day);
    setShowPicker(false);

    const isFriday = getDayOfWeek(day) === "Friday";
    if (isFriday) {
      setPrayerTimes((prev) => {
        const { Dhuhr, ...rest } = prev;
        return {
          ...rest,
          Jummah: { azanTime: "", salatTime: "" },
        };
      });
    } else {
      setPrayerTimes({
        Fajr: { azanTime: "", salatTime: "" },
        Dhuhr: { azanTime: "", salatTime: "" },
        Asr: { azanTime: "", salatTime: "" },
        Maghrib: { azanTime: "", salatTime: "" },
        Isha: { azanTime: "", salatTime: "" },
      });
    }
  };

  const SearchDataByMonths = async () => {
    if (!month) return;

    const fullMonthName = moment().month(parseInt(month, 10) - 1).format("MMMM");
    makeRequest(
      `${GetMonthPrayer}?month=${fullMonthName}&year=${currentYear}`,
      "get",
    )
      .then((returnData) => {
        if (returnData?.status === 1 && returnData?.data?.days) {
          console.log(returnData.data.month);
          setBackendData(returnData.data.days);
          console.log(returnData.data.days);
        } else {
          setBackendData([]);
        }
      })
      .catch(error => {
        setBackendData([]);
      });
  };

  const filteredData = [...backendData, ...addedDays].map(({ _id, ...rest }) => rest);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Headerdash Heading={'Add Namaj'} />
      <ToastAlert ref={toastRef} />

      <FlatList
        style={{ padding: 10, marginTop: 10, marginBottom: 70 }}
        data={['section']}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <>
            <TouchableOpacity onPress={() => navigation.navigate('SalatSaved')} style={{ width: '40%', borderRadius: 20, borderWidth: 1, padding: 8, backgroundColor: theme.blurEffect, borderColor: theme.textBorder, shadowColor: theme.blurEffect, flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ height: 20, width: 20 }} source={require('../../assets/Icon/Saved.png')} />
              <Text style={{ marginLeft: 10, fontSize: 16, fontFamily: 'SemiBold', color: theme.primary }}>Saved Salat</Text>
            </TouchableOpacity>

            <Card style={{ padding: 10, marginBottom: 10, borderRadius: 15, borderWidth: 1, marginTop: 10, backgroundColor: theme.blurEffect, borderColor: theme.textBorder, shadowColor: theme.blurEffect }}>
              <Text style={{ marginTop: 10, fontSize: 16, fontFamily: 'SemiBold', color: theme.primary }}>Select Month</Text>

              <RNPickerSelect
                onValueChange={(value) => {
                  setMonth(value);
                  generateDays(value, currentYear);
                }}
                items={months}
                value={month}
                placeholder={{ label: "Select Month", value: null }}
                style={{
                  inputIOS: {
                    color: theme.heading,
                    fontSize: 16,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                  },
                  inputAndroid: {
                    color: theme.heading,
                    fontSize: 16,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                  },
                  placeholder: {
                    color: theme.InActive,
                  },
                }}
              />
              <Text style={{ marginTop: 10, fontSize: 16, fontFamily: 'SemiBold', color: theme.primary }}> Year: {currentYear}</Text>
            </Card>

            {days.length > 0 && months.length > 0 && (
              <Card style={{ padding: 10, borderRadius: 15, borderWidth: 1, backgroundColor: theme.blurEffect, borderColor: theme.textBorder, shadowColor: theme.blurEffect }}>
                <Text style={{ fontSize: 16, fontFamily: 'SemiBold', color: theme.primary }}>{`Select Date ${getDayOfWeek(selectedDate) ? getDayOfWeek(selectedDate) : ""}`}</Text>
                <SubmitButton onPress={() => setShowPicker(true)} ShowText={`Pick a Date ${selectedDate ? selectedDate : 'date'}-${month}-${currentYear}`} />

                <Modal visible={showPicker} transparent>
                  <View style={{ justifyContent: "center", backgroundColor: theme.background, marginBottom: 60, marginTop: 50, borderColor: theme.textBorder, shadowColor: theme.blurEffect }}>
                    <View style={{ padding: 10, borderRadius: 10 }}>
                      <FlatList
                        data={days}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={{ padding: 10, borderBottomWidth: 1 }}
                            onPress={() => handleDateSelection(item)}
                          >
                            <Text style={{ fontSize: 16, color: theme.heading }}>{item}-{month}-{currentYear} ({getDayOfWeek(item)})</Text>
                          </TouchableOpacity>
                        )}
                      />
                      <SubmitButton onPress={() => setShowPicker(false)} ShowText='Close' />
                    </View>
                  </View>
                </Modal>
              </Card>
            )}

            {selectedDate && (
              <Card style={{ marginTop: 10, alignItems: 'center', padding: 10, marginBottom: 15, borderRadius: 15, borderWidth: 1, backgroundColor: theme.blurEffect, borderColor: theme.textBorder, shadowColor: theme.blurEffect }}>
                <Text style={{ fontSize: 16, color: theme.heading }}>Enter Prayer Times for {selectedDate}-{month}-{currentYear} ({getDayOfWeek(selectedDate)})</Text>

                {Object.keys(prayerTimes).map((prayer) => (
                  <View key={prayer}>
                    <Paragraph style={{ fontWeight: "Bold", fontSize: 16, color: theme.primary, marginTop: 5 }}>{prayer}</Paragraph>
                    <View style={{
                      flexDirection: 'row',
                      borderWidth: 1, borderColor: theme.textBorder, width: '90%', marginTop: 8,
                      marginHorizontal: 5, borderRadius: 15, padding: 10, height: 45, justifyContent: 'space-between'
                    }}>
                      <CustomTimePicker
                        onConfirm={(text) =>
                          setPrayerTimes((prev) => ({ ...prev, [prayer]: { ...prev[prayer], azanTime: text } }))}
                        Value={prayerTimes[prayer].azanTime}
                        Placeholder="Azan time"
                      />
                      <Image style={{ height: 25, width: 25 }} source={require('../../assets/Icon/Ajaan.png')} />

                      <CustomTimePicker
                        onConfirm={(text) =>
                          setPrayerTimes((prev) => ({ ...prev, [prayer]: { ...prev[prayer], salatTime: text } }))}
                        Value={prayerTimes[prayer].salatTime}
                        Placeholder="Salat Time"
                      />
                      <Image style={{ height: 25, width: 25 }} source={require('../../assets/Icon/Salaat.png')} />
                    </View>
                  </View>
                ))}
                <SubmitButton onPress={addPrayerTime} ShowText='Add Prayer Time' />
              </Card>
            )}

            {filteredData.length > 0 && (
              <Card style={{ marginTop: 10, padding: 10, marginBottom: 15, borderRadius: 15, borderWidth: 1, backgroundColor: theme.blurEffect, borderColor: theme.textBorder, shadowColor: theme.blurEffect }}>
                <Text style={{ fontSize: 16, fontFamily: 'SemiBold', color: theme.primary }}>Added Prayer Times for {moment().month(parseInt(month) - 1).format("MMMM")}</Text>
                <FlatList
                  data={filteredData}
                  keyExtractor={(item) => item.date}
                  renderItem={({ item }) => {
                    const isExpanded = expandedItems[item.date] || false;

                    return (
                      <View style={{ padding: 10, borderBottomWidth: 1, backgroundColor: theme.blurEffect }}>
                        <TouchableOpacity
                          style={[
                            styles.selector,
                            { borderColor: theme.textBorder, backgroundColor: theme.input, flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 5 },
                          ]}
                          onPress={() => toggleDropdown(item.date)}
                        >
                          <Text style={{ fontFamily: "Bold", fontSize: 14 }}>
                            {item.date} ({item.day})
                          </Text>
                          <Animated.Image
                            style={[
                              styles.icon,
                              {
                                transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
                                tintColor: theme.placeholderTextColor,
                              },
                            ]}
                            source={{ uri: "https://cdn-icons-png.flaticon.com/128/32/32195.png" }}
                          />
                        </TouchableOpacity>

                        {isExpanded && (
                          <View style={{ backgroundColor: "#F7F7F7", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 6, marginTop: 5 }}>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingVertical: 6,
                                borderBottomWidth: 1,
                                borderBottomColor: "#E0E0E0",
                              }}
                            >
                              <Text style={{ fontFamily: "SemiBold", fontSize: 14, color: theme.dropdown, flex: 1 }}>Namaj</Text>
                              <Text style={{ color: "#007BFF", fontSize: 14, flex: 1 }}>Azan - Time</Text>
                              <Text style={{ color: "#007BFF", fontSize: 14 }}>Salat - Time</Text>
                            </View>
                            {Object.entries(item).map(([prayer, times]) =>
                              prayer !== "date" && prayer !== "day" ? (
                                <View
                                  key={prayer}
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingVertical: 6,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#E0E0E0",
                                  }}
                                >
                                  <Text style={{ fontFamily: "SemiBold", fontSize: 14, color: theme.dropdown, flex: 1 }}>{prayer}</Text>
                                  <Text style={{ color: "#007BFF", fontSize: 14, flex: 1 }}>{times.azanTime}</Text>
                                  <Text style={{ color: "#007BFF", fontSize: 14 }}>{times.salatTime}</Text>
                                </View>
                              ) : null
                            )}
                          </View>
                        )}
                      </View>
                    );
                  }}
                />
              </Card>
            )}

            <SubmitButton onPress={submitData} ShowText='Submit Prayer Times' />
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default NamajAdmin;

const styles = StyleSheet.create({
  selector: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  icon: {
    width: 16,
    height: 16,
    alignItems: 'flex-end',
    marginLeft: 5,
  },
});