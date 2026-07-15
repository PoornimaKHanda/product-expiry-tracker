import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";

export const ActionSheetStyles = StyleSheet.create({
    fullScreen: {
        flex: 1,
    },
    blurContainer: {
        flex: 1,
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: Colors.surface,
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    actionText: {
        fontSize: 18,
        marginBottom: 18,
        color: Colors.textPrimary,
    },
    deleteText: {
        fontSize: 18,
        marginBottom: 18,
        color: Colors.danger,
    },
    cancelText: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
});
