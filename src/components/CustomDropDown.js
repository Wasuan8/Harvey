import React, { forwardRef, useState, useImperativeHandle, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Animated } from 'react-native';
import useTheme from '../constants/ThemeColor';

export const CustomDropDown = forwardRef(({ data, required, selectedValue, OnSelect, Heading, textPropertyName, touched, error }, ref) => {
    const [internalIsClicked, setInternalIsClicked] = useState(false);
    const rotateAnim = useRef(new Animated.Value(0)).current; // For rotation animation
    const theme = useTheme(); // Get the current theme colors

    useImperativeHandle(ref, () => ({
        setIsClicked: (newValue) => {
            setInternalIsClicked(newValue);
        }
    }));

    // Toggle dropdown and animate arrow
    const toggleDropdown = () => {
        setInternalIsClicked(!internalIsClicked);
        Animated.timing(rotateAnim, {
            toValue: internalIsClicked ? 0 : 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    // Interpolate rotation value
    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'], // Rotate from 0 to 90 degrees
    });

    return (
        <View style={{
            width: '100%',
            flexDirection: 'column',
            marginVertical: 8,
        }}>
            {Heading && (
                <View style={styles.labelContainer}>
                    <Text style={[styles.label, { color: theme.primary }]}>{Heading}</Text>
                    {required && <Text style={styles.requiredText}>*</Text>}
                </View>
            )}

            <TouchableOpacity
                style={[styles.selector, { borderColor: theme.textBorder, backgroundColor: theme.input }]}
                onPress={toggleDropdown}
            >
                <Text style={[styles.text, { color: theme.placeholderTextColor }]}>{selectedValue}</Text>
                <Animated.Image
                    style={[styles.icon, { transform: [{ rotate }], tintColor: theme.placeholderTextColor }]}
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/128/32/32195.png' }}
                />
            </TouchableOpacity>


            {internalIsClicked ? (
                <View style={[styles.dropdown3, { backgroundColor: theme.input, borderColor: theme.blurEffect }]}>
                    <FlatList
                        data={data}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => { OnSelect(index) }}
                                    style={[styles.profilestyle, {
                                        borderRadius: 15,
                                        borderWidth: 2,
                                        borderColor: item.selected ? theme.textBorder : theme.input,
                                        backgroundColor: item.selected ? theme.InActive : theme.input,
                                    }]}
                                >
                                    <View style={{ width: '100%', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '600', color: theme.dropdown, marginLeft: 5, flex: 1 }}>
                                                {item[textPropertyName]}
                                            </Text>

                                            {item.selected == true ? (
                                                <Image
                                                    source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1828/1828754.png' }}
                                                    style={{ width: 20, height: 20, tintColor: theme.fillIcon }}
                                                />
                                            ) : null}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />

                </View>
            ) : null}
            {touched && error && (
                <Text style={styles.errorText}>{error}</Text>
            )}

        </View>
    );
});

const styles = StyleSheet.create({
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginLeft: '5%',
        width: '90%',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    requiredText: {
        color: '#E50000',
        fontSize: 16,
    },
    dropdown3: {
        width: '90%',
        borderRadius: 5,
        elevation: 4,
        alignSelf: 'center',
        padding: 5,
    },
    profilestyle: {
        padding: 5,
        alignSelf: 'center',
        margin: 3,
    },
    icon: {
        width: 16,
        height: 16,
        alignItems: 'flex-end',
        marginLeft: 5,
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    selector: {
        width: '90%',
        padding: 12,
        borderRadius: 20,
        borderWidth: 1,
        alignSelf: 'center',
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 13,
        marginVertical: 5,
        marginLeft: 25,
    },
});