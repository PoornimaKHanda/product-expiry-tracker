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
});
