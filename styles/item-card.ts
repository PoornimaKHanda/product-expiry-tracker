import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";

export const ItemCardStyles = StyleSheet.create({
    root: {
        backgroundColor: Colors.surface,
        padding: 18,
        borderRadius: 20,
        marginBottom: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: Colors.textPrimary,
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
    },
    content: {
        flex: 1,
        marginRight: 12,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.textPrimary,
    },
    badge: {
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    badgeExpiry: {
        backgroundColor: "rgba(108, 99, 255, 0.12)",
    },
    badgeWarranty: {
        backgroundColor: "rgba(16, 185, 129, 0.12)",
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "700",
        color: Colors.primary,
    },
    subtitle: {
        marginTop: 6,
        color: Colors.textSecondary,
        fontSize: 15,
        lineHeight: 22,
    },
    date: {
        marginTop: 8,
        color: Colors.primary,
        fontSize: 15,
        fontWeight: "600",
    },
    attachmentRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        gap: 6,
    },
    attachmentText: {
        color: Colors.textMuted,
        fontSize: 14,
        fontWeight: "600",
    },
});
