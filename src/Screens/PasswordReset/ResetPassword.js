import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import SubmitButton from '../../components/SubmitButton';
import { PasswordSchema } from '../../constants/Schema'; 
import useTheme from '../../constants/ThemeColor';
import { PasswordReset } from '../../utils/api';
import { makeRequest } from '../../utils/CustomeApiCall'; 
import { CustomTextInput } from '../../components/CustomTextInput'; 

const ResetPassword = () => {
    const theme = useTheme();
    const route = useRoute();
    const navigation = useNavigation();

    const { email, otp } = route.params || {};
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

    const formik = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: PasswordSchema,
        onSubmit: (values) => handleNewPassword(values),
    });

    const handleNewPassword = (values) => {

        const ParamData = {
            email,
            otp,
            newPassword: values.newPassword,
        };

        makeRequest(PasswordReset, "post", ParamData)
            .then((returnData) => {
                if (returnData.status === 1) {
                    setShowSuccessAnimation(true);

                    setTimeout(() => {
                        setShowSuccessAnimation(false);
                        navigation.navigate('Login');
                    }, 5000);
                } else {
                    console.error('Error:', returnData.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => setIsSubmitting(false));
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            {showSuccessAnimation ? (
                <View style={styles.animationContainer}>
                    <LottieView
                        style={{ height: '100%', width: '100%', }}
                        source={require('../../../assets/Animation/Success.json')} // Add your Lottie animation file
                        autoPlay
                        loop
                    />
                    <Text style={styles.successText}>Password Reset Successful!</Text>
                </View>
            ) : (
                <ScrollView>
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView, { backgroundColor: theme.blurEffect, borderColor: theme.textbordercolor, shadowColor: theme.blurEffect }]}>
                            <Text style={{ fontSize: 24, fontFamily: 'Bold', color: theme.primary }}>Your new password</Text>
                            <Text style={{ fontSize: 14, fontFamily: 'SemiBold', color: theme.heading, marginBottom: 10 }}>Must be different from previously used passwords for {email}</Text>

                            <CustomTextInput
                                TextShow='New Password'
                                value={formik.values.newPassword}
                                onChangeText={formik.handleChange('newPassword')}
                                placeholder={'New Password'}
                                touched={formik.touched.newPassword}
                                error={formik.errors.newPassword}
                            />

                            <CustomTextInput
                                TextShow='Confirm Password'
                                value={formik.values.confirmPassword}
                                onChangeText={formik.handleChange('confirmPassword')}
                                placeholder={'Confirm Password'}
                                touched={formik.touched.confirmPassword}
                                error={formik.errors.confirmPassword}
                            />
                        </View>
                    </View>

                    <SubmitButton onPress={formik.handleSubmit} ShowText='Submit' />
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default ResetPassword;

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 130,
    },
    modalView: {
        borderRadius: 20,
        padding: 20,
        width: '90%',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 10,
        marginTop: 20,
    },
    animationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successText: {
        fontSize: 18,
        fontFamily: 'Bold',
        color: 'green',
        marginTop: 10,
    },
});
