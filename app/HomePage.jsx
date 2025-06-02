import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { authenticateWithBiometrics } from "../components/biometricAuth";
import Filter from "../components/Filter";
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
  const [searchTab, setSearchTab] = useState(false);
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
    { name: "Maroon", hex: "#7f1d1d" },
  ];
  const { addToHistory, biometrics, clothes, setCloths } = useCloths();

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem("clothes");
      if (data) setItems(JSON.parse(data));
    })();
  }, []);

  const saveItems = async (newItems) => {
    setItems(newItems);
    setCloths(newItems);
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

  const handleDelete = async (id) => {
    const isAuthenticated = await authenticateWithBiometrics();
    if (isAuthenticated) {
      // console.log("User authenticated");
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
    } else {
      // console.log("Authentication failed");
    }
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
        : item.color.toLowerCase().includes(colorFilter.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  // Loading skeleton
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    // Simulate a network request (replace this with actual data fetching)
    setTimeout(() => {
      setIsLoading(false);
    }, 500); // 2 seconds loading
  }, []);

  const renderItem = ({ item, isLoading }) => {
    if (isLoading) {
      return (
        <View className="w-full items-center bg-[#2a2e2f] rounded-xl p-2 shadow-md">
          {/* Skeleton Heart Icon */}
          <View
            style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}
            className="w-6 h-6 bg-gray-700 rounded-full"
          />
          {/* Skeleton Image */}
          <View className="w-full h-44 bg-gray-700 rounded-md mb-2" />
          {/* Skeleton Text */}
          <View className="h-5 w-3/4 bg-gray-600 rounded mb-2" />
          <View className="flex flex-row space-x-2">
            <View className="h-4 w-1/3 bg-gray-500 rounded" />
            <View className="h-4 w-1/4 bg-gray-500 rounded" />
          </View>
          {/* Skeleton Buttons */}
          <View className="flex flex-row justify-between gap-2 mt-3 w-full px-1">
            <View className="h-9 w-full flex-1 bg-gray-600 rounded-full" />
            <View className="h-9 w-full flex-1 bg-gray-600 rounded-full" />
          </View>
        </View>
      );
    }
    // Your actual item content (no changes)
    return (
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
        className="w-full items-center bg-[#303435] rounded-xl p-2 shadow-md"
      >
        {/* Heart Icon */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            setTimeout(() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            }, 200);
            router.push({ pathname: `/${item.id}` });
          }}
          style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}
        >
          <Ionicons
            name={item?.starred ? "heart" : "heart-outline"}
            size={24}
            color="#dc2626"
          />
        </TouchableOpacity>
        <Image
          source={{ uri: item.uri }}
          className="w-full h-44 rounded-md object-contain"
        />
        <Text className="text-red-700 font-bold text-lg mt-1">{item.name}</Text>
        <View className="flex flex-row">
          <Text className="text-sm text-white font-semibold">
            {item.category} |{" "}
          </Text>
          <Text className="text-sm text-gray-400">{item.color}</Text>
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
            className="border border-red-500 w-full flex-1 rounded-full px-3 py-1"
          >
            <Text className="text-red-500 text-sm text-center font-semibold">
              Delete
            </Text>
          </TouchableOpacity>

          {/* Wear Button */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              addToHistory({
                ...item,
                id: `${item.id}_${new Date().getTime()}`,
                date: new Date().toLocaleDateString("en-GB"),
              });
              Alert.alert(
                "Saved to history",
                `Item ${item?.name}, color ${item?.color} saved`,
                [{ text: "Ok" }]
              );
            }}
            className="border border-green-600 w-full flex-1 rounded-full px-3 py-1"
          >
            <Text className="text-green-600 text-sm text-center font-semibold">
              Wear
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

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

  const [filterVisible, setFilterVisible] = useState(false);

  return (
    <View className="bg-black min-h-screen pt-10 px-4">
      {header ? (
        <View className="flex flex-row justify-between items-center pb-1">
          <View>
            <Ionicons
              name="menu"
              size={36}
              color="white"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/Notify");
              }}
            />
          </View>
          <View className="flex flex-row gap-2 items-center">
            <Ionicons
              name="search"
              size={36}
              color="white"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setSearchTab(!searchTab);
              }}
            />
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
      {searchTab && (
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
      )}
      <ScrollView className="h-[50vh]">
        <View>
          <Text className="text-white text-3xl font-serif italic">
            {(() => {
              const hour = new Date().getHours();
              return hour < 12
                ? "good morning,"
                : hour < 17
                ? "good afternoon,"
                : "good evening,";
            })()}
          </Text>
          <View className="flex flex-row items-end gap-1 pb-3">
            <Text className="text-white text-4xl font-serif font-semibold pr-3">
              Rishab
            </Text>
            <Text
              className="text-white text-xl font-semibold"
              onPress={() => {
                router.push("/CalendarTab");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              {days[d.getDay()]},
            </Text>
            <Text
              className="text-white text-lg"
              onPress={() => {
                router.push("/CalendarTab");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >{`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`}</Text>
          </View>
        </View>

        <Text className="text-gray-300 my-4">Today's outfit suggestions</Text>
        <View className="flex-row flex-wrap gap-3 justify-between">
          {filteredItems.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
              className="w-[150vw]"
            >
              <TouchableOpacity
                onPress={() => {
                  router.push("/suggestions/PackingAssistant");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                className="w-[85vw] bg-[#303435] rounded-2xl p-4 relative"
              >
                {/* Top-right circular arrow */}
                <TouchableOpacity
                  onPress={() => {
                    // handle press here
                  }}
                  className="absolute -top-1 -right-1 bg-white border-4 rounded-full w-12 h-12 items-center justify-center"
                >
                  <Ionicons name="arrow-forward" size={24} color="black" />
                </TouchableOpacity>
                <View>
                  <Text className="text-white text-xl font-semibold font-serif mb-2">
                    Packing Assistant
                  </Text>
                  <Text className="text-gray-300">
                    Generate a packing list for travel (based on location,
                    duration, and weather)
                  </Text>
                </View>
              </TouchableOpacity>
              {filteredItems.slice(0, 1).map((item) => (
                <View
                  key={item.id}
                  className="w-[85vw] bg-[#303435] rounded-2xl p-4 relative"
                >
                  {/* Top-right circular arrow */}
                  <TouchableOpacity
                    onPress={() => {
                      // handle press here
                    }}
                    className="absolute -top-1 -right-1 bg-white border-4 rounded-full w-12 h-12 items-center justify-center"
                  >
                    <Ionicons name="arrow-forward" size={24} color="black" />
                  </TouchableOpacity>
                  <View>
                    <Text className="text-white text-xl font-semibold font-serif mb-2">
                      Smart Casual
                    </Text>
                    <Text className="text-gray-300">
                      Perfect for creative workspaces, weekend brunches
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text className="text-white text-xl font-semibold text-center mt-4 w-full">
              No results...
            </Text>
          )}
        </View>

        <Text className="text-gray-300 my-4">Wardrobe recommendations</Text>
        <View className="flex-row flex-wrap gap-3 justify-between pb-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <View key={`rec-${item.id}`} className="w-[48%]">
                {renderItem({ item, isLoading })}
              </View>
            ))
          ) : (
            <Text className="text-white text-xl font-semibold text-center mt-4 w-full">
              No results...
            </Text>
          )}
        </View>
      </ScrollView>

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
      <View className="-mx-4 bg-[#404445] p-2 rounded-2xl flex-row justify-between items-center shadow-lg z-50">
        {/* Example Buttons */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            pickImage();
          }}
          className="bg-red-500 px-3 py-2 rounded-xl items-center justify-center flex-1 mx-1"
        >
          <MaterialIcons name="add" size={24} color="white" />
          <Text className="text-white text-xs font-semibold">Add</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/History");
          }}
          className="px-3 py-2 rounded-xl items-center justify-center flex-1 mx-1"
        >
          <MaterialIcons name="history" size={24} color="white" />
          <Text className="text-white text-xs font-semibold">History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/Closet");
          }}
          className="px-3 py-2 rounded-xl items-center justify-center flex-1 mx-1"
        >
          <MaterialIcons name="checkroom" size={24} color="white" />
          <Text className="text-white text-xs font-semibold">Closet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setFilterVisible(!filterVisible);
          }}
          className="px-3 py-2 rounded-xl items-center justify-center flex-1 mx-1"
        >
          <MaterialIcons name="tune" size={24} color="white" />
          <Text className="text-white text-xs font-semibold">Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Filter and Sort */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setCategoryFilter("All");
          setFilterVisible(false);
        }}
      >
        <View>
          <Filter
            searchText={searchText}
            setSearchText={setSearchText}
            sortAsc={sortAsc}
            setSortAsc={setSortAsc}
            colorFilter={colorFilter}
            setColorFilter={setColorFilter}
            colorOptions={colorOptions}
            colorDropdownVisible={colorDropdownVisible}
            setColorDropdownVisible={setColorDropdownVisible}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            filteredItems={filteredItems}
            renderItem={renderItem}
          />
        </View>
      </Modal>
    </View>
  );
}
