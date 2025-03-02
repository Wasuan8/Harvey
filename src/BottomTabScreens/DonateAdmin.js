import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  SafeAreaView,
  Image,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { socket } from "../utils/socket";
import { CustomTextInput } from "../components/CustomTextInput";
import { CategoryADDRT, CategoryDeleteRT, CategoryGetRT, CategoryUpdateRT } from "../utils/api";
import SocketStatus from "../SubComponents/SocketStatus";
import useTheme from "../constants/ThemeColor";
import SubmitButton from "../components/SubmitButton";
import Headerdash from "../components/Headerdash";
import { makeRequest } from "../utils/CustomeApiCall";


const DonateAdmin = () => {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({ id: "", name: "" });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Fetch initial categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await makeRequest(CategoryGetRT, "get");
        console.log("API Response:", data); // Log the API response
        setCategories(data); // Update the state
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchCategories();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    socket.on("categoryAdded", (newCategory) => {
      setCategories((prevCategories) => [...prevCategories, newCategory]);
    });

    socket.on("categoryUpdated", (updatedCategory) => {
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === updatedCategory._id ? updatedCategory : category
        )
      );
    });

    socket.on("categoryDeleted", (deletedCategoryId) => {
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== deletedCategoryId)
      );
    });

    return () => {
      socket.off("categoryAdded");
      socket.off("categoryUpdated");
      socket.off("categoryDeleted");
    };
  }, []);

  const addCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert("Error", "Please enter a category name!");
      return;
    }

    try {
      const response = await fetch(CategoryADDRT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });

      const data = await response.json();
      if (response.status === 400) {
        Alert.alert("Error", data.message);
        console.log(data);
      } else {
        setCategoryName("");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      Alert.alert("Error", "Failed to add category");
    }
  };

  const openEditModal = (id, name) => {
    setSelectedCategory({ id, name });
    setNewCategoryName(name);
    setEditModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeEditModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setEditModalVisible(false));
  };

  const updateCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Error", "Please enter a category name!");
      return;
    }

    try {
      await fetch(`${CategoryUpdateRT}${selectedCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });
      closeEditModal();
    } catch (error) {
      console.error("Error updating category:", error);
      Alert.alert("Error", "Failed to update category");
    }
  };

  const deleteCategory = async (id) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await fetch(`${CategoryDeleteRT}${id}`, {
                method: "DELETE",
              });
            } catch (error) {
              console.error("Error deleting category:", error);
              Alert.alert("Error", "Failed to delete category");
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Headerdash Heading={'Donate Category'} />

      <SocketStatus />

      <CustomTextInput
        TextShow='Category'
        value={categoryName}
        onChangeText={setCategoryName}
        placeholder={'Enter Category Name'}
      />

      <SubmitButton onPress={addCategory} ShowText='Add Category' />

      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Animatable.View animation="fadeIn" duration={500} style={[styles.categoryItem, { backgroundColor: theme.background }]}>
            <Text style={[styles.categoryName, { color: theme.heading }]}>{item.name}</Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => openEditModal(item._id, item.name)}
            >
              <Image style={{ width: 24, height: 24, tintColor: theme.fillIcon }} source={require('../../assets/Icon/Edit.png')} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteCategory(item._id)}
            >
              <Image style={{ width: 24, height: 24, tintColor: theme.subIcon }} source={require('../../assets/Icon/Trash.png')} />
            </TouchableOpacity>
          </Animatable.View>
        )}
      />

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim, backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.primary }]}>Edit Category</Text>
            <CustomTextInput
              TextShow='Email'
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder={'Update Category'}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButtonCancel, { backgroundColor: theme.smallBtn }]} onPress={closeEditModal}>
                <Text style={[styles.modalButtonText, { color: theme.heading }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButtonSave, { backgroundColor: theme.button }]} onPress={updateCategory}>
                <Text style={[styles.modalButtonText, { color: theme.primary }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  categoryName: {
    fontSize: 16,
    flex: 1,
  },
  editButton: {
    padding: 8,
    marginLeft: 10,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
});

export default DonateAdmin;