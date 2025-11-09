import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: "#888",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginVertical: Platform.OS === "ios" ? 4 : 6,
        },
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          borderRadius: 24,
          height: 70,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 10,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={Platform.OS === "ios" ? 60 : 90}
            tint={colorScheme === "dark" ? "dark" : "light"}
            style={{
              flex: 1,
              borderRadius: 24,
              overflow: "hidden",
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(30,30,30,0.5)"
                  : "rgba(255,255,255,0.7)",
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                transform: [{ scale: focused ? 1.15 : 1 }],
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={focused ? 24 : 22}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="playlist"
        options={{
          title: "Playlist",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                transform: [{ scale: focused ? 1.15 : 1 }],
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "musical-notes" : "musical-notes-outline"}
                size={focused ? 24 : 22}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="feedback"
        options={{
          title: "Feedback",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                transform: [{ scale: focused ? 1.15 : 1 }],
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"}
                size={focused ? 24 : 22}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
