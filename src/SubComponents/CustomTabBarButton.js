import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';


const CustomTabBarButton = ({ children, onPress }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(1.2);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
        onPress();
    };

    return (
        <Animated.View style={[animatedStyle, styles.floatingButtonContainer]}>
            <TouchableOpacity
                style={styles.floatingButton}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                {children}
            </TouchableOpacity>
        </Animated.View>
    );
}
export default CustomTabBarButton

const styles = StyleSheet.create({
   
      floatingButtonContainer: {
        top: -30,
        justifyContent: 'center',
        alignItems: 'center',
      },
      floatingButton: {
        backgroundColor: '#7C01F6',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
      },
})