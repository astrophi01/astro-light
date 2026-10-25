import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === "dark" ? "white" : "black",
        headerShown: false,
        tabBarButton: HapticTab,
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="visualizer"
        options={{
          title: "Visualizer",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="planet" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="badges"
        options={{
          title: "Badges",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ribbon" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
