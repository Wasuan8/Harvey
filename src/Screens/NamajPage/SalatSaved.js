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
import { makeRequest } from "@/src/utils/CustomeApiCall";
import { GetMonthPrayer, UpdatePrayer } from "@/src/utils/api"; // Add UpdatePrayer API
import useTheme from "@/src/constants/ThemeColor";
import { SafeAreaView } from "react-native";
import SubmitButton from "@/src/components/SubmitButton";
import Headerdash from "@/src/components/Headerdash";
import CustomTimePicker from "@/src/components/CustomTimePicker";
import { useNavigation } from "@react-navigation/native";
import ToastAlert from "@/src/utils/ToastAlert";
import HedearSave from "@/src/components/HedearSave";

const months = Array.from({ length: 12 }, (_, i) => ({
    label: moment().month(i).format("MMMM"),
    value: String(i + 1).padStart(2, "0"),
}));

const SalatSaved = () => {
    const toastRef = useRef(null);

    const theme = useTheme();
    const [month, setMonth] = useState("");
    const currentYear = moment().year().toString();
    const [data, setData] = useState([]);
    const [expandedItems, setExpandedItems] = useState({});
    const [selectedDate, setSelectedDate] = useState(null); // Track selected date for editing
    const [showEditModal, setShowEditModal] = useState(false); // Control edit modal visibility
    const [prayerTimes, setPrayerTimes] = useState({
        Fajr: { azanTime: "", salatTime: "" },
        Dhuhr: { azanTime: "", salatTime: "" },
        Asr: { azanTime: "", salatTime: "" },
        Maghrib: { azanTime: "", salatTime: "" },
        Isha: { azanTime: "", salatTime: "" },
    });

    const toggleDropdown = (date) => {
        setExpandedItems((prev) => ({
            ...prev,
            [date]: !prev[date],
        }));
    };

    useEffect(() => {
        if (month) {
            SearchDataByMonths();
        }
    }, [month]);

    const months = Array.from({ length: 12 }, (_, i) => ({
        label: moment().month(i).format("MMMM"),
        value: String(i + 1).padStart(2, "0"),
    }));

    const SearchDataByMonths = async () => {
        if (!month) return;

        const fullMonthName = moment().month(parseInt(month, 10) - 1).format("MMMM");
        makeRequest(`${GetMonthPrayer}?month=${fullMonthName}&year=${currentYear}`, "get")
            .then((returnData) => {
                if (returnData?.status === 1 && returnData?.data?.days) {
                    setData(returnData.data.days);
                } else {
                    setData([]);
                }
            })
            .catch((error) => {
                toastRef.current.show({
                    type: 'error',
                    text: `${error.msg}`,
                    duration: 2000,
                });
                setData([]);

            });
    };

    const filteredData = data.map(({ _id, ...rest }) => rest);

    // Handle edit button click
    const handleEdit = (item) => {
        setSelectedDate(item.date);
        setPrayerTimes({
            Fajr: { azanTime: item.Fajr.azanTime, salatTime: item.Fajr.salatTime },
            Dhuhr: { azanTime: item.Dhuhr.azanTime, salatTime: item.Dhuhr.salatTime },
            Asr: { azanTime: item.Asr.azanTime, salatTime: item.Asr.salatTime },
            Maghrib: { azanTime: item.Maghrib.azanTime, salatTime: item.Maghrib.salatTime },
            Isha: { azanTime: item.Isha.azanTime, salatTime: item.Isha.salatTime },
        });
        setShowEditModal(true); // Show the edit modal
    };

    // Handle update prayer times
    const updatePrayerTime = async () => {
        const formattedPrayerTimes = Object.keys(prayerTimes).reduce((acc, prayer) => {
            acc[prayer] = {
              azanTime: moment(prayerTimes[prayer].azanTime, "hh:mm A").format("hh:mm A"),
              salatTime: moment(prayerTimes[prayer].salatTime, "hh:mm A").format("hh:mm A"),
            };
            return acc;
          }, {});
        const formattedData = {
            month: moment().month(parseInt(month) - 1).format("MMMM"),
            year: currentYear,
            date: selectedDate,
            updatedTimes: formattedPrayerTimes,
        };

        console.log("Formatted Data:", formattedData);

        makeRequest(UpdatePrayer, "put", formattedData)
            .then((returnData) => {
                if (returnData.status === 1) {
                    toastRef.current.show({
                        type: 'success',
                        text: `${returnData.msg}`,
                        duration: 2000,
                    }); 
                    setShowEditModal(false);
                    SearchDataByMonths(); // Refresh the data
                } else {
                    toastRef.current.show({
                        type: 'warning',
                        text: `${returnData.msg}`,
                        duration: 2000,
                    });

                }
            })
            .catch((error) => {

                console.error("Error:", error);
                toastRef.current.show({
                    type: 'error',
                    text: `${error.msg}`,
                    duration: 2000,
                });
            });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <HedearSave Heading='Saved Salat' />
            <ToastAlert ref={toastRef} />

            <ScrollView style={{ padding: 10, marginTop: 10, marginBottom: 70 }}>
                <Card style={{ padding: 15, marginBottom: 10, borderRadius: 15, borderWidth: 1, marginTop: 10, backgroundColor: theme.blurEffect, borderColor: theme.textBorder, shadowColor: theme.blurEffect }}>
                    <Text style={{ marginTop: 10, fontSize: 16, color: theme.primary }}>Select Month</Text>
                    <RNPickerSelect
                        onValueChange={(value) => {
                            setMonth(value);
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
                    <Text style={{ marginTop: 10, fontSize: 16, color: theme.primary }}> Year: {currentYear}</Text>
                </Card>

                {/* Added Prayer Times List */}
                {filteredData.length > 0 && (
                    <Card style={{marginTop: 10, padding: 10, marginBottom: 15, borderRadius: 15, borderWidth: 1, backgroundColor: theme.blurEffect, borderColor: theme.textBorder, shadowColor: theme.blurEffect  }}>
                        <Text style={{ fontSize: 16, fontFamily: "SemiBold", color: theme.heading }}>Added Prayer Times for {moment().month(parseInt(month) - 1).format("MMMM")}</Text>
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
                                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>

                                                    <TouchableOpacity onPress={() => handleEdit(item)} style={{ width: '50%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: theme.button, padding: 5, borderRadius: 10 }}>
                                                        <Image style={{ height: 20, width: 20, tintColor: theme.input }} source={require("../../../assets/Icon/Update.png")} />

                                                        <Text style={{ color: theme.input, fontSize: 16, fontFamily: 'Bold', marginLeft: 10 }}>Update</Text>

                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                        )}
                                    </View>
                                );
                            }}
                        />
                    </Card>
                )}

                {/* Edit Modal */}
                <Modal visible={showEditModal} transparent>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                        <View style={{ width: "90%", backgroundColor: theme.background, borderRadius: 15, padding: 20 }}>
                            <Text style={{ fontSize: 16, color: theme.heading }}>Edit Prayer Times for {selectedDate}</Text>

                            {Object.keys(prayerTimes).map((prayer) => (
                                <View key={prayer}>
                                    <Paragraph style={{ fontWeight: "Bold", fontSize: 16, color: theme.primary, marginTop: 5 }}>{prayer}</Paragraph>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            borderWidth: 1,
                                            borderColor: theme.textBorder,
                                            width: "90%",
                                            marginTop: 8,
                                            marginHorizontal: 5,
                                            borderRadius: 15,
                                            padding: 10,
                                            height: 45,
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <CustomTimePicker
                                            onConfirm={(text) =>
                                                setPrayerTimes((prev) => ({ ...prev, [prayer]: { ...prev[prayer], azanTime: text } }))
                                            }
                                            Value={prayerTimes[prayer].azanTime}
                                            Placeholder="Azan time"
                                        />
                                        <Image style={{ height: 25, width: 25 }} source={require("../../../assets/Icon/Ajaan.png")} />

                                        <CustomTimePicker
                                            onConfirm={(text) =>
                                                setPrayerTimes((prev) => ({ ...prev, [prayer]: { ...prev[prayer], salatTime: text } }))
                                            }
                                            Value={prayerTimes[prayer].salatTime}
                                            Placeholder="Salat Time"
                                        />
                                        <Image style={{ height: 25, width: 25 }} source={require("../../../assets/Icon/Salaat.png")} />
                                    </View>
                                </View>
                            ))}
                            <SubmitButton onPress={updatePrayerTime} ShowText="Update Prayer Time" />
                            <SubmitButton onPress={() => setShowEditModal(false)} ShowText="Close" />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SalatSaved;

const styles = StyleSheet.create({
    selector: {
        width: "100%",
        borderRadius: 10,
        borderWidth: 1,
        alignSelf: "flex-start",
        marginTop: 5,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-start",
    },
    icon: {
        width: 16,
        height: 16,
        alignItems: "flex-end",
        marginLeft: 5,
    },
});