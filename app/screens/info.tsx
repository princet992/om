import { useThemeColor } from "@/hooks/use-theme-color";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function Info() {
  const { label, info } = useLocalSearchParams();
  const accentColor = "#B85C38";

  const normalizedLabel = Array.isArray(label) ? label[0] : label || "";
  const normalizedInfo = Array.isArray(info) ? info[0] : info || "";

  const baseScale = useSharedValue(1);
  const pinchScale = useSharedValue(1);

  const MIN_SCALE = 1.0;
  const MAX_SCALE = 2.2;
  const clamp = (n: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, n));

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      pinchScale.value = clamp(baseScale.value * event.scale);
    })
    .onEnd(() => {
      baseScale.value = clamp(pinchScale.value);
    });

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pinchScale.value, { duration: 120 }) }],
  }));

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(normalizedInfo);
  };

  const shareText = async () => {
    await Share.share({
      message: `${normalizedLabel}\n\n${normalizedInfo}`,
    });
  };

  return (
    <>
      <StatusBar style="dark" />
      <LinearGradient colors={["#FFF3E0", "#FAE3C6", "#FFE5B4"]} style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <GestureDetector gesture={pinchGesture}>
              <Animated.View style={styles.card}>
                <Text style={styles.title}>{normalizedLabel}</Text>

                <Animated.Text style={[styles.info, animatedTextStyle]}>{normalizedInfo}</Animated.Text>

                <View style={styles.actions}>
                  <TouchableOpacity style={styles.iconButton} onPress={copyToClipboard}>
                    <Ionicons name="copy-outline" size={22} color={accentColor} />
                    <Text style={styles.actionText}>Copy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.iconButton} onPress={shareText}>
                    <Ionicons name="share-outline" size={22} color={accentColor} />
                    <Text style={styles.actionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </GestureDetector>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#7B341E",
    marginBottom: 24,
    fontFamily: "serif",
    textDecorationLine: "underline",
  },
  info: {
    textAlign: "center",
    fontWeight: "500",
    fontFamily: "serif",
    color: "#3B2F2F",
    fontSize: 20,
    lineHeight: 34,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#B85C38",
    fontWeight: "600",
  },
});
