import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const options = [
    {
      label: "Favourites",
      emoji: "❤️",
    },
    {
      label: "Summer",
      emoji: "☀️",
    },
    {
      label: "Winter",
      emoji: "❄️",
    },
    {
      label: "Festive",
      emoji: "🎉",
    },
    {
      label: "Work",
      emoji: "💼",
    },
    {
      label: "Home",
      emoji: "🏠",
    },
    {
      label: "AI Suggested",
      emoji: "🤖",
    },
  ];
  

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const router = useRouter();

const Pairing = () => {
  return (
    <SafeAreaView className="flex-1 bg-red-600 items-center px-6 py-3">
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
        <Text className="text-white text-3xl font-bold">Outfit Pairing</Text>
        <Ionicons name="mic-circle-outline" size={36} color="white" />
      </View>

      {options.map((option, index) => {
        const opacity = useSharedValue(0);
        const translateY = useSharedValue(30);

        useEffect(() => {
          opacity.value = withDelay(
            index * 150,
            withTiming(1, { duration: 400 })
          );
          translateY.value = withDelay(
            index * 150,
            withTiming(0, { duration: 400 })
          );
        }, []);

        const animatedStyle = useAnimatedStyle(() => ({
          opacity: opacity.value,
          transform: [{ translateY: translateY.value }],
        }));

        return (
          <AnimatedPressable
            key={option.label}
            style={animatedStyle}
            className="bg-white border-2 border-red-700 w-4/5 rounded-xl py-4 px-6 mb-4 shadow-lg border border-red-700 justify-center items-center flex-row space-x-4"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              if (option.label === "AI Suggested") router.push("/pairing/WearToday");
              else if (option.label === "Favourites")
                router.push("/pairing/Starred");
            }}
          >
            <Text className="text-red-600 font-semibold text-xl pr-2">
              {option.emoji}
            </Text>
            <Text className="text-red-600 font-semibold text-xl">
              {option.label}
            </Text>
          </AnimatedPressable>
        );
      })}
    </SafeAreaView>
  );
};

export default Pairing;
