import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import useTheme from '../constants/ThemeColor'

const Headerdash = ({ Heading, Onpress, url }) => {
    const theme = useTheme();

    const navigation = useNavigation()
    return (
        <View style={{ backgroundColor: theme.background, flexDirection: 'row', alignItems: 'center', paddingLeft: 10, justifyContent: 'space-between', paddingRight: 10, marginTop: 5 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignItems: 'center', justifyContent: 'center', }}>
                <Image style={{ width: 25, height: 25, tintColor: theme.primary }} source={require('../../assets/Icon/Drawer.png')} />
            </TouchableOpacity>

            <Text style={{ fontSize: 18, fontFamily:'Bold', color: theme.primary }}>{Heading}</Text>


            <TouchableOpacity onPress={Onpress} style={{ alignItems: 'center', justifyContent: 'center', }}>
                <Image style={{
                    width: 30, height: 30, tintColor: theme.text

                }} source={{ uri: url }} />

            </TouchableOpacity>



        </View>
    )
}

export default Headerdash

const styles = StyleSheet.create({})