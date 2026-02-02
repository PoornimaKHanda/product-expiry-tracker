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
        borderRadius: 12,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
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

    /* Category picker styles */
    pickerContainer: {
        marginBottom: Spacing.md,
    },

    pickerTrigger: {
        borderWidth: 1,
        borderColor: Colors.muted,
        padding: Spacing.sm,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    inputHighlighted: {
        borderWidth: 2,
        borderColor: Colors.muted,
        padding: Spacing.sm,
        borderRadius: 8,
        marginBottom: Spacing.sm,
    },

    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    saveButton: {
        flex: 1,
        padding: Spacing.sm,
        borderRadius: 8,
        backgroundColor: Colors.primary,
        marginRight: Spacing.sm,
        alignItems: 'center',
    },

    cancelButton: {
        flex: 1,
        padding: Spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
    },

    listItem: {
        paddingVertical: Spacing.sm,
    },
});
