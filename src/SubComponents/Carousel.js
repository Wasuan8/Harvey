import React, { useRef, useState, useEffect, Alert } from "react";
import {
	ScrollView,
	View,
	Text,
	Image,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "../constants/ThemeColor";
import axios from "axios";
import * as Location from "expo-location";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";


const screenWidth = Dimensions.get("window").width;

const Carousel = () => {
	const [nextPrayer, setNextPrayer] = useState({
		Heading: "Next Prayer",
		SubHeading: "",
		Time: "",
		Subject: "",
	});
	const [ramzanData, setRamzanData] = useState({
		Heading: "Ramzan Mubarak!",
		SubHeading: "Celebrate the holy month",
		SehriTime: "Loading...",
		IftariTime: "Loading...",
	});
	const theme = useTheme();
	const scrollViewRef = useRef(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const [locationAddress, setLocationAddress] = useState('');
	const [prayerTimes, setPrayerTimes] = useState({});
	const [isLoading, setIsLoading] = useState(true);



	// Auto Scroll Effect
	useEffect(() => {
		const interval = setInterval(() => {
			const nextIndex = activeIndex === 2 ? 0 : activeIndex + 1; // Change 2 to the number of cards - 1
			scrollViewRef.current?.scrollTo({
				x: nextIndex * screenWidth,
				animated: true,
			});
			setActiveIndex(nextIndex);
		}, 3000); // 3 seconds auto-scroll

		return () => clearInterval(interval);
	}, [activeIndex]);

	// Handle manual scroll
	const handleScroll = (event) => {
		const offsetX = event.nativeEvent.contentOffset.x;
		const index = Math.round(offsetX / screenWidth);
		setActiveIndex(index);
	};

	// Render Dot Indicators
	const renderDotIndicators = () => {
		const totalCards = 3; // Change this to the number of cards
		return Array.from({ length: totalCards }).map((_, index) => (
			<TouchableOpacity
				key={index}
				onPress={() => {
					scrollViewRef.current?.scrollTo({
						x: index * screenWidth,
						animated: true,
					});
					setActiveIndex(index);
				}}
			>
				<View
					style={[
						styles.dot,
						{ backgroundColor: activeIndex === index ? theme.Active : theme.InActive },
					]}
				/>
			</TouchableOpacity>
		));
	};
	useEffect(() => {
		requestLocation();
	}, []);

	const requestLocation = async () => {
		const { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			Alert.alert("Permission Denied", "Enable location to get prayer times.");
			return;
		}

		const location = await Location.getCurrentPositionAsync({});
		fetchPrayerTimes(location.coords.latitude, location.coords.longitude);

	};


	const fetchPrayerTimes = async (lat, lon) => {
		try {
			const response = await axios.get(
				`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=99&school=1&latitudeAdjustmentMethod=3&params=18,null,null,null,18`
			);

			if (response.data && response.data.data) {
				const timings = response.data.data.timings;
				setPrayerTimes(timings);
				updateNextPrayer(timings);
				setIsLoading(false);
			}
		} catch (error) {
			console.error("Error fetching prayer times:", error);
			setIsLoading(false);
		}
	};

	const updateNextPrayer = (timings) => {
		const now = new Date();
		const currentMinutes = now.getHours() * 60 + now.getMinutes();

		const prayerList = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]; // Ordered prayer times

		for (let prayer of prayerList) {
			if (timings[prayer]) {
				const [hour, minutes] = timings[prayer].split(":").map(Number);
				const prayerMinutes = hour * 60 + minutes;

				if (prayerMinutes > currentMinutes) {
					const remainingMinutes = prayerMinutes - currentMinutes;
					const hoursLeft = Math.floor(remainingMinutes / 60);
					const minutesLeft = remainingMinutes % 60;

					setNextPrayer({
						Heading: "Next Prayer",
						SubHeading: prayer,
						Time: `${timings[prayer]} ${hour >= 12 ? "PM" : "AM"}`,
						Subject: `Time Remaining: ${hoursLeft}hr ${minutesLeft}min`,
						Icon: require("../../assets/images/1.png"),
					});
					break;
				}
			}
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			updateNextPrayer(prayerTimes);
		}, 60000);

		return () => clearInterval(interval);
	}, [prayerTimes]);




	return (
		<View>
			<ScrollView
				ref={scrollViewRef}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onScroll={handleScroll}
				scrollEventThrottle={16}
			>
				{/* Card 1 */}
				<LinearGradient
					colors={['#3B1E77', '#240F4F', '#54DAF5', '#FFFFFF', '#DFCBF4', '#F5B304']}
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 0 }}
					style={styles.card}
				>
					{isLoading ? (
					<>
						<ShimmerPlaceholder style={styles.shimmerText} autoRun={true} />
						<ShimmerPlaceholder style={styles.shimmerText} autoRun={true} />
						<ShimmerPlaceholder style={styles.shimmerTextLarge} autoRun={true} />
						<ShimmerPlaceholder style={styles.shimmerText} autoRun={true} />
					</>
					) : (
					<>
						<View style={styles.topRow}>
							<Text style={styles.muteText}>{nextPrayer.Heading}</Text>
						</View>
						<Text style={styles.nextPrayer}>{nextPrayer.SubHeading}</Text>
						<Text style={styles.prayerTime}>{nextPrayer.Time}</Text>
						<Text style={styles.remainingTime}>{nextPrayer.Subject}</Text>
						<Image source={require('../../assets/images/1.png')} resizeMode="stretch" style={styles.image} />
					</>
					)}
				</LinearGradient>

				{/* Card 2 */}
				{/* <LinearGradient
					colors={['#3B1E77', '#240F4F', '#54DAF5', '#FFFFFF', '#DFCBF4', '#F5B304']}
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 0 }}
					style={styles.card}
				>
					<View style={styles.topRow}>
						<Text style={styles.muteText}>{ramzanData.Heading}</Text>
					</View>
					<Text style={styles.nextPrayer}>{ramzanData.SubHeading}</Text>
					<Text style={styles.remainingTime}>Sehri: {ramzanData.SehriTime}</Text>
					<Text style={styles.remainingTime}>Iftari: {ramzanData.IftariTime}</Text>
					<Image source={require('../../assets/images/3.png')} resizeMode="stretch" style={styles.image} />
				</LinearGradient> */}

				{/* Card 3 */}
				{/* <LinearGradient
					colors={['#3B1E77', '#240F4F', '#54DAF5', '#FFFFFF', '#DFCBF4', '#F5B304']}
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 0 }}
					style={styles.card}
				>
					<View style={styles.topRow}>
						<Text style={styles.muteText}>Card 3 Heading</Text>
					</View>
					<Text style={styles.nextPrayer}>Card 3 Subheading</Text>
					<Text style={styles.prayerTime}>03:00 PM</Text>
					<Text style={styles.remainingTime}>Card 3 Subject</Text>
					<Image source={require('../../assets/images/1.png')} resizeMode="stretch" style={styles.image} />
				</LinearGradient> */}
			</ScrollView>
			<View style={styles.dotContainer}>{renderDotIndicators()}</View>
		</View>
	);
};

export default Carousel;

// Styles
const styles = StyleSheet.create({
	card: {
		borderRadius: 10,
		padding: 20,
		width: screenWidth,
		alignSelf: 'center',
		position: 'relative',
		marginTop: 10,
	},
	topRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
	},
	muteText: {
		color: 'white',
		fontSize: 14,
	},
	nextPrayer: {
		color: 'white',
		fontSize: 16,
		marginTop: 10,
	},
	prayerTime: {
		color: 'white',
		fontSize: 40,
		fontWeight: 'bold',
	},
	remainingTime: {
		color: 'white',
		fontSize: 14,
	},
	image: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: 120,
		height: 120,
		opacity: 1,
	},
	dotContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 10,
	},
	dot: {
		height: 8,
		width: 8,
		borderRadius: 5,
		marginHorizontal: 6,
	},
	shimmerText: {
		width: '20%',
		height: 10,
		marginBottom: 10,
		borderRadius: 5,
	},
	shimmerTextLarge: {
		width: '60%',
		height: 30,
		marginBottom: 10,
		borderRadius: 5,
	},
});