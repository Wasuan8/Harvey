import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Register from '../Screens/Register';
import Login from '../Screens/Login';
import Splash from '../Screens/SplashPage';
import BottomTab from './BottomTab';
import Dummy from '../Screens/Dummy';
import PasswordwithEmail from '../Screens/PasswordReset/PasswordwithEmail';
import ResetPassword from '../Screens/PasswordReset/ResetPassword';
import ZakatCalculator from '../Screens/ZakatCalc/ZakatCalculator';
import AlaramSetPage from '../Screens/AlaramScreen/AlaramSetPage';
import AlarmScreen from '../Screens/AlaramScreen/AlarmScreen';
import QiblaFinder from '../Screens/QiblaFinder';
import ShowNamaj from '../Screens/NamajPage/ShowNamaj';
import SalatSaved from '../Screens/NamajPage/SalatSaved';
import CheckOutUser from '../Screens/PaymentPage/CheckOutUser'






const Stack = createNativeStackNavigator();

const NavigationPages = () => {

    return (
        <Stack.Navigator initialRouteName='Splash'>
            <Stack.Screen name='Splash' component={Splash} options={{ headerShown: false }} />
            <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
            <Stack.Screen name='Register' component={Register} options={{ headerShown: false }} />
            <Stack.Screen name='PasswordwithEmail' component={PasswordwithEmail} options={{ headerShown: false }} />
            <Stack.Screen name='ResetPassword' component={ResetPassword} options={{ headerShown: false }} />


            <Stack.Screen name='BottomTab' component={BottomTab} options={{ headerShown: false }} />

            <Stack.Screen name='Dummy' component={Dummy} options={{ headerShown: false }} />


            <Stack.Screen name='ZakatCalculator' component={ZakatCalculator} options={{ headerShown: false }} />
            <Stack.Screen name='AlaramSetPage' component={AlaramSetPage} options={{ headerShown: false }} />
            <Stack.Screen name='AlarmScreen' component={AlarmScreen} options={{ headerShown: false }} />
            <Stack.Screen name='QiblaFinder' component={QiblaFinder} options={{ headerShown: false }} />
            <Stack.Screen name='ShowNamaj' component={ShowNamaj} options={{ headerShown: false }} />
            <Stack.Screen name='SalatSaved' component={SalatSaved} options={{ headerShown: false }} />
            <Stack.Screen name='CheckOutUser' component={CheckOutUser} options={{ headerShown: false }} />







        </Stack.Navigator>
    )
}

export default NavigationPages

