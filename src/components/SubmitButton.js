import { StyleSheet, Text, View,Pressable, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import React from 'react'
import COLORS from '../constants/Colors'
import useTheme from '../constants/ThemeColor';

const SubmitButton = ({onPress, ShowText}) => {
    const theme = useTheme();

    return (
        <KeyboardAvoidingView style={{alignItems:'center', justifyContent:'center', marginVertical: 15,}}>
            <TouchableOpacity onPress={onPress} style={{ width: '90%', backgroundColor: theme.button, padding: 10, borderRadius: 20, alignItems:'center', justifyContent:'center' }}>
                <Text style={{ fontSize: 16,  fontFamily:'Bold',  color: theme.background }}>{ShowText}</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

export default SubmitButton

const styles = StyleSheet.create({})