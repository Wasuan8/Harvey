import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import HedearSave from '@/src/components/HedearSave'
import ToastAlert from '@/src/utils/ToastAlert';
import { WebView } from "react-native-webview";
import { makeRequest } from '@/src/utils/CustomeApiCall';
import { ConfirmPayment } from '@/src/utils/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import useTheme from '@/src/constants/ThemeColor';


const CheckOutUser = () => {
    const theme = useTheme()
    const route = useRoute();
    const navigation = useNavigation()
    const { checkoutUrl } = route.params || {};
    const [checkout, setCheckout] = useState(null);
        const toastRef = useRef(null);
    
    useEffect(() =>{
        setCheckout(checkoutUrl)
    },[])


    const handleWebViewNavigation = async (event) => {
        const { url } = event;

        if (url.includes('success.html?session_id=')) {
            const session_id = new URL(url).searchParams.get('session_id');
            confirmPayment(session_id);
            setCheckout(null);
        }

        if (url.includes('cancel.html')) {
            Alert.alert(
                'Payment Cancelled',
                'Your payment was cancelled. You will be redirected back.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(), 
                    },
                ]
            );
        }
    };

    const confirmPayment = async (session_id) => {
        const ParamData = {
            session_id: session_id
        }
        makeRequest(
            ConfirmPayment,
            "post",
            ParamData
        )
            .then((returnData) => {
                if (returnData) {
                    console.log(returnData)
                    toastRef.current.show({
                        type: 'success',
                        text: `${returnData.message}`,
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
            <HedearSave Heading='Back' />
            <ToastAlert ref={toastRef} />

            {checkout ? (
                <WebView
                source={{ uri: checkout }}
                onNavigationStateChange={handleWebViewNavigation}
                onError={(syntheticEvent) => {
                    const { code, description } = syntheticEvent.nativeEvent;

                    if (code === -6 && description.includes('ERR_CONNECTION_REFUSED')) {
                        Alert.alert(
                            'Payment Cancelled',
                            'Your payment was cancelled. You will be redirected donation page.',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => navigation.goBack(), 
                                },
                            ]
                        );
                    }
                }}
            />
            ) : (
                <ActivityIndicator size="large" color="#0000ff" />
            )}
        </SafeAreaView>
    )
}

export default CheckOutUser

const styles = StyleSheet.create({})