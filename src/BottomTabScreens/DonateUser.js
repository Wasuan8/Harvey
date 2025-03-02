import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { socket } from "../utils/socket"; // Import the socket instance
import { CustomDropDown } from "../components/CustomDropDown";  // Import the CustomDropDown component
import useTheme from "../constants/ThemeColor";
import { CategoryGetRT, ConfirmPayment, CreatePayment } from "../utils/api";
import SocketStatus from "../SubComponents/SocketStatus";
import Headerdash from "../components/Headerdash";
import { CustomTextInput } from "../components/CustomTextInput";
import SubmitButton from "../components/SubmitButton";
import { useFormik } from "formik";
import { SchemaAmountPay } from "../constants/Schema";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastAlert from "../utils/ToastAlert";
import { makeRequest } from "../utils/CustomeApiCall";
import { useNavigation } from "expo-router";

const DonateUser = () => {
    const toastRef = useRef(null);
    const navigation = useNavigation();

    const initialValues = {
        user_unique_id: "",
        name: "",
        number: "",
        email: "",
        category: "Select a Category",
        amount: "",
        paymentMethod: "",
    };
    const theme = useTheme()
    const [categories, setCategories] = useState([]);
    const [amount, setAmount] = useState('')
    const customDropDownRef = useRef();
    const [paymentClass, setPaymentClass] = useState([
        { Id: 1, Key: 'card', name: 'Cards', selected: false },
        { Id: 2, Key: 'klarna', name: 'Klarna', selected: false },
        { Id: 3, Key: 'cashapp', name: 'Cash App Pay', selected: false },
        { Id: 4, Key: 'amazon_pay', name: 'Amazon Pay', selected: false },
        // { Id: 8, name: 'apple_pay', selected: false },
    ]);
    const [paymentname, setPaymentName] = useState('select payment method')
    const [checkoutUrl, setCheckoutUrl] = useState(null);

    const formik = useFormik({
        initialValues,
        validationSchema: SchemaAmountPay,
        onSubmit: (values) => {
            handlePayment()
        },
    });

    const changeIsClickedState = (newValue) => {
        if (customDropDownRef.current) {
            customDropDownRef.current.setIsClicked(newValue);
        }
    };

    const handleButtonClick = () => {
        changeIsClickedState(false);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(CategoryGetRT);
                const data = await response.json();
                setCategories(data.categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        socket.on("categoryAdded", (newCategory) => {
            setCategories((prevCategories) => [...prevCategories, newCategory]);
        });

        socket.on("categoryUpdated", (updatedCategory) => {
            setCategories((prevCategories) =>
                prevCategories.map((category) =>
                    category._id === updatedCategory._id ? updatedCategory : category
                )
            );
        });

        socket.on("categoryDeleted", (deletedCategoryId) => {
            setCategories((prevCategories) =>
                prevCategories.filter((category) => category._id !== deletedCategoryId)
            );
        });

        return () => {
            socket.off("categoryAdded");
            socket.off("categoryUpdated");
            socket.off("categoryDeleted");
        };
    }, []);

    const handleCategorySelect = (index) => {
        let tempCategories = [...categories];

        tempCategories.forEach((item, ind) => {
            if (ind === index) {
                item.selected = !item.selected;
            } else {
                item.selected = false;
            }
        });

        let selectedCategory = tempCategories.find((item) => item.selected);

        if (selectedCategory) {
            formik.setFieldValue("category", selectedCategory.name)
            console.log("Selected Category ID:", selectedCategory._id);
        } else {
            formik.setFieldValue("category", "")
        }

        setCategories(tempCategories);
        handleButtonClick();
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

    useEffect(() => {
        retrieveData();
    }, [])

    const handlePayment = async () => {
        const ParamData = {
            user_unique_id: formik.values.user_unique_id,
            name: formik.values.name,
            number: formik.values.number,
            email: formik.values.email,
            category: formik.values.category,
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
                    // setCheckoutUrl(data);
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
            <Headerdash Heading={'Donate Payment'} />
            <ToastAlert ref={toastRef} />
            <SocketStatus />
            <FlatList
                style={{ marginBottom: 50 }}
                data={['section']} // Use a single item to create a single section
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <>

                        <CustomDropDown
                            data={categories}
                            ref={customDropDownRef}
                            selectedValue={formik.values.category}
                            OnSelect={handleCategorySelect}
                            Heading="Categories"
                            textPropertyName="name"
                            touched={formik.touched.category}
                            error={formik.errors.category}
                        />

                        <View style={{ marginTop: 10 }}>
                            <CustomTextInput
                                TextShow='Amount'
                                value={formik.values.amount}
                                onChangeText={formik.handleChange('amount')}
                                keyboardType="numeric"
                                placeholder={'Amount'}
                                touched={formik.touched.amount}
                                error={formik.errors.amount}
                            />
                        </View>
                        <CustomDropDown
                            data={paymentClass}
                            ref={customDropDownRef}
                            selectedValue={paymentname}
                            OnSelect={HandlePaymentSelect}
                            Heading="Payment Method"
                            textPropertyName="name"
                        />
                        <SubmitButton
                            onPress={formik.handleSubmit}
                            ShowText={`Donate $ ${formik.values.amount}`}
                        />
                    </>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
    },
    categoryItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: "#f4f4f4",
        borderRadius: 8,
    },
    categoryName: {
        fontSize: 16,
    },
});

export default DonateUser;