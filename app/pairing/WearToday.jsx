import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import rainyBackground from "../../assets/rain.json";
import { useCloths } from "../ClothContext";

// Color family grouping for basic matching
const colorGroups = {
  neutral: ["black", "white", "gray", "beige", "cream"],
  warm: ["red", "orange", "yellow", "brown"],
  cool: ["blue", "green", "purple"],
};

const getColorGroup = (color = "") => {
  const lower = color.toLowerCase();
  for (const [group, values] of Object.entries(colorGroups)) {
    if (values.includes(lower)) return group;
  }
  return null;
};

const WearToday = () => {
  const [CURRENT_SEASON, setCURRENT_SEASON] = useState("rain"); // TODO: Replace with real logic or props
  const router = useRouter();
  const { clothes, history } = useCloths();
  const [suggestions, setSuggestions] = useState([]);

  const generateSuggestionSet = () => {
    const recentlyWornNames = new Set(history.map((item) => item.name));

    // 1. Filter by season and not recently worn
    const availableClothes = clothes.filter(
      (c) =>
        !recentlyWornNames.has(c.name) &&
        (!c.season || c.season === CURRENT_SEASON)
    );

    const pickItem = (category, usedIds, targetColorGroup = null) => {
      const pool = availableClothes.filter(
        (c) =>
          c.category === category &&
          !usedIds.has(c.id) &&
          (!targetColorGroup || getColorGroup(c.color) === targetColorGroup)
      );

      const starred = pool.find((c) => c.starred);
      return starred || pool[0];
    };

    const outfits = [];
    const usedIds = new Set();

    for (let i = 0; i < 3; i++) {
      let top = pickItem("Shirt", usedIds) || pickItem("T-Shirt", usedIds);
      const colorGroup = top ? getColorGroup(top.color) : null;

      const bottom =
        pickItem("Pant", usedIds, colorGroup) ||
        pickItem("Jeans", usedIds, colorGroup);

      const shoes = pickItem("Foot Wear", usedIds, colorGroup);

      const outfit = [top, bottom, shoes].filter(Boolean);

      outfit.forEach((item) => item && usedIds.add(item.id));
      if (outfit.length) outfits.push(outfit);
    }

    setSuggestions(outfits);
  };

  useEffect(() => {
    generateSuggestionSet();
  }, []);

  // Weather realted custom background
  const weatherOptions = ["rainy", "summer"];
  const WeatherBackground = ({ season }) => {
    const animationSource = {
      // summer: require("../assets/animations/sun.json"),
      // winter: require("../assets/animations/snow.json"),
      rainy: rainyBackground,
    }[season || "summer"];

    return (
      <LottieView
        source={animationSource}
        autoPlay
        loop
        style={{
          position: "absolute",
          top: 0,
          width: "120%",
          height: "120%",
          zIndex: -1,
          backgroundColor: "blue",
        }}
      />
    );
  };

  return (
    <View
      className={`${
        CURRENT_SEASON === "rainy" && "bg-transparent"
      } bg-green-600 min-h-screen pt-10 px-4 relative`}
    >
      {CURRENT_SEASON === "rainy" && (
        <WeatherBackground season={CURRENT_SEASON} />
      )}
      {/* Header */}
      <View className="flex flex-row justify-between pb-3 items-center">
        <View className="flex flex-row items-center gap-2">
          <Ionicons
            name="arrow-back-circle-outline"
            size={36}
            color="white"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/Pairing");
            }}
          />
          <Text className="text-white text-2xl font-semibold">
            What to wear today
          </Text>
        </View>
        <Text className="text-white text-xl">--°C</Text>
      </View>

      <View className="flex-row flex-wrap gap-2 mb-4">
        {weatherOptions.map((option) => (
          <Pressable
            key={option}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setCURRENT_SEASON(option);
            }}
            className={`px-6 pt-2 pb-3 rounded-full ${
              CURRENT_SEASON === option ? "bg-red-500" : "bg-[#303435]"
            }`}
          >
            <Text className="text-white">{option}</Text>
          </Pressable>
        ))}
      </View>

      {/* Outfit Suggestions */}
      <ScrollView className="mt-2">
        {suggestions.length > 0 ? (
          suggestions.map((outfit, index) => (
            <View
              key={index}
              className="mb-6 border border-gray-300 p-3 rounded-lg bg-white/10"
            >
              <Text className="text-xl font-semibold mb-2 text-white">
                Outfit {index + 1}
              </Text>
              {outfit.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
                    setTimeout(() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
                    }, 200);
                    router.push({ pathname: `/${item.id}` });
                  }}
                  className="flex flex-row items-center gap-3 mb-3"
                >
                  <Image
                    source={{ uri: item.uri }}
                    style={{ width: 50, height: 50, borderRadius: 6 }}
                  />
                  <View>
                    <Text className="text-lg font-medium text-white">{item.name}</Text>
                    <Text className="text-base text-gray-300">
                      {item.category} • {item.color}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ))
        ) : (
          <Text className="text-base text-gray-600">
            No suggestions available at the moment.
          </Text>
        )}

        {/* Regenerate Button */}
        <TouchableOpacity
          className="mt-4 bg-red-600 px-4 py-2 rounded-xl"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            generateSuggestionSet();
          }}
        >
          <Text className="text-white text-center font-semibold text-xl">
            Suggest Again
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default WearToday;
