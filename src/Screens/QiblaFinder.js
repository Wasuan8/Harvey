import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import QiblaCompass from '../SubComponents/useQiblaCompass'
import HedearSave from '../components/HedearSave'
import useTheme from '../constants/ThemeColor'

const QiblaFinder = () => {
    const theme = useTheme()
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <HedearSave Heading='Qibla Finder' />
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>


                <QiblaCompass
                    color={theme.primary} // optional
                    backgroundColor={theme.background} // optional
                    textStyles={{  textAlign: "center", fontSize: 20 }} // optional

                />
            </View>
        </SafeAreaView>
    )
}

export default QiblaFinder

const styles = StyleSheet.create({})