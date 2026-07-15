import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";

export const ScreenStyles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    bottomSpacer: {
        height: 100,
    },
    fabContainer: {
        marginBottom: Spacing.lg,
    },
    emptyStateText: {
        color: Colors.textSecondary,
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
    modeBadge: {
        color: Colors.textPrimary,
        fontSize: 14,
        backgroundColor: Colors.secondary,
        alignSelf: 'flex-start',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 6,
        marginBottom: 10,
    },
    screenSubtitle: {
        marginBottom: Spacing.md,
    },
});
