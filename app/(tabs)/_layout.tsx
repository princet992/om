import React from "react";
import { Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: withTiming(0, { duration: 500 }) }],
  }));

  const backgroundColor =
    colorScheme === "dark"
      ? "rgba(20,20,20,0.9)"
      : "rgba(255,255,255,0.9)";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: "#999",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginVertical: Platform.OS === "ios" ? 4 : 6,
        },
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 70,
          position: "relative",
          borderTopWidth: 0.5,
          borderTopColor:
            colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "#ddd",
          elevation: 0,
        },
        tabBarBackground: () => (
          <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            <BlurView
              intensity={Platform.OS === "ios" ? 40 : 0}
              tint={colorScheme === "dark" ? "dark" : "light"}
              style={{
                flex: 1,
                backgroundColor,
                shadowColor: colorScheme === "dark" ? "#000" : "#ccc",
                shadowOpacity: 0.2,
                shadowRadius: 8,
              }}
            />
          </Animated.View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="playlist"
        options={{
          title: "Playlist",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "musical-notes" : "musical-notes-outline"}
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="feedback"
        options={{
          title: "Feedback",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? "chatbubble-ellipses"
                  : "chatbubble-ellipses-outline"
              }
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
