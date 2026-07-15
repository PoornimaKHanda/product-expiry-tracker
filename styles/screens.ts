import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";

export const ScreenStyles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    bottomSpacer: {
        height: 80,
    },
    fabContainer: {
        marginBottom: Spacing.lg,
    },
    emptyStateText: {
        opacity: 0.6,
        color: Colors.textSecondary,
    },
    modeBadge: {
        color: Colors.textSecondary,
        fontSize: 12,
        marginTop: 4,
        marginBottom: 8,
    },
    screenSubtitle: {
        marginBottom: Spacing.md,
    },
});
