import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCloths } from "./ClothContext";

const History = () => {
  const { history, setHistory } = useCloths();
  const router = useRouter();

  const handleDeleteFromHistory = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    }, 200);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    }, 400);
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
  };

  const getWearCount = (uri) =>
    history.filter((entry) => entry.uri === uri).length;

  const renderItem = ({ item }) => (
    <View className="bg-white rounded-xl p-2 mb-2 shadow-md border border-red-700">
      <View className="flex flex-row items-center">
        {/* Thumbnail image */}
        {item.uri ? (
          <Image
            source={{ uri: item.uri }}
            className="w-36 h-full rounded-md mr-4 border border-red-600"
            resizeMode="cover"
          />
        ) : (
          <View className="w-16 h-16 rounded-md mr-4 bg-gray-200 items-center justify-center">
            <Text className="text-gray-500 text-xs">No Image</Text>
          </View>
        )}

        {/* Item details */}
        <View className="flex-1">
          <View className="flex-1">
            <Text className="text-2xl font-semibold text-red-600">
              {item.name}
            </Text>
            <Text className="text-lg text-gray-700">
              {item.category} • {item.color}
            </Text>
            <Text className="text-md text-gray-400 mt-1">
              Worn on {item.date}
            </Text>
            <Text className="text-sm text-gray-700 mt-1 font-semibold">
              Worn {getWearCount(item.uri)}{" "}
              {getWearCount(item.uri) === 1 ? "time" : "times"}
            </Text>
          </View>

          {/* Delete button */}
          <TouchableOpacity
            className="bg-red-600 flex flex-row items-center justify-center rounded-lg p-3 gap-2 mt-2"
            onPress={() => handleDeleteFromHistory(item.id)}
          >
            <Text className="text-white font-semibold">Delete</Text>
            <Ionicons name="trash-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const [sortBy, setSortBy] = useState("date"); // 'name', 'date', 'count'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'

  const [searchText, setSearchText] = useState("");
  const filteredHistory = useMemo(() => {
    let result = history.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    result.sort((a, b) => {
      let valA, valB;

      if (sortBy === "name") {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortBy === "date") {
        valA = new Date(a.date);
        valB = new Date(b.date);
      } else if (sortBy === "count") {
        valA = history.filter((entry) => entry.uri === a.uri).length;
        valB = history.filter((entry) => entry.uri === b.uri).length;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [searchText, sortBy, sortOrder, history]);

  return (
    <View className="flex-1 bg-red-600 p-4 pt-10">
      <View className="w-full flex flex-row justify-between pb-3 items-center mb-2">
        <Ionicons
          name="arrow-back-circle-outline"
          size={36}
          color="white"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/Account");
          }}
        />
        <Text className="text-white text-3xl font-bold">History</Text>
        <Ionicons name="mic-circle-outline" size={36} color="white" />
      </View>
      <View className="relative w-full mb-3">
        <TextInput
          placeholder="Search by name..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#ef4444"
          className="bg-white text-lg text-red-700 font-semibold rounded-xl px-4 py-2 pr-10" // add pr-10 to make space for icon
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
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row gap-2">
          {["name", "date", "count"].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
                setTimeout(() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
                }, 200);
                setSortBy(type);
              }}
              className={`px-3 py-1 rounded-full border border-red-700 ${
                sortBy === type ? "bg-white" : "bg-red-500"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  sortBy === type ? "text-red-600" : "text-white"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            setTimeout(() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            }, 200);
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
          className="px-3 py-1 rounded-full bg-red-500 border border-red-700"
        >
          <Text className="text-sm font-semibold text-white">
            {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
          </Text>
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <Text className="text-white text-center font-semibold text-xl">
          No clothes worn yet.
        </Text>
      ) : (
        <FlatList
          data={filteredHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default History;
