import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCloths } from "./ClothContext";

const ClothDetailedView = () => {
  const { id } = useLocalSearchParams(); // Get the 'id' from the URL params
  const { clothes, setCloths, categories, history } = useCloths(); // Access the clothes from context

  // Find the cloth by its id
  const cloth = clothes.find(
    (cloth) => cloth.id === id || cloth.id === parseInt(id)
  );

  // State to manage the edited name
  const [name, setName] = useState(cloth?.name || "");
  const [category, setCategory] = useState(cloth?.category || "");
  const [color, setColor] = useState(cloth?.color || "");
  const [uri, setUri] = useState(cloth?.uri || "");
  const [date, setDate] = useState(cloth?.date || "");
  const [starred, setStarred] = useState(cloth?.starred || "");

  // Handler to save the updated cloth name
  const handleSave = () => {
    if (name.trim()) {
      const updatedCloth = {
        id: cloth?.id,
        name,
        category,
        color,
        uri,
        starred,
      }; // Update the cloth with new name
      setCloths(
        clothes.map((item) =>
          item.id === updatedCloth.id ? updatedCloth : item
        )
      ); // Update the clothes in the context
    }
  };

  const router = useRouter();
  const showCustomInput = category === "Custom";
  const [customCategory, setCustomCategory] = useState(category);

  // Image expander
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View
      className="bg-red-600 min-h-[120vh] p-4 pt-10"
      style={{ color: "white" }}
    >
      <View className="flex flex-row justify-between pb-3 items-center">
        <Ionicons
          name="arrow-back-circle-outline"
          size={36}
          color="white"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/");
          }}
        />
        <Text className="text-white text-3xl font-semibold">Edit item</Text>
        <Ionicons name="mic-circle-outline" size={36} color="white" />
      </View>
      {cloth ? (
        <>
          <View className="flex flex-row gap-3">
            <TouchableOpacity
              className="w-1/2 h-52 rounded-md border-2 border-red-500"
              onPress={() => {
                setModalVisible(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              <Image
                source={{ uri: uri }}
                className="w-full h-full rounded-md border-2 object-contain border-red-500"
              />
            </TouchableOpacity>
            {/* Fullscreen Modal */}
            <Modal visible={modalVisible} transparent={true}>
              <View className="flex-1 bg-black bg-opacity-90 justify-center items-center">
                <TouchableOpacity
                  className="flex-1 justify-center items-center w-full"
                  onPress={() => {
                    setModalVisible(false);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                  activeOpacity={1}
                >
                  <Image
                    source={{ uri }}
                    className="w-full h-4/5"
                    resizeMode="contain"
                  />
                  <Text className="text-white mt-4 text-base">
                    Tap anywhere to close
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
            <View className="w-1/2">
              <Text className="text-white">Item Name</Text>
              <Text
                className="font-semibold"
                style={{ color: "white", fontSize: 24, marginBottom: 10 }}
              >
                {cloth?.name}
              </Text>
              <Text className="text-white">Item Category</Text>
              <Text
                className="font-semibold"
                style={{ color: "white", fontSize: 24, marginBottom: 10 }}
              >
                {cloth?.category}
              </Text>
              <Text className="text-white">Item Color</Text>
              <Text
                className="font-semibold"
                style={{ color: "white", fontSize: 24 }}
              >
                {cloth?.color}
              </Text>
            </View>
          </View>
          <Text className="text-white mt-4 font-semibold text-lg">
            This item was worn{" "}
            {history.filter((cloth) => cloth.id.split("_")[0] === id).length} time(s)
          </Text>
          {/* Editable TextInput for the name */}
          <TextInput
            style={{
              borderWidth: 1,
              color: "white",
              padding: 10,
              marginTop: 20,
            }}
            className="rounded-xl border-red-700 bg-red-500 text-lg"
            value={name}
            onChangeText={setName}
            placeholder="Edit name"
            placeholderTextColor="gray"
          />
          <View className="border rounded-xl border-red-700 mt-5">
            <Picker
              selectedValue={showCustomInput ? "Custom" : category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              dropdownIconColor="#dc2626"
              style={{
                height: 52,
                fontSize: 10,
                color: "white",
                fontWeight: "bold",
              }}
            >
              {categories.map((cat) => (
                <Picker.Item
                  key={cat.value}
                  label={cat.label}
                  value={cat.value}
                />
              ))}
            </Picker>

            {showCustomInput && (
              <TextInput
                style={{
                  borderWidth: 1,
                  color: "white",
                  padding: 10,
                  marginTop: 20,
                }}
                className="rounded-xl border-red-700 bg-red-500 text-lg"
                value={customCategory}
                onChangeText={setCustomCategory}
                placeholder="Enter your Custom category"
                placeholderTextColor="gray"
              />
            )}
          </View>
          {/* <TextInput
            style={{
              borderWidth: 1,
              color: "white",
              padding: 10,
              marginTop: 20,
            }}
            className="rounded-xl border-red-700 bg-red-500 text-lg"
            value={category}
            onChangeText={setCategory}
            placeholder="Edit category"
            placeholderTextColor="gray"
          /> */}
          <TextInput
            style={{
              borderWidth: 1,
              color: "white",
              padding: 10,
              marginTop: 20,
            }}
            className="rounded-xl border-red-700 bg-red-500 text-lg"
            value={color}
            onChangeText={setColor}
            placeholder="Edit color"
            placeholderTextColor="gray"
          />
          <View className="flex flex-row justify-between items-center mt-2">
            <Text className="text-white font-semibold text-xl">
              Mark as Favourite/ Star
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "white" }}
              thumbColor={starred ? "red" : "#f4f3f4"}
              onValueChange={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setStarred((previousState) => !previousState);
                setTimeout(() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }, 200);
              }}
              value={starred}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className="flex flex-row justify-center gap-3 bg-red-500 border border-red-700 p-3 rounded-full mt-4"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleSave();
            }}
          >
            {/* <AntDesign name="pluscircle" size={24} color="white" /> */}
            <Text className="text-white w-fit text-xl font-semibold">
              Save Changes
            </Text>
          </TouchableOpacity>
          {/* <Button
            title="Save Changes"
            onPress={handleSave}
            color="#f44336"
            className="rounded-xl"
          /> */}
        </>
      ) : (
        <Text style={{ color: "white" }}>Item not found</Text>
      )}
    </View>
  );
};

export default ClothDetailedView;
