import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useCloths } from "../app/ClothContext";
import { Picker } from "@react-native-picker/picker";

export default function PaletteAnalytics() {
  const { clothes, categories } = useCloths();
  const [searchText, setSearchText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [colorFilter, setColorFilter] = useState("All");
  const filteredItems = clothes
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
  const getColorStats = (clothesArray) => {
    const colorMap = {};

    clothesArray.forEach((item) => {
      const color = item.color;
      if (colorMap[color]) {
        colorMap[color].count += 1;
      } else {
        colorMap[color] = { color, count: 1 };
      }
    });

    return Object.values(colorMap).sort((a, b) => b.count - a.count); // Most used first
  };
  const colorStats = getColorStats(filteredItems);

  return (
    <View className="rounded-xl h-[85vh] bg-[#303435] mx-4 p-4">
      <Text className="text-2xl font-bold text-white mb-4">
        Color Usage Analytics
      </Text>
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
              border: "1px solid white"
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
      <FlatList
        data={colorStats}
        keyExtractor={(item) => item.color}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between mb-3 p-3 rounded-lg border border-white">
            <View className="flex-row items-center">
              <View
                className="w-8 h-8 rounded-2xl mr-4"
                style={{ backgroundColor: item.color?.toLowerCase() }}
              />
              <Text className="text-lg text-white font-semibold">
                {item.color}
              </Text>
            </View>
            <Text className="text-md text-gray-300">
              Count: {item.count}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
