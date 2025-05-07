import { Image } from "expo-image";
import { Text, View } from "react-native";
import HomePage from "./HomePage";
import "../global.css";

export default function HomeScreen() {
  return (
    <View className="bg-black">
      {/* <Text className="text-white" style={{ color: "white" }}>
        Hello
      </Text> */}
      <HomePage />
    </View>
  );
}
