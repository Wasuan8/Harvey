import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, TouchableOpacity, Pressable, ScrollView, useColorScheme } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { CustomTextInput } from '../components/CustomTextInput'
import { useFormik } from 'formik';
import SubmitButton from '../components/SubmitButton';
import { useNavigation } from '@react-navigation/native';
import { makeRequest } from '../utils/CustomeApiCall';
import HedearSave from '../components/HedearSave';
import { signInSchema } from '../constants/Schema';
import useTheme from '../constants/ThemeColor';
import { LoginURl } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastAlert from '../utils/ToastAlert';


const initialValues = {
    email: "",
    password: "",
    rem: false,
};
const Login = () => {
    const toastRef = useRef(null);

    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation()
    const themeImg = useColorScheme();


    const logoSource = themeImg === 'dark'
        ? require('../../assets/images/LogoDark.png')
        : require('../../assets/images/LogoLight.png');




    const formik = useFormik({
        initialValues,
        validationSchema: signInSchema,
        onSubmit: (values) => {
            handleLogin()
        },
    });

    const handleLogin = () => {
        const ParamData = {
            email: formik.values.email,
            password: formik.values.password,

        };
        makeRequest(
            LoginURl,
            "post",
            ParamData
        )
            .then((returnData) => {
                // Handle the response data
                if (returnData.status == 1) {
                    const userData = returnData.user;
                    console.log(userData)
                    AsyncStorage.setItem('@UserData', JSON.stringify(userData));
                    setTimeout(() => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'BottomTab' }],
                        });
                        // navigation.navigate('BottomTab')

                    }, 2000);


                }
                else {
                    console.log(returnData)
                    toastRef.current.show({
                        type: 'warning',
                        text: `${returnData.msg}`,
                        duration: 2000,
                    });
    
                }
            })
            .catch(error => {
                console.error('Error:', error);
                toastRef.current.show({
                    type: 'error',
                    text: `${error.msg}`,
                    duration: 2000,
                });

            });
    }



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <HedearSave Heading='Login' />
            <ToastAlert ref={toastRef} />


            <ScrollView>
                <View style={{ justifyContent: 'center', alignItems: 'center',  }}>
                    <Image style={{ width: 250, height: 250, resizeMode:'cover',  }} source={logoSource} />
                    <Text style={{ color: theme.primary, fontSize: 24, fontFamily:"Bold" }}>Harvey Masjid</Text>

                </View>


                <CustomTextInput
                    TextShow='Email'
                    value={formik.values.email}
                    onChangeText={formik.handleChange('email')}
                    placeholder={'Email'}
                    touched={formik.touched.email}
                    error={formik.errors.email}

                />

                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <View style={{ flexDirection: 'column' }}>


                        <Text style={{ color: theme.primary, fontSize: 16, fontFamily:'SemiBold', }}>Password</Text>

                        <View style={{
                            flexDirection: "row", justifyContent: 'space-between', alignItems: 'center',
                            borderWidth: 1, borderColor: theme.textBorder, width: '90%', backgroundColor: theme.input,
                            marginVertical: 10, borderRadius: 20, paddingLeft: 10, height: 45,
                        }}>
                            <TextInput placeholder='Password'
                                onChangeText={formik.handleChange('password')}
                                onBlur={formik.handleBlur('password')}
                                value={formik.values.password}
                                placeholderTextColor={theme.placeholderTextColor}
                                secureTextEntry={!showPassword}
                                style={{
                                    fontSize: 18,
                                    color: theme.text,
                                    flex: 1,
                                }} />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={{ marginRight: 5 }}
                            >

                                <Image
                                    source={showPassword ? { uri: 'https://cdn-icons-png.flaticon.com/128/709/709612.png' } : { uri: 'https://cdn-icons-png.flaticon.com/128/2767/2767146.png' }}
                                    style={{
                                        height: 30,
                                        width: 30,
                                        tintColor: showPassword ? theme.textBorder : null
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                        {formik.touched.password && formik.errors.password && <Text style={{ color: 'red', }}>{formik.errors.password}</Text>}
                    </View>
                </View>



                <SubmitButton
                    onPress={formik.handleSubmit}
                    ShowText='Login'
                />
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontSize: 15, color: theme.placeholderTextColor, fontWeight: '500' }}>Forgot your password?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('PasswordwithEmail')} >
                        <Text style={{ fontSize: 15, color: theme.fillIcon, fontWeight: '500' }}> Click here to reset it.</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
                    <Text style={{ fontSize: 15, color: theme.placeholderTextColor, fontWeight: '500' }}>Dont't have a account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')} >
                        <Text style={{ fontSize: 15, color: theme.fillIcon, fontWeight: '500' }}> Signup</Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>



        </SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({})