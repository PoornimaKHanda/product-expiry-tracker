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
        borderRadius: 22,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginRight: 12,
        marginBottom: 8,
        backgroundColor: Colors.surface,
    },
    radioCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.background,
    },
    floating: {
        position: "absolute",
        bottom: Spacing.lg,
        right: Spacing.lg,
        minWidth: 56,
        height: 56,
        paddingHorizontal: Spacing.lg,
        borderRadius: 28,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
    floatingText: {
        fontSize: 16,
        color: Colors.background,
        fontWeight: "700",
        marginBottom: 0,
    },
    full: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.lg,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: Spacing.md,
        width: "100%",
    },
    fullText: {
        color: Colors.background,
        fontSize: 18,
        fontWeight: "700",
    },
    selectedRadioOption: {
        borderColor: Colors.primary,

    },
    selectedRadioDot: {
        backgroundColor: Colors.primary,
    },
    radioOptionLabel: {
        marginLeft: Spacing.sm,
        color: Colors.textPrimary,
        fontSize: 15,
        fontWeight: "600",
    },
});
