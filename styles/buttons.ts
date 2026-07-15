import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";

export const ButtonStyles = StyleSheet.create({
    radioContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: Spacing.md,
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 12,
        marginBottom: 8,
    },
    radioCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.background,
    },
    floating: {
        position: "absolute",
        bottom: Spacing.lg,
        right: Spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
    floatingText: {
        fontSize: 28,
        color: Colors.background,
        marginBottom: 2,
    },
    full: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: Spacing.md,
        width: "100%",
    },
    fullText: {
        color: Colors.background,
        fontSize: 16,
        fontWeight: "600",
    },
    selectedRadioOption: {
        borderColor: Colors.primary,
        backgroundColor: "#EDEAFF",
    },
    selectedRadioDot: {
        backgroundColor: Colors.primary,
    },
    radioOptionLabel: {
        marginLeft: Spacing.sm,
        color: Colors.textPrimary,
    },
});
