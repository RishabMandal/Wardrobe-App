import {
  registerForPushNotificationsAsync,
  scheduleDailyReminder,
} from "@/lib/Notification";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";
import { ClothProvider } from "./ClothContext";

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      await registerForPushNotificationsAsync();
      await scheduleDailyReminder(21, 0); // 9 PM
    })();
  }, []);
  return (
    <ClothProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" /> */}
      </Stack>
    </ClothProvider>
  );
}
