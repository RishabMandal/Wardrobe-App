import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const WearToday = () => {
  const router = useRouter();
  return (
    <View className="min-h-screen pt-10 px-4">
      <View className="flex flex-row justify-between pb-3 items-center">
        <View className="flex flex-row items-center gap-2">
          <Ionicons
            name="arrow-back-circle-outline"
            size={36}
            color="black"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/Pairing");
            }}
          />
          <Text className="text-black text-2xl font-semibold">What to wear today</Text>
        </View>
        <Text className="text-black text-xl">32'C</Text>
        {/* <Ionicons name="mic-circle-outline" size={36} color="black" /> */}
      </View>
    </View>
  );
};

export default WearToday;
