import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../../src/Screens/Login';
import Register from '../../src/Screens/Register';
import PasswordwithEmail from '@/src/Screens/PasswordReset/PasswordwithEmail';
import Dummy from '@/src/Screens/Dummy';
import ZakatCalculator from '@/src/Screens/ZakatCalc/ZakatCalculator';
import AlaramSetPage from '@/src/Screens/AlaramScreen/AlaramSetPage';
import AlarmScreen from '@/src/Screens/AlaramScreen/AlarmScreen';
import QiblaFinder from '@/src/Screens/QiblaFinder';
import BottomTab from './BottomTab';
import SplashPage from '@/src/Screens/SplashPage';
import ShowNamaj from '@/src/Screens/NamajPage/ShowNamaj';
import SalatSaved from '@/src/Screens/NamajPage/SalatSaved';
import ResetPassword from '@/src/Screens/PasswordReset/ResetPassword';
import CheckOutUser from '@/src/Screens/PaymentPage/CheckOutUser';

const Stack = createNativeStackNavigator();

const NavigationPages = () => {

    return (
        <Stack.Navigator initialRouteName='Splash'>
            <Stack.Screen name='Splash' component={SplashPage} options={{ headerShown: false }} />
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

