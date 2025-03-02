import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { socket } from "../utils/socket";
import LottieView from "lottie-react-native";

const SocketStatus = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Listen for the connection event
    socket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    // Listen for disconnection
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    // Clean up listeners when component unmounts
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <View style={styles.container}>
      {isConnected ? (
        <Text style={styles.connected}>🟢 Live Update</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",

  },
  connected: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },
  disconnected: {
    fontSize: 16,
    color: "red",
    marginTop: 10,
  },
  loadingContainer: {
    alignItems: "center",
  },
  animationContainer: {
    width: '100%',
    height: 70,
    alignItems: 'center',
  },
});

export default SocketStatus;
