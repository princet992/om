import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DAY_COLORS = {
  Monday: ["#F857A6", "#FF5858"],
  Tuesday: ["#FF512F", "#F09819"],
  Wednesday: ["#16A085", "#2ECC71"],
  Thursday: ["#4776E6", "#8E54E9"],
  Friday: ["#C33764", "#1D2671"],
  Saturday: ["#41295A", "#2F0743"],
  Sunday: ["#FF6A00", "#EE0979"],
} as const;

const getDefaultImage = (deity: string) => {
  const map: Record<string, string> = {
    Hanuman: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Hanuman_Image.jpg",
    Shiva: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Lord_Shiva_Meditation.jpg",
    Durga: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Goddess_Durga_Artwork.jpg",
  };
  return map[deity] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400";
};

const convertToPlaylistItems = (data: any[], type: string): PlaylistItem[] =>
  data.map((item, index) => ({
    id: `${type}-${item._id || index}`,
    title: item.title || item.name || "Untitled",
    deity: item.deity || item.category || "Universal",
    language: item.language || "Hindi",
    imageUrl: item.imageUrl || getDefaultImage(item.deity),
    content: item.content || `${item.title} - A beautiful ${type.toLowerCase()} for spiritual practice.`,
    audio: item.audio,
  }));

const ALL_CONTENT: PlaylistItem[] = [
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
  const [playlists, setPlaylists] = useState<DayPlaylist[]>(DAYS_OF_WEEK.map((d) => ({ day: d, items: [] })));
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
          (day) => parsed.find((p: DayPlaylist) => p.day === day) || { day, items: [] }
        );
        setPlaylists(normalized);
      }
      loadedRef.current = true;
    })();
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(playlists)), 300);
    return () => clearTimeout(saveTimerRef.current);
  }, [playlists]);

  const currentPlaylist = playlists.find((p) => p.day === selectedDay) || { day: selectedDay, items: [] };

  const categories = ["All", ...Array.from(new Set(ALL_CONTENT.map((i) => i.deity)))];

  const filteredBhajans = ALL_CONTENT.filter((i) => {
    const s = searchQuery.toLowerCase();
    const match =
      i.title.toLowerCase().includes(s) || i.deity.toLowerCase().includes(s) || i.language.toLowerCase().includes(s);
    const matchCat = selectedCategory === "All" || i.deity === selectedCategory;
    return match && matchCat;
  });

  const addToPlaylist = (item: PlaylistItem) => {
    const pl = playlists.find((p) => p.day === selectedDay);
    if (!pl) return;
    if (pl.items.some((x) => x.id === item.id)) return;
    setPlaylists((prev) => prev.map((p) => (p.day === selectedDay ? { ...p, items: [...p.items, item] } : p)));
    setShowAddModal(false);
  };

  const removeFromPlaylist = (id: string) =>
    setPlaylists((prev) =>
      prev.map((p) => (p.day === selectedDay ? { ...p, items: p.items.filter((i) => i.id !== id) } : p))
    );

  return (
    <LinearGradient colors={DAY_COLORS[selectedDay as keyof typeof DAY_COLORS]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Weekly Bhajan Plan</Text>
          <Text style={styles.headerSubtitle}>Curate your devotion day by day</Text>
        </View>

        {/* DAYS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScroll}>
          {DAYS_OF_WEEK.map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(day)}
              style={[
                styles.dayChip,
                selectedDay === day && {
                  backgroundColor: "rgba(255,255,255,0.3)",
                  shadowColor: "#fff",
                  shadowOpacity: 0.4,
                  shadowRadius: 4,
                  transform: [{ scale: 1.05 }],
                },
              ]}
            >
              <Text style={[styles.dayText, { color: selectedDay === day ? "#fff" : "rgba(255,255,255,0.9)" }]}>
                {day.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* PLAYLIST */}
        <FlatList
          data={currentPlaylist.items}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <BlurView intensity={isDark ? 30 : 80} tint="light" style={styles.playCard}>
              <TouchableOpacity
                style={styles.cardInner}
                onPress={() =>
                  router.push({
                    pathname: "/screens/info",
                    params: { label: item.title, info: item.content || "" },
                  })
                }
              >
                <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>
                    {item.deity} • {item.language}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeFromPlaylist(item.id)}>
                  <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
                </TouchableOpacity>
              </TouchableOpacity>
            </BlurView>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="musical-notes-outline" size={64} color="rgba(255,255,255,0.7)" />
              <Text style={styles.emptyText}>No bhajans yet for {selectedDay}</Text>
            </View>
          }
          contentContainerStyle={styles.listContainer}
        />

        {/* FAB */}
        <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
          <LinearGradient colors={["#4ECDC4", "#45B7D1"]} style={styles.fabInner}>
            <Ionicons name="add" size={32} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* MODAL */}
        <Modal visible={showAddModal} animationType="slide">
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: themeBackground }]}>
            {/* HEADER */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeText }]}>Add Bhajan</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.closeButton}>
                <Ionicons name="close" size={26} color={themeMuted} />
              </TouchableOpacity>
            </View>

            {/* SEARCH */}
            <View style={[styles.searchBar, { backgroundColor: isDark ? "#222" : "rgba(255,255,255,0.1)" }]}>
              <Ionicons name="search" size={18} color={themeMuted} />
              <TextInput
                placeholder="Search bhajans..."
                placeholderTextColor={themeMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
            </View>

            {/* CATEGORY SCROLL */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setSelectedCategory(c)}
                  style={[
                    styles.chip,
                    selectedCategory === c
                      ? { backgroundColor: "#4ECDC4" }
                      : { backgroundColor: "rgba(255,255,255,0.08)" },
                  ]}
                >
                  <Text style={{ color: selectedCategory === c ? "#fff" : themeText, fontWeight: "600" }}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* BHAJAN LIST */}
            <FlatList
              data={filteredBhajans}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.addItem, { backgroundColor: isDark ? "#333" : "rgba(255,255,255,0.05)" }]}
                  onPress={() => addToPlaylist(item)}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.addImage} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.addTitle, { color: themeText }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={[styles.addSubtitle, { color: themeMuted }]}>
                      {item.deity} • {item.language}
                    </Text>
                  </View>
                  <Ionicons name="add-circle-outline" size={28} color="#4ECDC4" />
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
            />
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingVertical: 14 },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#fff" },
  headerSubtitle: { color: "rgba(255,255,255,0.9)", fontWeight: "500", marginTop: 4 },
  dayScroll: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },

  dayChip: {
    marginRight: 8,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    minWidth: 52,
    alignItems: "center",
  },

  dayText: {
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.4,
  },

  playCard: {
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardInner: { flexDirection: "row", alignItems: "center", padding: 14 },
  itemImage: { width: 64, height: 64, borderRadius: 16, marginRight: 12 },
  itemTitle: { fontSize: 17, fontWeight: "700", color: "#222" },
  itemSubtitle: { fontSize: 13, color: "#666" },
  listContainer: { paddingHorizontal: 16, paddingVertical: 20 },
  empty: { alignItems: "center", marginTop: 60 },
  emptyText: { color: "#fff", fontWeight: "600", fontSize: 16, marginTop: 10 },
  fab: { position: "absolute", bottom: 28, right: 24 },
  fabInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4ECDC4",
    shadowOpacity: 0.7,
    shadowRadius: 10,
  },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  modalTitle: { fontSize: 22, fontWeight: "700" },
  closeButton: { padding: 6 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 44,
  },

  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: "#fff" },

  categoryScroll: { paddingHorizontal: 16, paddingVertical: 8 },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  addItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  addImage: { width: 56, height: 56, borderRadius: 14, marginRight: 12 },

  addTitle: { fontSize: 16, fontWeight: "600" },
  addSubtitle: { fontSize: 13, fontWeight: "500" },
});
