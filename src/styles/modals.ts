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
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 16,
    },
    actionButton: {
        flex: 1,
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surfaceSoft,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    actionButtonText: {
        color: Colors.textPrimary,
        fontSize: 16,
        fontWeight: '700',
    },
    actionButtonSecondary: {
        backgroundColor: Colors.surface,
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
