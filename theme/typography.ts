import { Colors } from './colors';

export const Typography = {
    title: {
        fontSize: 22,
        fontWeight: '600' as const,
        color: Colors.textPrimary,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    body: {
        fontSize: 16,
        color: Colors.textPrimary,
    },
    label: {
        fontSize: 13,
        fontWeight: '500' as const,
        color: Colors.textSecondary,
    },
};
