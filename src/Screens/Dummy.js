import React, { useState } from "react";
import {
  View,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
} from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import moment from "moment";
import { makeRequest } from "../utils/CustomeApiCall";
import { AddSalat } from "../utils/api";

const months = Array.from({ length: 12 }, (_, i) => ({
  label: moment().month(i).format("MMMM"),
  value: String(i + 1).padStart(2, "0"),
}));

const years = Array.from({ length: 5 }, (_, i) => {
  const year = moment().year() - 2 + i;
  return { label: String(year), value: String(year) };
});

const Dummy = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [days, setDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [addedDays, setAddedDays] = useState([]);
  const [prayerTimes, setPrayerTimes] = useState({
    Fajr: { azanTime: "", salatTime: "" },
    Dhuhr: { azanTime: "", salatTime: "" },
    Asr: { azanTime: "", salatTime: "" },
    Maghrib: { azanTime: "", salatTime: "" },
    Isha: { azanTime: "", salatTime: "" },
  });

  const generateDays = (month, year) => {
    if (!month || !year) return;
    const totalDays = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
    setDays([...Array(totalDays).keys()].map((d) => String(d + 1).padStart(2, "0")));
    setSelectedDate(null);
    setAddedDays([]);
  };

  const addPrayerTime = () => {
    if (!selectedDate) {
      Alert.alert("Error", "Please select a date.");
      return;
    }

    if (addedDays.some((day) => day.date === selectedDate)) {
      Alert.alert("Error", "Prayer times for this date already exist.");
      return;
    }

    const newEntry = { date: selectedDate, ...prayerTimes };
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
    console.log(prayerTimes)

    Alert.alert("Success", `Prayer time added for ${selectedDate}-${month}-${year}`);
  };

  const submitData = async () => {
    if (addedDays.length === 0) {
      Alert.alert("Error", "No prayer times added.");
      return;
    }

    const formattedData = {
      month,
      year,
      days: addedDays,
    };

    console.log(formattedData)
    makeRequest(
      AddSalat,
      "post",
      formattedData
    )
      .then((returnData) => {
        // Handle the response data
        if (returnData.status == 1) {
          console.log(returnData)
          // navigation.navigate('BottomTab')


        } else {
          alert(`Message: ${returnData.message}`);
          console.log(returnData.message)

        }
      })
      .catch(error => {
        console.error('Error:', error);
        console.log(returnData.message)

      });

  };

  return (
    <ScrollView style={{ padding: 16, backgroundColor: "#f4f4f4" }}>
      <Card style={{ padding: 15, marginBottom: 16 }}>
        <Title>Select Month & Year</Title>
        <RNPickerSelect
          onValueChange={(value) => {
            setMonth(value);
            generateDays(value, year);
          }}
          items={months}
          value={month}
          placeholder={{ label: "Select Month", value: null }}
        />
        <RNPickerSelect
          onValueChange={(value) => {
            setYear(value);
            generateDays(month, value);
          }}
          items={years}
          value={year}
          placeholder={{ label: "Select Year", value: null }}
        />
      </Card>

      {days.length > 0 && (
        <Card style={{ padding: 15, marginBottom: 16 }}>
          <Title>Select Date</Title>
          <Button mode="contained" onPress={() => setShowPicker(true)}>Pick a Date</Button>
          <Modal visible={showPicker} transparent>
            <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
              <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
                <FlatList
                  data={days}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{ padding: 10, borderBottomWidth: 1 }}
                      onPress={() => {
                        setSelectedDate(item);
                        setShowPicker(false);
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{item}-{month}-{year}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </Card>
      )}

      {selectedDate && (
        <Card style={{ padding: 15, marginBottom: 16 }}>
          <Title>Enter Prayer Times for {selectedDate}-{month}-{year}</Title>
          {Object.keys(prayerTimes).map((prayer) => (
            <View key={prayer}>
              <Paragraph style={{ fontWeight: "bold" }}>{prayer}</Paragraph>
              <TextInput
                label="Azan Time"
                value={prayerTimes[prayer].azanTime}
                onChangeText={(text) =>
                  setPrayerTimes((prev) => ({ ...prev, [prayer]: { ...prev[prayer], azanTime: text } }))
                }
              />
              <TextInput
                label="Salat Time"
                value={prayerTimes[prayer].salatTime}
                onChangeText={(text) =>
                  setPrayerTimes((prev) => ({ ...prev, [prayer]: { ...prev[prayer], salatTime: text } }))
                }
              />
            </View>
          ))}
          <Button mode="contained" onPress={addPrayerTime}>Add Prayer Time</Button>
        </Card>
      )}

      {addedDays.length > 0 && (
        <Card style={{ padding: 15, marginBottom: 16 }}>
          <Title>Added Prayer Times</Title>
          <FlatList
            data={addedDays}
            keyExtractor={(item) => item.date}
            renderItem={({ item }) => (
              <View style={{ padding: 10, borderBottomWidth: 1 }}>
                <Text style={{ fontWeight: "bold" }}>{item.date}-{month}-{year}</Text>
                {Object.entries(item).map(([prayer, times]) => (
                  prayer !== "date" && (
                    <Text key={prayer}>
                      {prayer}: Azan - {times.azanTime}, Salat - {times.salatTime}
                    </Text>
                  )
                ))}
              </View>
            )}
          />
        </Card>
      )}

      <Button mode="contained" onPress={submitData} style={{ marginBottom: 10 }}>
        Submit Prayer Times
      </Button>
    </ScrollView>
  );
};

export default Dummy;
