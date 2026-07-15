import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";

export const ItemCardStyles = StyleSheet.create({
    root: {
        backgroundColor: Colors.surface,
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.textPrimary,
    },
    subtitle: {
        marginTop: 4,
        color: Colors.textSecondary,
    },
    date: {
        marginTop: 4,
        color: Colors.textSecondary,
    },
});
