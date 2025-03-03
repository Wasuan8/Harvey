import { FlatList, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import useTheme from '../constants/ThemeColor';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StatusAdmin = () => {
    const theme = useTheme();
    const [numColumns, setNumColumns] = useState(2);

    const data = [
        { title: "User List", subCategories: 10, count: 24, icon: "people" },
        { title: "Donation History", subCategories: 4, count: 10, icon: "history" },
        { title: "Login User", subCategories: 15, count: 42, icon: "login" },
        { title: "Beta", subCategories: 78, count: 12, icon: "login" },
    ];

    const updateColumns = () => {
        const { width } = Dimensions.get('window');
        if (width > 600) {
            setNumColumns(3);
        } else {
            setNumColumns(2);
        }
    };

    useEffect(() => {
        updateColumns();
        const subscription = Dimensions.addEventListener('change', updateColumns);
        return () => subscription?.remove();
    }, []);

    return (
        <View style={{ marginBottom: verticalScale(70) }}>
            <View style={styles.listHeader}>
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>All User Data</Text>
                <TouchableOpacity>
                    <Text style={[styles.viewAll, { color: theme.heading }]}>View all</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                key={numColumns}
                data={data}
                keyExtractor={(item) => item.title}
                numColumns={numColumns}
                renderItem={({ item }) => (
                    <View style={[styles.card, { backgroundColor: theme.blurEffect, shadowColor: theme.blurEffect }]}>
                        <View style={styles.cardHeader}>
                            <Icon name={item.icon} size={30} color={theme.heading} /> {/* Updated size */}
                            <Text style={[styles.cardTitle, { color: theme.heading }]}>{item.title}</Text>
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={[styles.cardSub, { color: theme.primary }]}>{item.subCategories} Sub-Categories</Text>
                            <Text style={[styles.cardCount, { color: theme.primary }]}>{item.count} Entries</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default StatusAdmin;

const styles = StyleSheet.create({
    listHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: "Bold",
    },
    viewAll: {
        fontSize: 14,
        color: "#007BFF",
    },
    card: {
        flex: 1,
        margin: 5,
        padding: 10,
        borderRadius: 15,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginLeft: 5
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 5,
    },
    cardBody: {
        marginTop: 5,
    },
    cardSub: {
        fontSize: 14,
        color: "gray",
        fontFamily: "Bold",
    },
    cardCount: {
        fontSize: 14,
        fontFamily: "SemiBold",
    },
});