import { Picker } from "@react-native-picker/picker";
import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useCloths } from "../app/ClothContext";

const Filter = ({
  searchText,
  setSearchText,
  sortAsc,
  setSortAsc,
  colorFilter,
  setColorFilter,
  colorOptions,
  colorDropdownVisible,
  setColorDropdownVisible,
  categoryFilter,
  setCategoryFilter,
  filteredItems,
  renderItem,
}) => {
  const { categories } = useCloths();
  return (
    <View className="bg-black min-h-screen p-4">
      <View className="bg-red-600 p-4 pt-6 rounded-b-3xl -mx-4 -mt-4 mb-4">
        <Text className="text-white italic font-serif text-3xl">
          Put together your
        </Text>
        <Text className="text-white font-serif font-bold text-4xl">
          Perfect Look
        </Text>
        <View className="relative w-full mt-3 mb-2">
          <TextInput
            placeholder="Search by name..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#ef4444"
            className="text-white text-lg bg-red-700 border border-white font-semibold rounded-full px-4 py-2 pr-10" // add pr-10 to make space for icon
          />
          <Ionicons
            name="search"
            size={20}
            color="white"
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: [{ translateY: -10 }],
            }}
          />
        </View>
      </View>
      <View className="flex-row flex-wrap justify-between items-start gap-2 mb-4">
        {/* Category Picker */}
        <View className="bg-[#303435] rounded-md flex-1">
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
            {categories.map((cat) => (
              <Picker.Item
                key={cat.value}
                label={cat.label}
                value={cat.value}
              />
            ))}
          </Picker>
        </View>
      </View>
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
          className="bg-[#303435] rounded-md px-4 py-3 flex-[0.5]"
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
            className="bg-[#303435] rounded-md px-4 py-3"
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
            <ScrollView className="absolute top-14 left-0 right-0 bg-[#303435] h-[55vh] rounded-md shadow-lg z-50">
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
                  <Text className="text-gray-300">{color.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
        <View className="bg-[#303435] rounded-md px-4 py-3">
          <Text className="text-red-600 font-semibold">
            {filteredItems?.length}
          </Text>
        </View>
      </View>
      <ScrollView className="h-[50vh]">
        <Text className="text-gray-300 my-4">Wardrobe recommendations</Text>
        <View className="flex-row flex-wrap gap-3 justify-between pb-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <View key={`rec-${item.id}`} className="w-[48%]">
                {renderItem({ item })}
              </View>
            ))
          ) : (
            <Text className="text-white text-xl font-semibold text-center mt-4 w-full">
              No results...
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Filter;
