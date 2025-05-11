import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useCloths } from "../ClothContext";

const Starred = () => {
  const router = useRouter();

  const { clothes } = useCloths();

  const filteredItems = clothes.filter((item) => item?.starred === true);
  // .filter((item) =>
  //   categoryFilter === "All" ? true : item.category === categoryFilter
  // )
  // .filter((item) =>
  //   colorFilter === "All"
  //     ? true
  //     : item.color.toLowerCase() === colorFilter.toLowerCase()
  // )
  // .sort((a, b) =>
  //   sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  // );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      //   onLongPress={() => {
      //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
      //     setTimeout(() => {
      //       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
      //     }, 200);
      //     setTimeout(() => {
      //       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
      //     }, 400);
      //     handleDelete(item.id);
      //   }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        }, 200);
        router.push({ pathname: `/${item.id}` });
      }}
      className="flex-1 items-center bg-[#303435] rounded-xl p-2 m-2 shadow-md"
    >
      {/* Heart Icon */}
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
          setTimeout(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
          }, 200);
          router.push({ pathname: `/${item.id}` });
        }}
        style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}
      >
        <Ionicons
          name={item?.starred ? "heart" : "heart-outline"}
          size={24}
          color="red"
        />
      </TouchableOpacity>
      <Image
        source={{ uri: item.uri }}
        className="w-full h-56 rounded-md object-contain"
      />
      <Text className="text-red-700 font-bold text-lg mt-1">{item.name}</Text>
      <View className="flex flex-row">
        <Text className="text-sm text-white font-semibold">
          {item.category} |{" "}
        </Text>
        <Text className="text-sm text-gray-400">{item.color}</Text>
      </View>
      {/* Action Buttons */}
      <View className="flex flex-row justify-between gap-2 mt-3 w-full px-1">
        {/* Delete Button */}
        {/* <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            setTimeout(() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            }, 200);
            setTimeout(() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            }, 400);
            handleDelete(item.id);
          }}
          className="border border-red-500 w-full flex-1 rounded-full px-3 py-1"
        >
          <Text className="text-red-500 text-sm text-center font-semibold">
            Delete
          </Text>
        </TouchableOpacity> */}

        {/* Add to History Button */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            addToHistory({
              ...item,
              id: `${item.id}_${new Date().getTime()}`, // Unique ID
              date: new Date().toLocaleDateString("en-GB"),
            });
            Alert.alert(
              "Saved to history",
              `Item ${item?.name}, color ${item?.color} saved`,
              [{ text: "Ok" }]
            );
          }}
          className="border border-green-600 w-full flex-1 rounded-full px-3 py-1"
        >
          <Text className="text-green-600 text-sm text-center font-semibold">
            Wear
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  return (
    <View className="min-h-screen pt-10 px-4 bg-red-600">
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
            Favourite items
          </Text>
        </View>
        {/* <Text className="text-black text-xl">32'C</Text> */}
        {/* <Ionicons name="mic-circle-outline" size={36} color="black" /> */}
      </View>
      <View className="">
        {filteredItems.length > 0 ? (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
            className="-m-2 h-[85vh]"
          />
        ) : (
          <View>
            <Text className="text-white text-xl font-semibold text-center mt-4 h-[53vh]">
              No results...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Starred;
