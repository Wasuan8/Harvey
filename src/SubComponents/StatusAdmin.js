import { FlatList, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import useTheme from '../constants/ThemeColor';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Use any icon library you prefer

const StatusAdmin = () => {
    const theme = useTheme();
    const [numColumns, setNumColumns] = useState(2); // Default number of columns

    const data = [
        { title: "User List", subCategories: 10, count: 24, icon: "people" },
        { title: "Donation History", subCategories: 4, count: 10, icon: "history" },
        { title: "Login User", subCategories: 15, count: 42, icon: "login" },
        { title: "Beta", subCategories: 78, count: 12, icon: "beta" },
    ];

    // Function to update the number of columns based on screen width
    const updateColumns = () => {
        const { width } = Dimensions.get('window');
        if (width > 600) {
            setNumColumns(3); 
        } else {
            setNumColumns(2); 
        }
    };

    // Update columns on initial render and screen resize
    useEffect(() => {
        updateColumns();
        const subscription = Dimensions.addEventListener('change', updateColumns);
        return () => subscription?.remove(); // Cleanup listener
    }, []);

    return (
        <View style={{ marginBottom: 70 }}>
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
                numColumns={numColumns} // Dynamic number of columns
                renderItem={({ item }) => (
                    <View style={[styles.card, { backgroundColor: theme.blurEffect,shadowColor: theme.blurEffect}]}>
                        <View style={styles.cardHeader}>
                            <Icon name={item.icon} size={wp("6%")} color={theme.heading} />
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
        marginHorizontal: wp("5%"),
        marginVertical: hp("2%"),
    },
    sectionTitle: {
        fontSize: wp("4.5%"),
        fontFamily: "Bold",
    },
    viewAll: {
        fontSize: wp("3.5%"),
        color: "#007BFF",
    },
    card: {
        flex: 1,
        margin: wp("2%"),
        padding: wp("4%"),
        borderRadius: 10,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp("1%"),
    },
    cardTitle: {
        fontSize: wp("4%"),
        fontWeight: "bold",
        marginLeft: wp("2%"),
    },
    cardBody: {
        marginTop: hp("1%"),
    },
    cardSub: {
        fontSize: wp("3.5%"),
        color: "gray",
        fontFamily:"Bold"
    },
    cardCount: {
        fontSize: wp("3.5%"),
        fontFamily: "SemiBold",
        marginTop: hp("0.5%"),
    },
});