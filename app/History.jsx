import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
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
    console.log("Dete");
    setHistory(updated);
  };

  const renderItem = ({ item }) => (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-md">
      <View className="flex-row items-center">
        {/* Thumbnail image */}
        {item.uri ? (
          <Image
            source={{ uri: item.uri }}
            className="w-36 h-44 rounded-md mr-4 border border-red-600"
            resizeMode="cover"
          />
        ) : (
          <View className="w-16 h-16 rounded-md mr-4 bg-gray-200 items-center justify-center">
            <Text className="text-gray-500 text-xs">No Image</Text>
          </View>
        )}

        {/* Item details */}
        <View>
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
          </View>

          {/* Delete button */}
          <TouchableOpacity
            className="bg-red-600 flex flex-row items-center justify-center rounded-lg p-3 gap-2"
            onPress={() => handleDeleteFromHistory(item.id)}
          >
            <Text className="text-white font-semibold">Delete</Text>
            <Ionicons name="trash-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-red-600 p-4 pt-10">
      <View className="w-full flex flex-row justify-between pb-3 items-center mb-6">
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
      {history.length === 0 ? (
        <Text className="text-white text-center font-semibold text-xl">
          No clothes worn yet.
        </Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default History;
