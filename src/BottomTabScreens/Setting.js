import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Animated } from 'react-native'
import React, { useEffect, useState } from 'react'
import Headerdash from '../components/Headerdash'
import useTheme from '../constants/ThemeColor'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import { Modal } from 'react-native-paper';
import * as Animatable from "react-native-animatable";
import { CustomTextInput } from '../components/CustomTextInput';
import { base, baseImage, LogoutProfile, UpdateProfile } from '../utils/api';
import { makeRequest } from '../utils/CustomeApiCall';
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from 'expo-file-system';




const Setting = () => {

  const initialValues = {
    id: "",
    email: "",
    full_name: "",
    phone: "",
    photo: ""
  };
  const theme = useTheme();
  const navigation = useNavigation();
  const fadeAnim = useState(new Animated.Value(0))[0]; // For fade animation
  const [name, setName] = useState('')
  const [photo, setPhoto] = useState('')
  const [selectedImage, setSelectedImage] = useState(null);

  const [editModeName, setEditModeName] = useState(false);
  const [editImage, setEditImage] = useState(false)
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      HandleUpdate();
      console.log(values)
    },
  });

  // Open edit modal
  const openEditModal = () => {
    setEditModeName(true);
    formik.setFieldValue("full_name", name)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Close edit modal
  const closeEditModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setEditModeName(false));
  };

  // Open edit modal
  const openImageModal = () => {
    setEditImage(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Close edit modal
  const closeImageModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setEditImage(false));
  };

  const retrieveData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@UserData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setName(parsedData.full_name)
        formik.setFieldValue("phone", parsedData.phone)
        formik.setFieldValue("email", parsedData.email)
        formik.setFieldValue("photo", parsedData.photo)
        formik.setFieldValue("id", parsedData.id)
        setPhoto(parsedData.photo)

      }
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    retrieveData();
  }, [])


  const uploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { uri, name, mimeType } = result.assets[0];

        const fileExtension = name.split(".").pop();
        const file = {
          uri,
          name: `${Date.now()}.${fileExtension}`,
          type: mimeType,
        };
        formik.setFieldValue("photo", file)

        setSelectedImage(uri);
      } else {
        console.log("Document picking was canceled or failed.");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Failed to upload file.");
    }
  };

  const HandleUpdate = async () => {
    try {
      const ParamData = {
        email: formik.values.email,
        full_name: formik.values.full_name,
        phone: formik.values.phone,
        photo: formik.values.photo,
      };

      console.log("ParamData:", ParamData);

      const returnData = await makeRequest(
        UpdateProfile,
        "put",
        ParamData,
        true // Set isFileUpload to true
      );

      if (returnData.status === 1) {
        console.log("Profile updated successfully:", returnData);
        const userData = returnData.user;
        await AsyncStorage.setItem('@UserData', JSON.stringify(userData));
        setEditModeName(false);
        setEditImage(false);
        retrieveData();
      } else {
        alert(`Message: ${returnData.message}`);
        console.log("Update failed:", returnData);
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Failed to update profile.");
    }
  };

  // const HandleUpdate = () => {
  //   const ParamData = {
  //     email: formik.values.email,
  //     full_name: formik.values.full_name,
  //     phone: formik.values.phone,
  //     photo: formik.values.photo

  //   };
  //   console.log(ParamData)
  //   makeRequest(
  //     UpdateProfile,
  //     "put",
  //     ParamData
  //   )
  //     .then((returnData) => {
  //       // Handle the response data
  //       if (returnData.status === 1) {
  //         const userData = returnData.user;
  //         AsyncStorage.setItem('@UserData', JSON.stringify(userData));
  //         setEditModeName(false);
  //         setEditImage(false)
  //         retrieveData()
  //       } else {
  //         alert(`Message: ${returnData.message}`);
  //         console.log(returnData)

  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //     });
  // }


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@UserData');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

      makeRequest(
        `${LogoutProfile}${formik.values.id}`,
        "get",
      )
        .then((returnData) => {
          // Handle the response data
          if (returnData.status === 1) {
            console.log(returnData)


          } else {
            alert(`Message: ${returnData.message}`);
            console.log(returnData)

          }
        })
        .catch(error => {
          console.error('Error:', error);
        });


    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Headerdash Heading={'Profile'} />

      <ScrollView style={{ marginBottom: 60 }}>
        <View style={styles.profileSection}>
          <Image
            source={photo ? { uri: `${baseImage}${photo}` } : require('../../assets/Icon/Profile.png')}
            style={styles.profileImage}
          />
          <Text style={[styles.profileName, { color: theme.primary, }]}>{name}</Text>
          <View style={styles.taskContainer}>
            <Text style={{ color: theme.Active, fontSize: 18, fontFamily: 'Light' }}>{formik.values.email}</Text>
            <View style={{ flexDirection: 'row', width: '50%', alignItems: 'center', backgroundColor: theme.blurEffect, padding: 2, borderRadius: 5, borderWidth: 1, borderColor: theme.Active }}>
              <Image style={{ width: 15, height: 15 }} source={require('../../assets/Icon/Check.png')} />
              <Text style={{ color: theme.InActive, fontSize: 12, alignSelf: 'center', fontFamily: 'Light', marginLeft: 10 }}>Verified email</Text>

            </View>


          </View>
          {/* <Image style={{ width: 15, height: 15, tintColor:'black' }} source={{uri:`${base}${photo}`}} /> */}



          {/* <View style={styles.taskContainer}>
            <TouchableOpacity style={[styles.taskButton, { backgroundColor: theme.button, }]}>
              <Text style={{ color: theme.input }}>2 Alaram set</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.taskButton, { backgroundColor: theme.button, }]}>
              <Text style={{ color: theme.input }}>$50,000 Donation</Text>
            </TouchableOpacity>
          </View> */}
        </View>


        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Settings</Text>
          <TouchableOpacity style={styles.itemMain}>
            <View style={styles.item}>
              <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2040/2040504.png' }} />
              <Text style={[styles.itemText, { color: theme.heading, }]}>App Settings</Text>
            </View>
            <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/16998/16998764.png' }} />

          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Account</Text>
          <TouchableOpacity onPress={openEditModal} style={styles.itemMain}>
            <View style={styles.item}>
              <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/747/747376.png' }} />
              <Text style={[styles.itemText, { color: theme.heading, }]}>Change account name</Text>
            </View>
            <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/16998/16998764.png' }} />

          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('PasswordwithEmail')} style={styles.itemMain}>
            <View style={styles.item}>
              <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/807/807369.png' }} />
              <Text style={[styles.itemText, { color: theme.heading, }]}>Change account password</Text>
            </View>
            <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/16998/16998764.png' }} />

          </TouchableOpacity>
          <TouchableOpacity onPress={openImageModal} style={styles.itemMain}>
            <View style={styles.item}>
              <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/15071/15071096.png' }} />
              <Text style={[styles.itemText, { color: theme.heading, }]}>Change account Image</Text>
            </View>
            <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/16998/16998764.png' }} />

          </TouchableOpacity>
        </View>

        <Modal
          visible={editImage}
          transparent={true}
          animationType="fade"
          onRequestClose={closeImageModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim, backgroundColor: theme.background }]}>
              <Text style={[styles.modalTitle, { color: theme.primary }]}>Update Image</Text>
              <TouchableOpacity onPress={uploadFile} style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>

                <Image
                  source={selectedImage ? { uri: selectedImage } : require('../../assets/Icon/Profile.png')}
                  style={styles.profileImage}
                />
              </TouchableOpacity>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButtonCancel, { backgroundColor: theme.smallBtn, }]} onPress={closeImageModal}>
                  <Text style={[styles.modalButtonText, { color: theme.heading, }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButtonSave, { backgroundColor: theme.button, }]} onPress={formik.handleSubmit}>
                  <Text style={[styles.modalButtonText, { color: theme.primary, }]}>Save</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>


        <Modal
          visible={editModeName}
          transparent={true}
          animationType="fade"
          onRequestClose={closeEditModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim, backgroundColor: theme.background }]}>
              <Text style={[styles.modalTitle, { color: theme.primary }]}>Update Name</Text>
              <CustomTextInput
                TextShow='Name'
                value={formik.values.full_name}
                onChangeText={formik.handleChange('full_name')}
                placeholder={'Update name'}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButtonCancel, { backgroundColor: theme.smallBtn, }]} onPress={closeEditModal}>
                  <Text style={[styles.modalButtonText, { color: theme.heading, }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButtonSave, { backgroundColor: theme.button, }]} onPress={formik.handleSubmit}>
                  <Text style={[styles.modalButtonText, { color: theme.primary, }]}>Save</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>

        {/* Uptodo Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Uptodo</Text>
          <TouchableOpacity style={styles.itemMain}>
            <View style={styles.item}>
              <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/665/665049.png' }} />
              <Text style={[styles.itemText, { color: theme.heading, }]}>About US</Text>
            </View>
            <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/16998/16998764.png' }} />

          </TouchableOpacity>
          <TouchableOpacity style={styles.itemMain}>
            <View style={styles.item}>
              <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1660/1660114.png' }} />
              <Text style={[styles.itemText, { color: theme.heading, }]}>FAQ</Text>
            </View>
            <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/16998/16998764.png' }} />

          </TouchableOpacity>
          <TouchableOpacity style={styles.itemMain}>
            <View style={styles.item}>
              <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1628/1628629.png' }} />
              <Text style={[styles.itemText, { color: theme.heading, }]}>Help & Feedback</Text>
            </View>
            <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/16998/16998764.png' }} />

          </TouchableOpacity>
          <TouchableOpacity style={styles.itemMain}>
            <View style={styles.item}>

              <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/15184/15184535.png' }} />
              <Text style={[styles.itemText, { color: theme.heading, }]}>Support US</Text>
            </View>
            <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/16998/16998764.png' }} />

          </TouchableOpacity>
        </View>


        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Image style={[styles.Icon, { tintColor: theme.fillIcon }]} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/18557/18557120.png' }} />
          <Text style={styles.logoutText}>Log out</Text>

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  )
}

export default Setting

const styles = StyleSheet.create({
  Icon: {
    width: 28,
    height: 28,

  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Bold',

  },
  taskContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  taskButton: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },

  section: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'

  },
  itemMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10

  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  logoutText: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'red',
  },
  modalOverlay: {
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButtonCancel: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  modalButtonSave: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
})