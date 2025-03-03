import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Animated, Platform, SafeAreaView, } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from 'expo-router';
import { ForgotePassword } from '../../constants/Schema'; 
import { useFormik } from 'formik';
import useTheme from '../../constants/ThemeColor';
import HedearSave from '../../components/HedearSave';
import { ScrollView } from 'react-native';
import { CustomTextInput } from '../../components/CustomTextInput'; 
import SubmitButton from '../../components/SubmitButton';
import { makeRequest } from '../../utils/CustomeApiCall'; 
import { EmailVerifyPassword, OTPVerifyPassowrd } from '../../utils/api';


const initialValues = {
    email: "",
    otp: ['', '', '', '', '', ''],
    newPassword: "",
    confirmPassword: "",
};

const PasswordwithEmail = () => {
    const navigation = useNavigation();

    const [visibility, setVisibility] = useState({
        email: true,
        otp: false,

    });
    const [timer, setTimer] = useState(0);

    const toggleVisibility = (key) => {
        setVisibility((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const theme = useTheme();

    const etRefs = useRef([]);

    const handleChange = (value, index) => {
        const newOtp = [...formik.values.otp];
        newOtp[index] = value;
        formik.setFieldValue("otp", newOtp);
        if (value && index < 5) {
            etRefs.current[index + 1].focus();
        } else if (!value && index > 0) {
            etRefs.current[index - 1].focus();
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema: ForgotePassword,
        onSubmit: (values) => {
            handleSendEmail();

        },
    });

    const HandleResentOtp = () => {
        const ParamData = {
            email: formik.values.email,
        };
        console.log(ParamData)
        makeRequest(
            EmailVerifyPassword,
            "post",
            ParamData
        )
            .then((returnData) => {
                // Handle the response data
                if (returnData.status === 1) {
                    setTimer(200);
                    toggleVisibility('otp')
                    toggleVisibility('email')
                    console.log("Sending email to:", formik.values.email);
                } else {
                    console.log(returnData.status)
                    console.log(returnData)
                }
            })
            .catch(error => {
                console.log(returnData)
                console.error('Error:', error);
            });

    }

    const handleSendEmail = () => {

        const ParamData = {
            email: formik.values.email,
        };
        console.log(ParamData)
        makeRequest(
            EmailVerifyPassword,
            "post",
            ParamData
        )
            .then((returnData) => {
                // Handle the response data
                if (returnData.status === 1) {
                    console.log(returnData)
                    setTimer(500);
                    toggleVisibility('otp')
                    toggleVisibility('email')
                    console.log("Sending email to:", formik.values.email);
                } else {
                    console.log(returnData.status)
                    console.log(returnData)
                }
            })
            .catch(error => {
                console.log(returnData)
                console.error('Error:', error);
            });
    };

    const handleVerifyOTP = () => {
        const ParamData = {
            email: formik.values.email,
            otp: formik.values.otp.join("")
        };
        console.log(ParamData)
        makeRequest(
            OTPVerifyPassowrd,
            "post",
            ParamData
        )
            .then((returnData) => {
                // Handle the response data
                if (returnData.status === 1) {
                    console.log("Verifying OTP:", formik.values.otp);
                    navigation.navigate('ResetPassword', ParamData)

                } else {
                    console.log(returnData.status)
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });



    };

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [timer]);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, }}>
            <HedearSave Heading='Forgot Password' />

            <ScrollView>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>

                    <View style={styles.animationContainer}>
                        <LottieView
                            style={{ height: '100%', width: '100%', }}
                            source={require('../../../assets/Animation/Password.json')}
                            autoPlay
                            loop
                        />
                    </View>

                    {
                        visibility.email && (
                            <View style={styles.centeredView}>
                                <View style={[styles.modalView, { backgroundColor: theme.blurEffect, borderColor: theme.textBorder, shadowColor: theme.blurEffect }]}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 24, fontWeight: '600', color: theme.primary }}>Forgot your password?</Text>
                                        <Text style={{ fontSize: 16, fontWeight: '400', color: theme.placeholderTextColor, marginVertical: 10 }}>Enter your register email id and we will send you a code to reset your password</Text>
                                    </View>


                                    <CustomTextInput
                                        TextShow='Email'
                                        value={formik.values.email}
                                        onChangeText={formik.handleChange('email')}
                                        placeholder={'Enter email'}
                                        touched={formik.touched.email}
                                        error={formik.errors.email}

                                    />

                                    <SubmitButton onPress={formik.handleSubmit} ShowText='Send' />


                                </View>
                            </View>

                        )
                    }





                    {
                        visibility.otp && (

                            <View style={styles.centeredView}>
                                <View style={[styles.modalView, { backgroundColor: theme.blurEffect, borderColor: theme.textBorder, shadowColor: theme.blurEffect }]}>

                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                        <Text style={{ fontSize: 24, fontWeight: '600', color: theme.primary }}>Verification</Text>
                                        <Text style={{ fontSize: 16, fontWeight: '400', color: theme.placeholderTextColor }}>We sent an OTP code at</Text>
                                        <Text style={{ fontSize: 16, fontWeight: '500', color: theme.heading }}>{formik.values.email}</Text>
                                        <Text style={{ fontSize: 16, fontWeight: '500', color: theme.heading }}>New OTP can be requested in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')} min

                                        </Text>

                                    </View>


                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                                        {formik.values.otp.map((value, index) => (
                                            <TextInput
                                                key={index}
                                                ref={ref => etRefs.current[index] = ref}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderWidth: 1,
                                                    paddingBottom: 5,
                                                    borderColor: value ? theme.Active : theme.InActive,
                                                    fontSize: 24,
                                                    borderRadius: 10,
                                                    textAlign: 'center',
                                                    marginBottom: 10,
                                                    color: value ? theme.Active : theme.InActive,
                                                }}
                                                keyboardType='number-pad'
                                                maxLength={1}
                                                value={value === '' ? '' : '●'}
                                                onChangeText={txt => handleChange(txt, index)}
                                            />
                                        ))}
                                        {formik.touched.otp && formik.errors.otp && <Text style={styles.errorText}>{formik.errors.otp}</Text>}

                                    </View>

                                    <TouchableOpacity
                                        onPress={handleVerifyOTP}
                                        disabled={formik.values.otp.some(o => o === '')}
                                        style={[styles.sendButton, {
                                            backgroundColor: formik.values.otp.every(o => o !== '') ? theme.Active : theme.InActive,
                                        }]}>

                                        <Text style={{ fontSize: 18, textAlign: 'center', color: formik.values.otp.every(o => o !== '') ? theme.background : theme.input, fontWeight: 'bold' }}>Verify</Text>
                                    </TouchableOpacity>

                                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                        <Text style={{ fontSize: 14, color: theme.text, fontWeight: '400' }}>Didn’t receive the email?</Text>
                                        {timer === 0 && formik.values.email && (
                                            <TouchableOpacity onPress={HandleResentOtp}>
                                                <Text style={{ fontSize: 14, alignSelf: 'center', color: theme.text, fontWeight: '600' }}> Click to resend</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>


                                </View>
                            </View>
                        )
                    }






                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView >

    )
}

export default PasswordwithEmail

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    modalView: {
        borderRadius: 20,
        padding: 20,
        width: '90%',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 10,
        marginTop: 20
    },

    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    animationContainer: {
        width: '100%',
        height: 245,
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        width: '90%',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },


    sendButton: {
        paddingVertical: 12,
        padding: 10,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    sendButtonverify: {
        backgroundColor: '#994EF8',
        paddingVertical: 12,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#E0E0E0',
        paddingVertical: 12,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
    },

    errorText: {
        color: 'red',
        fontSize: 13,
        marginVertical: 5,
        marginLeft: 2,
    },
})