import { ActivityIndicator, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useTheme from '../src/constants/ThemeColor'
import { useFonts } from "expo-font";
import 'react-native-polyfill-globals/auto';
import NavigationPages from '../src/Navigation/NavigationPages';
const _layout = () => {
  const theme = useTheme();
  const themebg = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Bold: require('../assets/fonts/Poppins-Bold.ttf'),
    Black: require('../assets/fonts/Poppins-Black.ttf'),
    Light: require('../assets/fonts/Poppins-Light.ttf'),
    Regular: require('../assets/fonts/Poppins-Regular.ttf'),
    Medium: require('../assets/fonts/Poppins-Medium.ttf'),
    SemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontError) {
      console.error('⚠️ Font loading error:', fontError);
    }
    if (!fontsLoaded) {
      console.log('Fonts are still loading...');
    } else {
      console.log('Fonts loaded successfully!');
    }
  }, [fontsLoaded, fontError]);


  if (!theme) {
    console.error("⚠️ Theme is undefined! Check useTheme().");
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={theme.background}  barStyle={themebg === 'dark' ? 'light-content' : 'dark-content'} />
      <NavigationPages />
    </SafeAreaProvider>
  )
}

export default _layout

const styles = StyleSheet.create({})