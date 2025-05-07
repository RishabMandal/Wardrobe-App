import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Calendar } from "react-native-calendars";
import * as Haptics from "expo-haptics";

const CalendarTab = () => {
  const router = useRouter();
  const d = new Date();
  const [selectedDate, setSelectedDate] = useState(
    `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`
  );

  const convertDate = (dateString) => {
    const date = new Date(dateString); // Create a Date object from the string
    const day = date.getDate().toString().padStart(2, "0"); // Get day and pad if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get month (0-based, so add 1)
    const year = date.getFullYear(); // Get the year

    return `${day}/${month}/${year}`; // Return the formatted date string
  };

  return (
    <View
      className="bg-black min-h-[120vh] p-4 pt-10 flex-1"
      style={{ color: "white" }}
    >
      <View className="flex flex-row justify-between pb-3 items-center">
        <Ionicons
          name="arrow-back-circle-outline"
          size={36}
          color="white"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/");
          }}
        />
        <Text className="text-white text-2xl font-semibold">Calendar</Text>
        <Ionicons name="mic-circle-outline" size={36} color="white" />
      </View>
      <View>
        <Calendar
          style={
            {
              // borderWidth: 5,
            }
          }
          theme={{
            backgroundColor: "#171717",
            calendarBackground: "#171717",
            textSectionTitleColor: "red",
            selectedDayBackgroundColor: "green",
            selectedDayTextColor: "#ffffff",
            selectedDotColor: "red",
            todayTextColor: "red",
            dayTextColor: "white",
            textDisabledColor: "gray",
            monthTextColor: "white",
            arrowColor: "red",
            todayBackgroundColor: "white",
          }}
          onDayPress={(day) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            // setSelectedDate(convertDate(day.dateString));
          }}
          markedDates={{
            [selectedDate]: { selected: true, selectedDotColor: "orange" },
          }}
        />
      </View>
    </View>
  );
};

export default CalendarTab;
