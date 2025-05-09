import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// Create the ClothContext
const ClothContext = createContext();

export const ClothProvider = ({ children }) => {
  const [clothes, setCloths] = useState([]);
  const [history, setHistory] = useState([]);

  // Load clothes from AsyncStorage
  useEffect(() => {
    const loadCloths = async () => {
      try {
        const storedCloths = await AsyncStorage.getItem("clothes");
        if (storedCloths) {
          setCloths(JSON.parse(storedCloths));
        }
      } catch (error) {
        console.error("Error loading clothes from AsyncStorage:", error);
      }
    };

    loadCloths();
  }, []);

  // Save clothes when they change
  useEffect(() => {
    const saveCloths = async () => {
      try {
        await AsyncStorage.setItem("clothes", JSON.stringify(clothes));
      } catch (error) {
        console.error("Error saving clothes to AsyncStorage:", error);
      }
    };

    if (clothes.length > 0) {
      saveCloths();
    }
  }, [clothes]);

  // Load history from AsyncStorage
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem("clothingHistory");
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error("Error loading history from AsyncStorage:", error);
      }
    };
    loadHistory();
  }, []);

  // Save history when it changes
  useEffect(() => {
    const saveHistory = async () => {
      try {
        await AsyncStorage.setItem("clothingHistory", JSON.stringify(history));
      } catch (error) {
        console.error("Error saving history to AsyncStorage:", error);
      }
    };
    saveHistory();
  }, [history]);

  // Helper to add to history
  const addToHistory = (clothingItem) => {
    const newEntry = {
      ...clothingItem,
      // id: `${clothingItem.id}_${new Date().getTime()}`, // Unique ID
      date: new Date().toLocaleDateString("en-GB"),
    };
    setHistory((prev) => [newEntry, ...prev]);
  };

  return (
    <ClothContext.Provider
      value={{
        clothes,
        setCloths,
        history,
        setHistory,
        addToHistory, // expose helper
      }}
    >
      {children}
    </ClothContext.Provider>
  );
};

// Custom hook to use the Cloth context
export const useCloths = () => {
  const context = useContext(ClothContext);
  if (!context) {
    throw new Error("useCloths must be used within a ClothProvider");
  }
  return context;
};
