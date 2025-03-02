import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";
import { useEffect, useState } from "react";

const QIBLA_LAT = 21.4225; // Mecca Latitude
const QIBLA_LON = 39.8262; // Mecca Longitude

const QiblaFinder = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [heading, setHeading] = useState(0);
    const [qiblaDirection, setQiblaDirection] = useState(0);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);

            if (loc) {
                const { latitude, longitude } = loc.coords;
                calculateQiblaDirection(latitude, longitude);
            }
        })();
    }, []);

    useEffect(() => {
        const subscription = Magnetometer.addListener((data) => {
            let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
            setHeading(angle < 0 ? angle + 360 : angle);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const calculateQiblaDirection = (lat, lon) => {
        const lat1 = (lat * Math.PI) / 180;
        const lon1 = (lon * Math.PI) / 180;
        const lat2 = (QIBLA_LAT * Math.PI) / 180;
        const lon2 = (QIBLA_LON * Math.PI) / 180;

        const deltaLon = lon2 - lon1;
        const y = Math.sin(deltaLon) * Math.cos(lat2);
        const x =
            Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
        let qiblaAngle = (Math.atan2(y, x) * 180) / Math.PI;

        qiblaAngle = (qiblaAngle + 360) % 360; // Ensure positive values
        setQiblaDirection(qiblaAngle);
    };

    const getRotation = () => {
        // Calculate the difference between the heading and Qibla direction
        let angle = (qiblaDirection - heading + 360) % 360;
        return `${angle}deg`;
    };

    if (!location) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Your Heading: {Math.round(heading)}°</Text>
            <Text style={styles.text}>Qibla Direction: {Math.round(qiblaDirection)}°</Text>
            <View style={styles.compassContainer}>
                <Image
                    source={require("../../assets/images/Compass.png")} // Your compass background image
                    style={[styles.compass, { transform: [{ rotate: getRotation() }] }]}
                />
                <Image
                    source={require("../../assets/images/Pointer.png")} // Kaaba pointer image
                    style={styles.pointer}
                />
            </View>
            <Text style={styles.instruction}>Rotate your phone to align with the Qibla direction</Text>
        </View>
    );
};

export default QiblaFinder;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 30,
    },
    compassContainer: {
        position: "relative",
        width: 250,
        height: 250,
    },
    compass: {
        width: 250,
        height: 250,
    },
    pointer: {
        position: "absolute",
        top: "20%",
        left: "30%",
        width: 150,
        height: 150,
        transform: [{ translateX: -25 }, { translateY: -125 }],
    },
    instruction: {
        fontSize: 16,
        color: "#555",
        marginTop: 20,
    },
});