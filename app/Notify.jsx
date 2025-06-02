import * as Notifications from "expo-notifications";
import React, { useEffect } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { registerForPushNotificationsAsync } from "../lib/Notification";

export default function NotifyScreen() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const sendTestNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🛎️ Outfit Reminder",
          body: "This is a test notification!",
        },
        trigger: null, // send immediately
      });
    } catch (err) {
      Alert.alert("Notification failed", err.message);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-black px-4">
      <Text className="text-xl font-semibold mb-4 text-white">Send Test Notification</Text>
      <TouchableOpacity
        className="bg-red-600 rounded-full p-4"
        onPress={sendTestNotification}
      >
        <Text className="text-white font-bold">Notify Me Now</Text>
      </TouchableOpacity>
    </View>
  );
}
