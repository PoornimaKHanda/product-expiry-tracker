import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";

export const ModalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.36)",
        justifyContent: "center",
        padding: 20,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 20,
        maxHeight: "75%",
        borderWidth: 1,
        borderColor: Colors.border,
    },
    title: {
        fontSize: 20,
        marginBottom: 14,
        color: Colors.textPrimary,
        fontWeight: '700',
    },
    addButton: {
        padding: 14,
    },
    addButtonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '700',
    },
});
