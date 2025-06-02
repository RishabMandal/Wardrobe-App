// lib/notifications.js
import * as Notifications from "expo-notifications";

export async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Please enable notifications to receive daily reminders.");
    return;
  }
}

export async function scheduleDailyReminder(hour = 21, minute = 0) {
  // 9 PM
  await Notifications.cancelAllScheduledNotificationsAsync(); // Prevent duplicates

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "👕 Outfit Reminder",
      body: "Don’t forget to log what you wore today!",
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
}
