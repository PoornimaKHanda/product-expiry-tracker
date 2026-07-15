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
        backgroundColor: Colors.background,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    actionText: {
        fontSize: 18,
        marginBottom: 16,
        color: Colors.textPrimary,
    },
    deleteText: {
        fontSize: 18,
        marginBottom: 16,
        color: Colors.danger,
    },
    cancelText: {
        fontSize: 16,
        opacity: 0.6,
        color: Colors.textSecondary,
    },
});
