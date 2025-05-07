import { Stack } from "expo-router";
import "react-native-reanimated";
import { ClothProvider } from "./ClothContext";

export default function RootLayout() {
  return (
    <ClothProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" /> */}
      </Stack>
    </ClothProvider>
  );
}
