import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";

export const ModalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
    },
    card: {
        backgroundColor: Colors.background,
        margin: 20,
        borderRadius: 12,
        padding: 16,
        maxHeight: "70%",
    },
    title: {
        fontSize: 18,
        marginBottom: 12,
        color: Colors.textPrimary,
    },
    addButton: {
        padding: 12,
    },
    addButtonText: {
        color: Colors.primary,
    },
});
