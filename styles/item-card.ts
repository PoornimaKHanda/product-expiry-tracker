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
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.textPrimary,
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
});
