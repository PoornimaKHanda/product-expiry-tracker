import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";

export const FormStyles = StyleSheet.create({
    fieldGroup: {
        marginBottom: Spacing.md,
    },
    textInput: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        padding: Spacing.sm,
        marginTop: 4,
        backgroundColor: Colors.surface,
        color: Colors.textPrimary,
    },
    pickerTrigger: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        padding: Spacing.sm,
        marginTop: 4,
        backgroundColor: Colors.surface,
    },
    pickerTriggerText: {
        color: Colors.textPrimary,
    },
});
