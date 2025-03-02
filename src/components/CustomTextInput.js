import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import useTheme from '../constants/ThemeColor';
export const CustomTextInput = ({
    TextShow,
    placeholder,
    editable,
    value,
    onChangeText,
    keyboardType,
    onBlur,
    required,
    touched,
    error,
    size = 'medium', // Default size is medium
    multiline = false, // Enable multiline when needed
    numberOfLines = 1,
}) => {
    const theme = useTheme();

    const sizeStyles = {
        small: { height: 35, fontSize: 16, paddingVertical: 5 },
        medium: { height: 45, fontSize: 16, paddingVertical: 8 },
        large: { height: 100, fontSize: 16, paddingVertical: 10 },
    };

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
            <View style={{ flexDirection: 'column' }}>
                {TextShow && (
                    <View style={styles.labelContainer}>
                        <Text style={[styles.label, { color: theme.primary }]}>{TextShow}</Text>
                        {required && <Text style={styles.requiredText}>*</Text>}
                    </View>
                )}
                <View
                    style={[
                        styles.inputWrapper,
                        {
                            backgroundColor: editable === false ? '#eaecf5' : theme.input,
                            borderColor: theme.textBorder,
                            height: sizeStyles[size]?.height || sizeStyles.medium.height,
                        },
                    ]}
                >
                    <TextInput
                        placeholder={placeholder}
                        editable={editable}
                        keyboardType={keyboardType}
                        value={value}
                        onChangeText={onChangeText}
                        onBlur={onBlur}
                        multiline={multiline}
                        numberOfLines={numberOfLines}
                        textAlignVertical="top"
                        placeholderTextColor={theme.placeholderTextColor}
                        style={[
                            styles.textInput,
                            {

                                color: theme.text,
                                fontSize: sizeStyles[size]?.fontSize || sizeStyles.medium.fontSize,
                                paddingVertical: sizeStyles[size]?.paddingVertical || sizeStyles.medium.paddingVertical,
                            },
                        ]}
                    />
                </View>
                {touched && error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center', marginVertical: 8,
    },
    labelContainer: {
        flexDirection: 'row',
    },
    label: {
        fontSize: 16,
        fontFamily:'SemiBold'
    },
    requiredText: {
        color: '#E50000',
        fontSize: 16,
        marginLeft: 2,
    },
    inputWrapper: {
        flexDirection: "row", justifyContent: 'space-between', alignItems: 'center',
        borderWidth: 1, width: '90%',
        marginVertical: 10, borderRadius: 20, paddingLeft: 10, height: 45,
    },
    textInput: {
        flex: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 13,
        marginVertical: 5,
        marginLeft: 5,
    },
});
