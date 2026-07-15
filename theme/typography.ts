import { Colors } from './colors';

export const Typography = {
    title: {
        fontSize: 28,
        fontWeight: '700' as const,
        color: Colors.textPrimary,
        lineHeight: 36,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        lineHeight: 24,
    },
    body: {
        fontSize: 17,
        color: Colors.textPrimary,
        lineHeight: 26,
    },
    label: {
        fontSize: 15,
        fontWeight: '700' as const,
        color: Colors.textSecondary,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: Colors.primary,
        letterSpacing: 0.8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: Colors.textPrimary,
    },
    cardSubtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
        lineHeight: 22,
        marginTop: 6,
    },
    cardDate: {
        fontSize: 15,
        color: Colors.primary,
        marginTop: 8,
    },
};
