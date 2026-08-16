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
    bottomActionBar: {
        width: "100%",
        paddingHorizontal: Spacing.sm,
        // paddingVertical: Spacing.sm,
        backgroundColor: Colors.background,
    },
    listContent: {
        paddingBottom: 50,
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
    galleryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    gallerySearch: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    galleryTile: {
        width: "48%",
        aspectRatio: 0.85,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: Colors.surfaceSoft,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.md,
    },
    galleryImage: {
        width: "100%",
        height: "100%",
    },
    previewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: Spacing.md,
    },
    previewImage: {
        width: "100%",
        height: 320,
        borderRadius: 16,
        marginBottom: Spacing.md,
        backgroundColor: Colors.surfaceSoft,
    },
    previewMeta: {
        marginBottom: Spacing.md,
        color: Colors.textSecondary,
    },
    fullscreenBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.88)",
    },
    fullscreenContainer: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    fullscreenScroll: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
    fullscreenContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.md,
    },
    fullscreenImage: {
        width: "100%",
        height: 700,
        maxHeight: "100%",
        resizeMode: "contain",
    },
    fullscreenFooter: {
        position: "absolute",
        left: 20,
        right: 20,
        bottom: 32,
    },
});
