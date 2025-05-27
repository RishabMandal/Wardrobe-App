import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useCloths } from "../ClothContext";

export default function PackingAssistant() {
  const { categories } = useCloths();
  const router = useRouter();

  // Sample categories
  // const categories = [
  //   { label: "👕 Shirt", value: "Shirt" },
  //   { label: "👖 Jeans", value: "Jeans" },
  //   { label: "🧑‍💼 Formal Wear (Shirt)", value: "Formal Wear(Shirt)" },
  //   { label: "🧑‍💼 Formal Wear (Trousers)", value: "Formal Wear(Trousers)" },
  //   { label: "🏠 Home Wear (Shirt)", value: "Home Wear(Shirt)" },
  //   { label: "🏠 Home Wear (T-Shirt)", value: "Home Wear(T-Shirt)" },
  //   { label: "🧥 Jacket", value: "Jacket" },
  //   { label: "👕 T-Shirt", value: "T-Shirt" },
  //   { label: "👖 Pant", value: "Pant" },
  //   { label: "👟 Foot Wear", value: "Foot Wear" },
  //   { label: "🧦 Socks", value: "Socks" },
  //   { label: "🧻 Handkerchief", value: "Handkerchief" },
  // ];

  const travelTypes = ["City", "Beach", "Hill Station", "Desert"];
  const weatherOptions = ["Clear", "Rain", "Snow", "Cloudy", "Windy"];

  const getPackingList = (weather, duration, travelType) => {
    const baseItems = ["T-Shirt", "Pant", "Socks", "Foot Wear", "Handkerchief"];
    const weatherBasedItems = {
      Rain: ["Jacket", "Waterproof Foot Wear"],
      Snow: ["Jacket", "Gloves", "Warm Socks"],
      Clear: ["T-Shirt", "Shirt"],
      Clouds: ["Shirt", "Jacket"],
      Windy: ["Jacket", "Scarf"],
    };

    const travelTypeItems = {
      Beach: ["Sunglasses", "Swimwear", "Flip-Flops"],
      "Hill Station": ["Jacket", "Warm Hat", "Boots"],
      City: ["Shirt", "Formal Wear(Shirt)"],
      Desert: ["Scarf", "Hat", "Light Cotton Wear"],
    };

    const recommended = new Set(baseItems);

    (weatherBasedItems[weather] || []).forEach((item) => recommended.add(item));
    (travelTypeItems[travelType] || []).forEach((item) =>
      recommended.add(item)
    );

    return Array.from(recommended).map((item) => ({
      item,
      quantity: ["Socks", "T-Shirt", "Handkerchief"].includes(item)
        ? duration
        : Math.ceil(duration / 2),
    }));
  };

  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("3");
  const [weather, setWeather] = useState("Clear");
  const [travelType, setTravelType] = useState("City");
  const [packingList, setPackingList] = useState([]);

  const handleGenerate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    }, 200);
    const list = getPackingList(weather, parseInt(duration) || 1, travelType);
    setPackingList(list);
  };

  return (
    <ScrollView className="p-4 pt-10 bg-black min-h-screen">
      {/* Header */}
      <View className="w-full flex flex-row justify-between pb-3 items-center mb-2">
        <Ionicons
          name="arrow-back-circle-outline"
          size={36}
          color="white"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/");
          }}
        />
        <Text className="text-white text-3xl font-bold">Packing Assistant</Text>
        <Ionicons name="mic-circle-outline" size={36} color="white" />
      </View>
      <Text className="text-white text-xl font-bold mb-4">
        🧳 Get a smart packing list for your trip.
      </Text>

      <Text className="text-white mb-1">Location</Text>
      <TextInput
        className="bg-white p-2 rounded mb-4"
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
      />

      <Text className="text-white mb-1">Duration (days)</Text>
      <TextInput
        keyboardType="numeric"
        className="bg-white p-2 rounded mb-4"
        placeholder="e.g. 5"
        value={duration}
        onChangeText={setDuration}
      />

      <Text className="text-white mb-1">Select Weather</Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {weatherOptions.map((option) => (
          <Pressable
            key={option}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setWeather(option);
            }}
            className={`px-3 py-1 rounded-full ${
              weather === option ? "bg-red-500" : "bg-[#303435]"
            }`}
          >
            <Text className="text-white">{option}</Text>
          </Pressable>
        ))}
      </View>

      <Text className="text-white mb-1">Travel Type</Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {travelTypes.map((type) => (
          <Pressable
            key={type}
            onPress={() => {
              setTravelType(type);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            className={`px-3 py-1 rounded-full ${
              travelType === type ? "bg-green-600" : "bg-[#303435]"
            }`}
          >
            <Text className="text-white">{type}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleGenerate}
        className="bg-red-600 p-3 rounded-xl mt-2 mb-6"
      >
        <Text className="text-white text-xl text-center font-semibold">
          Generate Packing List
        </Text>
      </Pressable>

      {packingList.length > 0 && (
        <View className="bg-[#303435] p-4 rounded">
          <Text className="text-white text-lg font-bold mb-2">
            ✅ Your Packing List
          </Text>
          {packingList.map(({ item, quantity }) => (
            <Text key={item} className="text-gray-200">
              • {item}: {quantity}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
