import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";

export const ActionSheetStyles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        justifyContent: "flex-end",
    },
    absoluteFill: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    sheet: {
        backgroundColor: Colors.surface,
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    actionButton: {
        backgroundColor: Colors.surfaceSoft,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 18,
        marginBottom: 12,
    },
    deleteButton: {
        backgroundColor: Colors.surface,
    },
    cancelButton: {
        backgroundColor: Colors.surfaceSoft,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 18,
        alignItems: "center",
    },
    actionText: {
        fontSize: 18,
        color: Colors.textPrimary,
        fontWeight: "700"
    },
    deleteText: {
        color: Colors.danger,
    },
    cancelText: {
        fontSize: 18,
        color: Colors.textSecondary,
        fontWeight: "600",
    },
});
