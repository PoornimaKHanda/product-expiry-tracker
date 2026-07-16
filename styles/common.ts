import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';

export const CommonStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: Spacing.md,
    },

    card: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: Colors.textPrimary,
        shadowOpacity: 0.05,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    pickerContainer: {
        marginBottom: Spacing.md,
    },

    pickerWrapper: {
        borderRadius: 16,
        backgroundColor: Colors.surfaceSoft,
        padding: 3,
    },
    tabBar: {
        flexDirection: "row",
        marginTop: Spacing.md,
        marginBottom: Spacing.md,
        backgroundColor: Colors.surfaceSoft,
        borderRadius: 18,
        overflow: "hidden",
    },
    tabButton: {
        flex: 1,
        paddingVertical: Spacing.sm,
        alignItems: "center",
        justifyContent: "center",
    },
    tabButtonActive: {
        backgroundColor: Colors.primary,
    },
    tabButtonText: {
        color: Colors.textPrimary,
        fontWeight: "700",
    },
    tabButtonTextActive: {
        color: Colors.background,
    },

    pickerTrigger: {
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.sm,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.surface,
    },

    inputHighlighted: {
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.sm,
        borderRadius: 14,
        marginBottom: Spacing.sm,
        backgroundColor: Colors.surface,
    },

    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    saveButton: {
        flex: 1,
        padding: Spacing.sm,
        borderRadius: 14,
        backgroundColor: Colors.primary,
        marginRight: Spacing.sm,
        alignItems: 'center',
    },

    cancelButton: {
        flex: 1,
        padding: Spacing.sm,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.textSecondary,
        backgroundColor: Colors.surface,
        alignItems: 'center',
    },

    listItem: {
        paddingVertical: Spacing.sm,
    },
});
