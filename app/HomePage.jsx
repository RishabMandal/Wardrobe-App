import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCloths } from "./ClothContext";

// If targeting web and using Framer Motion
// import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newImageUri, setNewImageUri] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    color: "",
  });
  const [searchText, setSearchText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [colorFilter, setColorFilter] = useState("All");
  const [colorDropdownVisible, setColorDropdownVisible] = useState(false);
  const colorOptions = [
    { name: "All", hex: "#ffffff" },
    { name: "Red", hex: "#ef4444" },
    { name: "Blue", hex: "#3b82f6" },
    { name: "Green", hex: "#22c55e" },
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#f4f4f5" },
    { name: "Yellow", hex: "#facc15" },
    { name: "Purple", hex: "#a855f7" },
    { name: "Orange", hex: "#fb923c" },
    { name: "Pink", hex: "#ec4899" },
    { name: "Gray", hex: "#6b7280" },
    { name: "Brown", hex: "#92400e" },
    { name: "Beige", hex: "#f5f5dc" },
    { name: "Maroon", hex: "#7f1d1d" }
  ];

  const router = useRouter();

  useEffect(() => {
    (async () => {
      // const data = await AsyncStorage.getItem("wardrobeItems");
      const data = await AsyncStorage.getItem("clothes");
      if (data) setItems(JSON.parse(data));
    })();
  }, []);

  const saveItems = async (newItems) => {
    setItems(newItems);
    // await AsyncStorage.setItem("wardrobeItems", JSON.stringify(newItems));
    await AsyncStorage.setItem("clothes", JSON.stringify(newItems));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      const fileName = result.assets[0].uri.split("/").pop();
      const dest = FileSystem.documentDirectory + fileName;
      await FileSystem.copyAsync({ from: result.assets[0].uri, to: dest });
      setNewImageUri(dest);
      setModalVisible(true);
    }
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString(),
      uri: newImageUri,
      ...formData,
    };
    const updatedItems = [...items, newItem];
    saveItems(updatedItems);
    setFormData({ name: "", category: "", color: "" });
    setNewImageUri(null);
    setModalVisible(false);
  };

  const handleDelete = (id) => {
    Alert.alert("Delete?", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const updated = items.filter((item) => item.id !== id);
          saveItems(updated);
        },
      },
    ]);
  };

  const filteredItems = items
    .filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((item) =>
      categoryFilter === "All" ? true : item.category === categoryFilter
    )
    .filter((item) =>
      colorFilter === "All"
        ? true
        : item.color.toLowerCase() === colorFilter.toLowerCase()
    )
    .sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        }, 200);
        setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        }, 400);
        handleDelete(item.id);
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        }, 200);
        router.push({ pathname: `/${item.id}` });
      }}
      className="m-1 w-[11.5rem] items-center mx-auto bg-white rounded-xl p-2 shadow-md border border-red-700"
    >
      <Image
        source={{ uri: item.uri }}
        className="w-full h-44 rounded-md border-2 object-contain border-red-500"
      />
      <Text className="text-red-700 font-bold text-lg mt-1">{item.name}</Text>
      <View className="flex flex-row">
        <Text className="text-sm text-black font-semibold">
          {item.category} |{" "}
        </Text>
        <Text className="text-sm text-gray-500">{item.color}</Text>
      </View>
      {/* Action Buttons */}
      <View className="flex flex-row justify-between gap-2 mt-3 w-full px-1">
        {/* Delete Button */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            setTimeout(() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            }, 200);
            setTimeout(() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            }, 400);
            handleDelete(item.id);
          }}
          className="bg-red-500 w-full flex-1 rounded-full px-3 py-1"
        >
          <Text className="text-white text-sm text-center font-semibold">
            Delete
          </Text>
        </TouchableOpacity>

        {/* Add to History Button */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            addToHistory({
              ...item,
              id: `${item.id}_${new Date().getTime()}`, // Unique ID
              date: new Date().toLocaleDateString("en-GB"),
            });
            Alert.alert(
              "Saved to history",
              `Item ${item?.name}, color ${item?.color} saved`,
              [{ text: "Ok" }]
            );
          }}
          className="bg-green-600 w-full flex-1 rounded-full px-3 py-1"
        >
          <Text className="text-white text-sm text-center font-semibold">
            Wear
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const d = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [header, setHeader] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setHeader(true);
    }, 1000);
  }, []);

  const { addToHistory } = useCloths();

  return (
    <View className="bg-red-700 min-h-screen pt-10 px-4">
      {header ? (
        <View className="flex flex-row justify-between items-center pb-1">
          <View>
            <Text
              className="text-white text-3xl font-semibold"
              onPress={() => {
                router.push("/CalendarTab");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              {days[d.getDay()]}
            </Text>
            <Text
              className="text-white text-lg -mt-1"
              onPress={() => {
                router.push("/CalendarTab");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >{`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`}</Text>
          </View>
          <View className="flex flex-row gap-2 items-center">
            <Ionicons
              name="shirt"
              size={36}
              color="white"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/Pairing");
              }}
            />
            <MaterialIcons
              name="account-circle"
              size={40}
              color="white"
              onPress={() => {
                router.push("/Account");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            />
          </View>
        </View>
      ) : (
        <Text
          className="text-white font-bold text-3xl text-center my-2"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/Pairing");
          }}
        >
          My Wardrobe
        </Text>
      )}

      <View className="relative w-full mb-3">
        <TextInput
          placeholder="Search by name..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#ef4444"
          className="bg-white text-lg text-red-700 font-semibold rounded-md px-4 py-2 pr-10" // add pr-10 to make space for icon
        />
        <Ionicons
          name="search"
          size={20}
          color="#dc2626"
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: [{ translateY: -10 }],
          }}
        />
      </View>

      {/* Filter and Sort */}
      <View className="flex-row flex-wrap justify-between items-start gap-2 mb-4">
        {/* Sort Toggle */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            setTimeout(() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            }, 200);
            setSortAsc(!sortAsc);
          }}
          className="bg-white rounded-md px-4 py-3 flex-[0.5]"
        >
          <Text className="text-red-600 font-semibold text-center">
            {sortAsc ? "Sort Z-A" : "Sort A-Z"}
          </Text>
        </TouchableOpacity>

        {/* Color Filter Dropdown */}
        <View className="relative flex-1">
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
              setTimeout(() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
              }, 200);
              setColorDropdownVisible(!colorDropdownVisible);
            }}
            className="bg-white rounded-md px-4 py-3"
          >
            <View className="flex-row items-center justify-center space-x-2 gap-2">
              {colorFilter === "All" ? (
                <LinearGradient
                  colors={["#ef4444", "#3b82f6", "#22c55e", "#000", "#fff"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  className="w-4 h-4 rounded-full"
                />
              ) : (
                <View
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor:
                      colorOptions.find((c) => c.name === colorFilter)?.hex ||
                      "#fff",
                  }}
                />
              )}
              <Text className="text-red-600 font-semibold">
                Color: {colorFilter}
              </Text>
            </View>
          </TouchableOpacity>

          {colorDropdownVisible && (
            <View className="absolute top-14 left-0 right-0 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              {colorOptions.map((color) => (
                <TouchableOpacity
                  key={color.name}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
                    setColorFilter(color.name);
                    setColorDropdownVisible(false);
                  }}
                  className="flex-row items-center px-4 py-2 space-x-2 gap-2"
                >
                  <View
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color.hex }}
                  />
                  <Text className="text-gray-800">{color.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View className="bg-white rounded-md px-4 py-3">
          <Text className="text-red-600 font-semibold">
            {filteredItems?.length}
          </Text>
        </View>
      </View>
      <View className="flex-row flex-wrap justify-between items-start gap-2 mb-4">
        {/* Category Picker */}
        <View className="bg-white rounded-md flex-1">
          <Picker
            selectedValue={categoryFilter}
            onValueChange={(itemValue) => setCategoryFilter(itemValue)}
            dropdownIconColor="#dc2626"
            style={{
              height: 52,
              fontSize: 10,
              color: "#dc2626",
              fontWeight: "bold",
            }}
          >
            <Picker.Item label="All Categories" value="All" />
            <Picker.Item label="Shirt" value="Shirt" />
            <Picker.Item label="Jeans" value="Jeans" />
            <Picker.Item
              label="Formal Wear(Shirt)"
              value="Formal Wear(Shirt)"
            />
            <Picker.Item
              label="Formal Wear(Trousers)"
              value="Formal Wear(Trousers)"
            />
            <Picker.Item label="Home Wear(Shirt)" value="Home Wear(Shirt)" />
            <Picker.Item
              label="Home Wear(T-Shirt)"
              value="Home Wear(T-Shirt)"
            />
            <Picker.Item label="Jacket" value="Jacket" />
            <Picker.Item label="T-Shirt" value="T-Shirt" />
            <Picker.Item label="Pant" value="Pant" />
            <Picker.Item label="Foot Wear" value="Foot Wear" />
          </Picker>
        </View>
      </View>

      <View className="">
        {filteredItems.length > 0 ? (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
            className="-m-2 h-[57vh]"
          />
        ) : (
          <View>
            <Text className="text-white text-xl font-semibold text-center mt-4 h-[53vh]">
              No results...
            </Text>
          </View>
        )}
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/70 px-4">
          <View className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <Text className="text-xl font-bold text-red-700 mb-4">
              Add Item Details
            </Text>
            <TextInput
              placeholder="Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              className="border border-gray-300 px-4 py-2 rounded mb-3"
              placeholderTextColor="#dc2626"
            />
            <TextInput
              placeholder="Category"
              value={formData.category}
              onChangeText={(text) =>
                setFormData({ ...formData, category: text })
              }
              className="border border-gray-300 px-4 py-2 rounded mb-3"
              placeholderTextColor="#dc2626"
            />
            <TextInput
              placeholder="Color"
              value={formData.color}
              onChangeText={(text) => setFormData({ ...formData, color: text })}
              className="border border-gray-300 px-4 py-2 rounded mb-4"
              placeholderTextColor="#dc2626"
            />

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
                handleAddItem();
              }}
              className="bg-red-600 py-3 rounded-xl mb-2 items-center"
            >
              <Text className="text-white font-bold">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
                setModalVisible(false);
              }}
              className="items-center"
            >
              <Text className="text-red-600 font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Button */}
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          pickImage();
        }}
        className="flex-row items-center justify-center bg-red-500 py-3 rounded-xl shadow-md my-4"
      >
        <MaterialIcons name="add" size={24} color="white" />
        <Text className="text-white font-bold text-lg ml-2">Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}
