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
import { BlurView } from 'expo-blur';

const options = [
  {
    label: "Favourites",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-gOIXBME1kV-qz6cf45vdz-tfmiVjr8id-K7O-Ci0bZ2gy-MKFRx-awhIzKuYdLibkMg&usqp=CAU",
  },
  {
    label: "Summer",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-gOIXBME1kV-qz6cf45vdz-tfmiVjr8id-K7O-Ci0bZ2gy-MKFRx-awhIzKuYdLibkMg&usqp=CAU",
  },
  {
    label: "Winter",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-gOIXBME1kV-qz6cf45vdz-tfmiVjr8id-K7O-Ci0bZ2gy-MKFRx-awhIzKuYdLibkMg&usqp=CAU",
  },
  {
    label: "Festive",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-gOIXBME1kV-qz6cf45vdz-tfmiVjr8id-K7O-Ci0bZ2gy-MKFRx-awhIzKuYdLibkMg&usqp=CAU",
  },
  {
    label: "Work",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-gOIXBME1kV-qz6cf45vdz-tfmiVjr8id-K7O-Ci0bZ2gy-MKFRx-awhIzKuYdLibkMg&usqp=CAU",
  },
  {
    label: "Home",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-gOIXBME1kV-qz6cf45vdz-tfmiVjr8id-K7O-Ci0bZ2gy-MKFRx-awhIzKuYdLibkMg&usqp=CAU",
  },
  {
    label: "AI Suggested",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-gOIXBME1kV-qz6cf45vdz-tfmiVjr8id-K7O-Ci0bZ2gy-MKFRx-awhIzKuYdLibkMg&usqp=CAU",
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
        <Text className="text-white text-3xl font-bold">
          Outfit Pairing
        </Text>
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
            className="bg-white w-4/5 rounded-xl py-4 px-6 mb-4 shadow-md border border-red-700 justify-center items-center flex-row space-x-4"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              if (option.label === "AI Suggested") router.push("/WearToday");
            }}
          >
            <Image
              src={option.image}
              className="w-10 h-10"
              resizeMode="contain"
            />
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
