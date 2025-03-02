import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useEffect } from 'react'
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import useTheme from '../constants/ThemeColor';



const SplashPage = () => {
    const theme = useTheme()
    const themeImg = useColorScheme();

    const navigation = useNavigation()
    useEffect(() => {
        const timeout = setTimeout(() => {
            HandleNavigation();
        }, 2000)

    }, [])

    const HandleNavigation = async () => {
        try {
            const userData = await AsyncStorage.getItem('@UserData');
            if (userData !== null) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'BottomTab' }],
                });

            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });

            }
        } catch (error) {

            console.error('Error checking UserData:', error);
        }
    };
    const logoSource = themeImg === 'dark'
        ? require('../../assets/images/LogoDark.png')
        : require('../../assets/images/LogoLight.png');

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Animatable.Image animation="fadeIn" duration={2000} style={{ width: 250, height: 250 }} source={logoSource} />
            </View>
        </View>
    )
}

export default SplashPage

const styles = StyleSheet.create({})