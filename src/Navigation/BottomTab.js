import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import useTheme from '../constants/ThemeColor';
import HomeAdmin from '../BottomTabScreens/HomeAdmin'
import Home from '../BottomTabScreens/Home'
import NamajAdmin from '../BottomTabScreens/NamajAdmin'
import ShowNamaj from '../Screens/NamajPage/ShowNamaj'
import DonateAdmin from '../BottomTabScreens/DonateAdmin'
import DonateUser from '../BottomTabScreens/DonateUser'
import Setting from '../BottomTabScreens/Setting';
import AsyncStorage from '@react-native-async-storage/async-storage';




const Tab = createBottomTabNavigator();

const BottomTab = () => {
    const theme = useTheme();
    const [role, setRole] = useState("");
    useEffect(() => {
        const retrieveData = async () => {
            try {
                const userData = await AsyncStorage.getItem('@UserData');
                if (userData) {
                    const parsedData = JSON.parse(userData);
                    setRole(parsedData.role);
                    console.log(role)

                }
            } catch (error) {
                console.error('Error retrieving data from AsyncStorage:', error);
            }
        };
        retrieveData();
    }, []);
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarHideOnKeyboard: true,
                tabBarStyle: [styles.tabBar, { backgroundColor: theme.background }],
            }}
        >

            <Tab.Screen
                name="Home"
                component={role === 'admin' ? HomeAdmin : Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image style={{ width: 25, height: 25, tintColor: focused ? theme.Active : theme.InActive }} source={{ uri: focused ? 'https://cdn-icons-png.flaticon.com/128/7463/7463297.png' : 'https://cdn-icons-png.flaticon.com/128/7463/7463326.png' }} />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={{ fontSize: 14, color: focused ? theme.Active : theme.InActive, marginTop: 5 }}>Home</Text>
                    ),
                }}

            />
             <Tab.Screen
                name="Namaj"
                component={role === 'admin' ? NamajAdmin : ShowNamaj}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image style={{ width: 25, height: 25, tintColor: focused ? theme.Active : theme.InActive }} source={{ uri: focused ? 'https://cdn-icons-png.flaticon.com/128/7515/7515489.png' : 'https://cdn-icons-png.flaticon.com/128/9988/9988103.png' }} />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={{ fontSize: 14, color: focused ? theme.Active : theme.InActive, marginTop: 5 }}>Namaj</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Donate"
                component={role === 'admin' ? DonateAdmin : DonateUser}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image style={{ width: 25, height: 25, tintColor: focused ? theme.Active : theme.InActive }} source={{ uri: focused ? 'https://cdn-icons-png.flaticon.com/128/7148/7148743.png' : 'https://cdn-icons-png.flaticon.com/128/7148/7148744.png' }} />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={{ fontSize: 14, color: focused ? theme.Active : theme.InActive, marginTop: 5 }}>Donate</Text>
                    ),
                }}

            />
            <Tab.Screen
                name="Setting"
                component={Setting}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image style={{ width: 25, height: 25, tintColor: focused ? theme.Active : theme.InActive }} source={{ uri: focused ? 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png' : 'https://cdn-icons-png.flaticon.com/128/1077/1077063.png' }} />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={{ fontSize: 14, color: focused ? theme.Active : theme.InActive, marginTop: 5 }}>Setting</Text>
                    ),
                }}

            />

           
           
        </Tab.Navigator>
    );
};

export default BottomTab;

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        left: 20,
        right: 20,
        elevation: 0,
        height: 60,
    },
    icon: {
        width: 30,
        height: 30,
        tintColor: '#fff'
    }
});
