import { colors } from "@/theme/colors";
import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ccc",
  },
  greeting: { fontSize: 14 },
  username: { fontSize: 18, fontWeight: "bold" },

  notificationWrapper: { position: "relative" },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary.dark,
  },
  badgeText: {
    fontSize: 10,
    color: "#fff",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface.secondary,
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 1,
    // borderColor: colors.surface.border,
  },

  scrollContent: { paddingBottom: 100 },
  mainCard: { padding: 16, borderRadius: 24 },

  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 12 },

  quickAccessRow: { flexDirection: "row", justifyContent: "space-between" },
  quickAccessItem: { alignItems: "center", width: width / 4 - 16 },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  quickText: { fontSize: 12, textAlign: "center", marginTop: 6 },

  horizontalCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  serviceContent: { marginLeft: 12, flex: 1 },
  serviceTitle: { fontSize: 14, fontWeight: "bold" },
  serviceSubtitle: { fontSize: 12, marginVertical: 4 },
  serviceAction: { fontSize: 12, fontWeight: "bold" },

  carouselItem: {
    width: width - 32,
    marginRight: 16,
    padding: 16,
    borderRadius: 20,
  },
  carouselText: { fontSize: 16, marginBottom: 12 },
  carouselButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },

  offerCard: { marginBottom: 12 },
  offerImage: { height: 100, borderRadius: 16, backgroundColor: "#ccc" },
  offerText: { marginTop: 8 },
});
