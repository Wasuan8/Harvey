import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, TouchableOpacity, Pressable, ScrollView } from 'react-native'
import React, { useRef } from 'react'
import { useFormik } from 'formik';
import SubmitButton from '../components/SubmitButton';
import HedearSave from '../components/HedearSave';
import { CustomTextInput } from '../components/CustomTextInput';
import COLORS from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { signUpSchema } from '../constants/Schema';
import { makeRequest } from '../utils/CustomeApiCall';
import useTheme from '../constants/ThemeColor';
import { RegistrationURL } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastAlert from '../utils/ToastAlert';
import { Checkbox } from 'react-native-paper';


const Register = () => {
  const toastRef = useRef(null);
  const navigation = useNavigation();
  const theme = useTheme();
  const initialValues = {
    username: "",
    email: "",
    number: "",
    password: "",
    cpassword: "",
    terms: "",
  };
  const formik = useFormik({
    initialValues,
    validationSchema: signUpSchema,
    onSubmit: (values) => {
      handleRegister()
    },
  });
  const handleRegister = () => {
    const ParamData = {
      full_name: formik.values.username,
      email: formik.values.email,
      phone: formik.values.number,
      password: formik.values.password,

    };
    console.log(ParamData)
    makeRequest(
      RegistrationURL,
      "post",
      ParamData
    )
      .then((returnData) => {
        if (returnData.status == 1) {
          const userData = returnData.user;
          console.log(userData)
          AsyncStorage.setItem('@UserData', JSON.stringify(userData));
          setTimeout(() => {
            navigation.navigate('BottomTab')

          }, 2000);
        } else {
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
      <HedearSave Heading='Register' />
      <ToastAlert ref={toastRef} />


      <ScrollView>
        <View style={{ marginTop: 40 }}>
          <CustomTextInput
            TextShow='User Name'
            value={formik.values.username}
            onChangeText={formik.handleChange('username')}
            placeholder={'User name'}
            touched={formik.touched.username}
            error={formik.errors.username}

          />
          <CustomTextInput
            TextShow='Email'
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
            placeholder={'Email'}
            touched={formik.touched.email}
            error={formik.errors.email}

          />
          <CustomTextInput
            TextShow='Phone Number'
            value={formik.values.number}
            onChangeText={formik.handleChange('number')}
            placeholder={'Number'}
            touched={formik.touched.number}
            error={formik.errors.number}
            keyboardType={'numeric'}

          />
          <CustomTextInput
            TextShow='Password'
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            placeholder={'Password'}
            touched={formik.touched.password}
            error={formik.errors.password}

          />
          <CustomTextInput
            TextShow='Confirm Password '
            value={formik.values.cpassword}
            onChangeText={formik.handleChange('cpassword')}
            placeholder={'Confirm password'}
            touched={formik.touched.cpassword}
            error={formik.errors.cpassword}

          />


        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>

          <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'flex-start', alignItems:'center', marginTop: 5 }}>
            {/* <BouncyCheckbox
              size={20}
              fillColor={theme.fillIcon}
              isChecked={formik.values.terms}
              disableBuiltInState
              iconStyle={{ borderRadius: 5, }}
              innerIconStyle={{ borderRadius: 5, }}
              textStyle={{
                textDecorationLine: "none",
              }}
              onPress={() => formik.setFieldValue('terms', !formik.values.terms)}
            /> */}
            <Checkbox
              status={formik.values.terms ? 'checked' : 'unchecked'} // Set the checkbox status
              onPress={() => formik.setFieldValue('terms', !formik.values.terms)} // Handle press
              color={theme.fillIcon} // Custom color for the checkbox
            />

            <Text style={{ textAlign: 'center', fontSize: 17, color: theme.placeholderTextColor, fontWeight: '400' }}>I agree with</Text>
            <TouchableOpacity >
              <Text style={{ textAlign: 'center', fontSize: 17, color: theme.fillIcon, fontWeight: '400' }}> terms and condition</Text>
            </TouchableOpacity>

          </View>
        </View>

        <SubmitButton
          onPress={formik.handleSubmit}
          ShowText='Register'
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
          <Text style={{ fontSize: 15, color: theme.placeholderTextColor, fontWeight: '500' }}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} >
            <Text style={{ fontSize: 15, color: theme.fillIcon, fontWeight: '500' }}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Register

const styles = StyleSheet.create({})