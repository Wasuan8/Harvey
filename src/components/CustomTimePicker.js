import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import useTheme from '../constants/ThemeColor';
import moment from 'moment';

const CustomTimePicker = forwardRef(({ onConfirm, Value, Label, Placeholder }, ref) => {
    const theme = useTheme()
    const [visible, setVisible] = useState(false);
    const [hours, setHours] = useState(12);
    const [minutes, setMinutes] = useState(0);
    const [period, setPeriod] = useState('AM');

    useImperativeHandle(ref, () => ({
        open: () => setVisible(true),
        close: () => setVisible(false),
    }));

    const handleConfirm = () => {
        const newTime = new Date();
        newTime.setHours(period === 'PM' ? (hours % 12) + 12 : hours % 12, minutes, 0, 0);
        onConfirm(newTime);
        setVisible(false);
    };
    const isISOFormat = moment.utc(Value, moment.ISO_8601, true).isValid();


    return (
        <View style={{ flexDirection: 'column' }}>
            {
                Label && (
                    <Text style={{ color: theme.primary, fontSize: 16, fontWeight: '600' }}>{Label}</Text>

                )
            }

            <TouchableOpacity onPress={() => setVisible(true)}>
                <Text style={{ color: Value ? theme.placeholderTextColor : theme.heading, fontSize: 16, fontWeight: '600' }}>  {isISOFormat ? moment(Value).format('hh:mm A') : Value ? Value : Placeholder}</Text>
            </TouchableOpacity>
            <Modal visible={visible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={[styles.pickerContainer, { backgroundColor: theme.background }]}>
                        <Text style={[styles.modalTitle, { color: theme.primary }]}>Set Alarm Time</Text>
                        <View style={styles.timePicker}>
                            {/* Hours */}
                            <ScrollView style={styles.pickerColumn}>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={() => setHours(i + 1)}
                                        style={[
                                            styles.pickerItem,
                                            hours === i + 1 && { backgroundColor: theme.InActive, borderRadius: 5 },
                                        ]}>
                                        <Text style={[styles.pickerItemText, { color: theme.primary }]}>{i + 1}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            {/* Minutes */}
                            <ScrollView style={styles.pickerColumn}>
                                {Array.from({ length: 60 }, (_, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={() => setMinutes(i)}
                                        style={[
                                            styles.pickerItem,
                                            minutes === i && { backgroundColor: theme.InActive, borderRadius: 5 },
                                        ]}>
                                        <Text style={[styles.pickerItemText, { color: theme.primary }]}>{i < 10 ? `0${i}` : i}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            {/* AM/PM */}
                            <ScrollView style={styles.pickerColumn}>
                                {['AM', 'PM'].map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setPeriod(item)}
                                        style={[
                                            styles.pickerItem,
                                            period === item && { backgroundColor: theme.InActive, borderRadius: 5 },
                                        ]}>
                                        <Text style={[styles.pickerItemText, { color: theme.primary }]}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => setVisible(false)} style={[styles.cancelButton, { backgroundColor: theme.placeholderTextColor }]}>
                                <Text style={[styles.buttonText, { color: theme.input }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleConfirm} style={[styles.confirmButton, { backgroundColor: theme.fillIcon }]}>
                                <Text style={[styles.buttonText, { color: theme.input }]}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
});

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    pickerContainer: {
        width: 300,
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    timePicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pickerColumn: {
        flex: 1,
        maxHeight: 150,
    },
    pickerItem: {
        padding: 10,
        alignItems: 'center',
    },
    pickerItemText: {
        fontSize: 18,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    cancelButton: {
        padding: 10,
        borderRadius: 10,
    },
    confirmButton: {
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CustomTimePicker;
