import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";

export const PickerStyles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
    },
    labelSpacing: {
        marginBottom: Spacing.xs,
    },
    trigger: {
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.sm,
        borderRadius: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Colors.surfaceSoft,
    },
    triggerTextInactive: {
        color: Colors.textSecondary,
    },
    triggerTextActive: {
        color: Colors.textPrimary,
    },
    triggerIcon: {
        marginLeft: 8,
        color: Colors.textSecondary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
    },
    modalCard: {
        backgroundColor: Colors.background,
        margin: 20,
        borderRadius: 12,
        padding: 16,
        maxHeight: "70%",
    },
    modalTitle: {
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
    optionText: {
        color: Colors.textPrimary,
    },
    selectedOptionText: {
        color: Colors.primary,
    },
    saveText: {
        color: Colors.background,
    },
    saveTextDisabled: {
        color: Colors.textSecondary,
    },
    cancelText: {
        color: Colors.danger,
    },
    disabledButton: {
        backgroundColor: Colors.muted,
    },
    disabledButtonText: {
        color: Colors.textSecondary,
    },
});
