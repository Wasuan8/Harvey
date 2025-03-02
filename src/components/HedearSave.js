import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import theme from '../constants/Colors'
import useTheme from '../constants/ThemeColor'

const HedearSave = ({ Heading, Onpress, Action, OnpressEdit, SaveOrEdit }) => {
    const theme = useTheme();

    const navigation = useNavigation()
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, justifyContent: 'space-between', }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' , marginLeft: 15}}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignItems: 'center', justifyContent: 'center', }}>
                    <Image style={{ width: 25, height: 35, tintColor: theme.primary }} source={require('../../assets/Icon/Back.png')} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontFamily: "Bold", fontWeight: '600', color: theme.primary,marginLeft: 10 }}>{Heading}</Text>

            </View>
            {
                SaveOrEdit !== true ?
                    <TouchableOpacity onPress={Onpress} style={{ alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ fontSize: 17, color: theme.text, }}>{Action}</Text>

                    </TouchableOpacity> :
                    <TouchableOpacity onPress={OnpressEdit} style={{ alignItems: 'center', justifyContent: 'center', }}>
                        {/* <Image style={{ width: 35, height: 35, tintColor: theme.secondary }} source={require('../assets/Images/ICON/edit.png')} /> */}

                    </TouchableOpacity>

            }
        </View>
    )
}

export default HedearSave

const styles = StyleSheet.create({})