import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import aarti from "../../data/Aarti";
import chalisa from "../../data/chalisa";
import strotam from "../../data/strotam";

interface PlaylistItem {
  id: string;
  title: string;
  deity: string;
  language: string;
  imageUrl: string;
  content?: string;
  audio?: string;
}
interface DayPlaylist {
  day: string;
  items: PlaylistItem[];
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DAY_COLORS = {
  Monday: ["#FF6B6B", "#FF8E8E"] as const,
  Tuesday: ["#4ECDC4", "#7EDDD6"] as const,
  Wednesday: ["#45B7D1", "#6BC5D8"] as const,
  Thursday: ["#96CEB4", "#B8DCC6"] as const,
  Friday: ["#FFEAA7", "#FFF2CC"] as const,
  Saturday: ["#DDA0DD", "#E6B3E6"] as const,
  Sunday: ["#FFB347", "#FFC966"] as const,
} satisfies Record<string, readonly [string, string]>;

const getDefaultImage = (deity: string) => {
  const map: Record<string, string> = {
    Hanuman:
      "https://upload.wikimedia.org/wikipedia/commons/8/8e/Hanuman_Image.jpg",
    Shiva:
      "https://upload.wikimedia.org/wikipedia/commons/8/8f/Lord_Shiva_Meditation.jpg",
    Durga:
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/Goddess_Durga_Artwork.jpg",
  };
  return (
    map[deity] ||
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
  );
};

const convertToPlaylistItems = (data: any[], type: string): PlaylistItem[] =>
  data.map((item, index) => ({
    id: `${type}-${item._id || index}`,
    title: item.title || item.name || "Untitled",
    deity: item.deity || item.category || "Universal",
    language: item.language || "Hindi",
    imageUrl: item.imageUrl || getDefaultImage(item.deity),
    content:
      item.content ||
      `${item.title} - A beautiful ${type.toLowerCase()} for spiritual practice.`,
    audio: item.audio,
  }));

const ALL_AVAILABLE_CONTENT: PlaylistItem[] = [
  ...convertToPlaylistItems(chalisa, "Chalisa"),
  ...convertToPlaylistItems(strotam, "Strotam"),
  ...convertToPlaylistItems(aarti, "Aarti"),
];

const STORAGE_KEY = "user_playlist_v1";

export default function PlaylistScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const themeText = useThemeColor({}, "text");
  const themeMuted = useThemeColor({}, "muted");
  const themeBackground = useThemeColor({}, "background");

  const [selectedDay, setSelectedDay] = useState("Monday");
  const [playlists, setPlaylists] = useState<DayPlaylist[]>(
    DAYS_OF_WEEK.map((d) => ({ day: d, items: [] }))
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadedRef = useRef(false);
  const saveTimerRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const normalized = DAYS_OF_WEEK.map(
          (day) =>
            parsed.find((p: DayPlaylist) => p.day === day) || { day, items: [] }
        );
        setPlaylists(normalized);
      }
      loadedRef.current = true;
    })();
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(
      () => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(playlists)),
      300
    );
    return () => clearTimeout(saveTimerRef.current);
  }, [playlists]);

  const currentPlaylist = playlists.find((p) => p.day === selectedDay) || {
    day: selectedDay,
    items: [],
  };

  const filteredBhajans = ALL_AVAILABLE_CONTENT.filter((i) => {
    const s = searchQuery.toLowerCase();
    const match =
      i.title.toLowerCase().includes(s) ||
      i.deity.toLowerCase().includes(s) ||
      i.language.toLowerCase().includes(s);
    const matchCat =
      selectedCategory === "All" ||
      i.deity === selectedCategory ||
      i.title.includes(selectedCategory);
    return match && matchCat;
  });

  const categories = [
    "All",
    ...Array.from(new Set(ALL_AVAILABLE_CONTENT.map((i) => i.deity))),
  ];

  const addToPlaylist = (item: PlaylistItem) => {
    const pl = playlists.find((p) => p.day === selectedDay);
    if (!pl) return;
    if (pl.items.some((x) => x.id === item.id))
      return Alert.alert("Already Added", `${item.title} already exists`);
    setPlaylists((prev) =>
      prev.map((p) =>
        p.day === selectedDay ? { ...p, items: [...p.items, item] } : p
      )
    );
    setShowAddModal(false);
  };

  const removeFromPlaylist = (id: string) =>
    setPlaylists((prev) =>
      prev.map((p) =>
        p.day === selectedDay
          ? { ...p, items: p.items.filter((i) => i.id !== id) }
          : p
      )
    );

  const renderPlaylistItem = ({ item }: { item: PlaylistItem }) => (
    <BlurView
      intensity={isDark ? 40 : 80}
      tint={isDark ? "dark" : "light"}
      style={styles.blurCard}
    >
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() =>
          router.push({
            pathname: "/screens/info",
            params: { label: item.title, info: item.content || "" },
          })
        }
      >
        <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.itemTitle, { color: themeText }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={[styles.itemSubtitle, { color: themeMuted }]}>
            {item.deity} • {item.language}
          </Text>
        </View>
        <TouchableOpacity onPress={() => removeFromPlaylist(item.id)}>
          <Ionicons name="trash-outline" size={22} color={"#FF6B6B"} />
        </TouchableOpacity>
      </TouchableOpacity>
    </BlurView>
  );

  const renderDayButton = (day: string) => {
    const selected = selectedDay === day;
    return (
      <TouchableOpacity
        key={day}
        onPress={() => setSelectedDay(day)}
        style={[
          styles.dayButton,
          selected && { backgroundColor: "rgba(255,255,255,0.25)" },
        ]}
      >
        <Text
          style={{
            color: selected ? "#fff" : "rgba(255,255,255,0.8)",
            fontWeight: "700",
            fontSize: 15,
          }}
        >
          {day.slice(0, 3)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAddItem = ({ item }: { item: PlaylistItem }) => (
    <TouchableOpacity
      style={styles.addItem}
      onPress={() => addToPlaylist(item)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.addItemImage} />
      <View style={{ flex: 1 }}>
        <Text
          style={[styles.addItemTitle, { color: themeText }]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={[styles.addItemSubtitle, { color: themeMuted }]}>
          {item.deity} • {item.language}
        </Text>
      </View>
      <Ionicons name="add-circle-outline" size={26} color={"#4ECDC4"} />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={DAY_COLORS[selectedDay as keyof typeof DAY_COLORS]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Weekly Playlist</Text>
          <Text style={styles.headerSubtitle}>
            Plan your devotional sessions day by day
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingHorizontal: 16 }}
        >
          {DAYS_OF_WEEK.map(renderDayButton)}
        </ScrollView>

        <FlatList
          data={currentPlaylist.items}
          keyExtractor={(i) => i.id}
          renderItem={renderPlaylistItem}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 20,
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="musical-notes-outline"
                size={60}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.emptyText}>
                No items in {selectedDay}’s playlist yet
              </Text>
            </View>
          }
        />

        {/* Floating Add Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#4ECDC4", "#45B7D1"]}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={32} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Modal */}
        <Modal visible={showAddModal} animationType="slide">
          <SafeAreaView
            style={[
              styles.modalContainer,
              { backgroundColor: themeBackground },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeText }]}>
                Add Bhajan
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={28} color={themeMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Ionicons
                name="search"
                size={18}
                color={themeMuted}
                style={{ marginHorizontal: 8 }}
              />
              <TextInput
                placeholder="Search bhajans..."
                placeholderTextColor={themeMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ flex: 1, color: themeText }}
              />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {categories.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setSelectedCategory(c)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        selectedCategory === c
                          ? "#4ECDC4"
                          : isDark
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.05)",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: selectedCategory === c ? "#fff" : themeText,
                      fontWeight: "600",
                    }}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <FlatList
              data={filteredBhajans}
              renderItem={renderAddItem}
              keyExtractor={(i) => i.id}
              contentContainerStyle={{ padding: 16 }}
            />
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    marginTop: 4,
  },
  blurCard: {
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 12,
  },
  itemTitle: { fontSize: 17, fontWeight: "700" },
  itemSubtitle: { fontSize: 13, fontWeight: "500" },
  dayButton: {
    marginRight: 10,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  empty: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 28,
    right: 24,
    shadowColor: "#4ECDC4",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  modalTitle: { fontSize: 22, fontWeight: "700" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 8,
    height: 44,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  addItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 18,
    padding: 10,
    marginBottom: 10,
  },
  addItemImage: {
    width: 56,
    height: 56,
    borderRadius: 14,
    marginRight: 12,
  },
  addItemTitle: { fontSize: 16, fontWeight: "600" },
  addItemSubtitle: { fontSize: 13, fontWeight: "500" },
});
