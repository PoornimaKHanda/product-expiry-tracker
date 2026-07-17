import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";

export const AttachmentStyles = StyleSheet.create({
  root: {
    marginBottom: Spacing.md,
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.surface,
    alignItems: "center",
  },
  actionButtonText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  thumbnailRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  thumbnailWrap: {
    position: "relative",
  },
  thumbnail: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: Colors.surfaceSoft,
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    marginTop: Spacing.xs,
    color: Colors.textMuted,
  },
});
