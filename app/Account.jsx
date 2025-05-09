import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useCloths } from "./ClothContext";

const Account = () => {
  const router = useRouter();
  const { history } = useCloths();
  // console.log(history);

  return (
    <View
      className="bg-red-600 min-h-[100vh] p-4 pt-10 flex-1"
      style={{ color: "white" }}
    >
      {/* Header */}
      <View className="w-full flex flex-row justify-between pb-3 items-center mb-6">
        <Ionicons
          name="arrow-back-circle-outline"
          size={36}
          color="white"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/");
          }}
        />
        <Text className="text-white text-3xl font-bold">Profile</Text>
        <Ionicons name="mic-circle-outline" size={36} color="white" />
      </View>

      {/* History Button */}
      <TouchableOpacity
        className="bg-white rounded-lg p-4 mb-4"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push("/History");
        }}
      >
        <View className="flex flex-row items-center justify-between">
          <Text className="text-red-600 font-semibold text-lg">
            History of Clothes Worn
          </Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#DC2626" />
        </View>
      </TouchableOpacity>

      {/* Recent Clothing Preview */}
      <View className="space-y-3">
        {history.slice(0, 3).map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-xl p-2 mb-2 shadow-md border border-red-700"
          >
            <View className="flex-row items-center">
              {/* Thumbnail image */}
              {item?.uri ? (
                <Image
                  source={{ uri: item.uri }}
                  className="w-28 h-32 rounded-md mr-4 border border-red-600"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-28 h-32 rounded-md mr-4 bg-gray-200 items-center justify-center">
                  <Text className="text-gray-500 text-xs">No Image</Text>
                </View>
              )}

              {/* Item details */}
              <View className="flex-1 space-y-1">
                <Text className="text-2xl font-semibold text-red-600">
                  {item?.name}
                </Text>
                <Text className="text-lg text-gray-700">
                  {item?.category} • {item?.color}
                </Text>
                <Text className="text-md text-gray-400 mt-1">
                  Worn on {item?.date}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Account;
