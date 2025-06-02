import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import PaletteAnalytics from "../components/PaletteAnalytics";

const Analytics = () => {
  const router = useRouter();
  return (
    <View className="bg-black min-h-screen pb-4 pt-10">
      <View className="w-full flex flex-row justify-between pb-3 items-center">
        <Ionicons
          name="arrow-back-circle-outline"
          size={36}
          color="white"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/Account");
          }}
        />
        <Text className="text-white text-3xl font-bold">Analytics</Text>
        <Ionicons name="mic-circle-outline" size={36} color="white" />
      </View>
      <PaletteAnalytics />
    </View>
  );
};

export default Analytics;
