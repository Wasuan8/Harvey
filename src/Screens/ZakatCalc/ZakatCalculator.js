import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import HedearSave from '../../components/HedearSave';
import useTheme from '../../constants/ThemeColor';
import { CustomTextInput } from '../../components/CustomTextInput';
import SubmitButton from '../../components/SubmitButton';
import { useFormik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { CreatePayment } from '../../utils/api'; 
import ToastAlert from '../../utils/ToastAlert';
import { CustomDropDown } from '../../components/CustomDropDown'; 
import { makeRequest } from '../../utils/CustomeApiCall'; 


const ZakatCalculator = () => {
    const theme = useTheme();
    const toastRef = useRef(null);
    const customDropDownRef = useRef();


    const [values, setValues] = useState({
        cash: "",
        gold: "",
        silver: "",
        businessAssets: "",
        liabilities: "",
    });
    const navigation = useNavigation()
    const initialValues = {
        user_unique_id: "",
        name: "",
        number: "",
        email: "",
        amount: "",
        paymentMethod: "",
    };


    const formik = useFormik({
        initialValues,
        onSubmit: (values) => {
            handlePayment()
        },
    });
    useEffect(() => {
        const retrieveData = async () => {
            try {
                const userData = await AsyncStorage.getItem('@UserData');
                if (userData) {
                    const parsedData = JSON.parse(userData);
                    formik.setFieldValue("name", parsedData.full_name)
                    formik.setFieldValue("email", parsedData.email)
                    formik.setFieldValue("number", parsedData.phone)
                    formik.setFieldValue("user_unique_id", parsedData.id)
                }
            } catch (error) {
                console.error('Error retrieving data from AsyncStorage:', error);
            }
        };

        retrieveData()
    }, [])


    const nisabGold = 87.48 * 64; // Example gold price per gram in USD
    const nisabSilver = 612.36 * 0.8; // Example silver price per gram in USD

    const handleChange = (name, value) => {
        setValues({ ...values, [name]: value });
    };

    useEffect(() => {
        calculateZakat();
    }, [values]);

    const calculateZakat = () => {
        const totalAssets =
            Number(values.cash) +
            Number(values.gold) * 64 + // Gold price per gram in USD
            Number(values.silver) * 0.8 + // Silver price per gram in USD
            Number(values.businessAssets);

        const totalLiabilities = Number(values.liabilities);
        const netWealth = totalAssets - totalLiabilities;
        const nisab = Math.min(nisabGold, nisabSilver);
        const amount = (netWealth *  0.025).toFixed(2)

        if (netWealth >= nisab) {
            formik.setFieldValue("amount", amount)

        } else {
            formik.setFieldValue("amount", 0)
        }
    };

    const [paymentClass, setPaymentClass] = useState([
        { Id: 1, Key: 'card', name: 'Cards', selected: false },
        { Id: 2, Key: 'klarna', name: 'Klarna', selected: false },
        { Id: 3, Key: 'cashapp', name: 'Cash App Pay', selected: false },
        { Id: 4, Key: 'amazon_pay', name: 'Amazon Pay', selected: false },
        // { Id: 8, name: 'apple_pay', selected: false },
    ]);
    const [paymentname, setPaymentName] = useState('select payment method')
    const changeIsClickedState = (newValue) => {
        if (customDropDownRef.current) {
            customDropDownRef.current.setIsClicked(newValue);
        }
    };

    const handleButtonClick = () => {
        changeIsClickedState(false);
    };
    const HandlePaymentSelect = (index) => {
        const Data = paymentClass;
        let tempProfile = [...Data];
        tempProfile.forEach((item, ind) => {
            if (ind === index) {
                item.selected = !item.selected;
            } else {
                item.selected = false;
            }
        });

        let selected = tempProfile.find(item => item.selected);

        if (selected) {
            formik.setFieldValue("paymentMethod", selected.Key)
            setPaymentName(selected.name)
            console.log(selected.name);
        } else {
            formik.setFieldValue("paymentMethod", "")
            setPaymentName("")

        }
        setPaymentClass(tempProfile)
        handleButtonClick();
    };


    const handlePayment = async () => {

        const ParamData = {
            user_unique_id: formik.values.user_unique_id,
            name: formik.values.name,
            number: formik.values.number,
            email: formik.values.email,
            category: "Zakat",
            amount: formik.values.amount,
            paymentMethod: formik.values.paymentMethod
        };
        console.log(ParamData)

        makeRequest(
            CreatePayment,
            "post",
            ParamData
        )
            .then((returnData) => {
                if (returnData) {
                    const data = returnData.checkoutUrl
                    navigation.navigate('CheckOutUser', { checkoutUrl: data });
                } else {
                    console.log(returnData)
                    toastRef.current.show({
                        type: 'warning',
                        text: `${returnData}`,
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
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <HedearSave Heading='Zakat Calculator' />
            <ToastAlert ref={toastRef} />


            <ScrollView style={{ marginTop: 10 }}>
                {Object.keys(values).map((key) => (
                    <View key={key} style={styles.inputContainer}>

                        <CustomTextInput
                            TextShow={`${key.replace(/([A-Z])/g, " $1")} (USD)`}
                            value={values[key]}
                            onChangeText={(text) => handleChange(key, text)}
                            placeholder={'Enter amount'}
                            keyboardType={"numeric"}

                        />

                    </View>
                ))}
                <CustomDropDown
                    data={paymentClass}
                    ref={customDropDownRef}
                    selectedValue={paymentname}
                    OnSelect={HandlePaymentSelect}
                    Heading="Payment Method"
                    textPropertyName="name"
                />
                {formik.values.amount !== null && (
                    <SubmitButton onPress={formik.handleSubmit} ShowText={`Zakat Payable: ${formik.values.amount}`} />
                )}


            </ScrollView>
        </SafeAreaView>

    )
}

export default ZakatCalculator

const styles = StyleSheet.create({

    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#6B44C1",
        textAlign: "center",
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: "#6B44C1",
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderWidth: 2,
        borderColor: "#6B44C1",
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: "#F8F5FC",
        color: "#6B44C1",
        fontSize: 16,
    },
    resultContainer: {
        marginTop: 20,
        backgroundColor: "#D3BDF1",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    resultText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#6B44C1",
    },

})