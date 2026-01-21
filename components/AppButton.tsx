import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type RadioOption = {
  label: string;
  value: string;
};

type Props = {
  kind?: "floating" | "full" | "radio";
  label?: string;
  onPress?: () => void;
  // For radio kind
  options?: RadioOption[];
  selected?: string;
  onSelect?: (value: string) => void;
};

export function AppButton({
  kind = "full",
  label = "",
  onPress,
  options,
  selected,
  onSelect,
}: Props) {
  if (kind === "radio" && options && onSelect) {
    return (
      <View style={styles.radioContainer}>
        {options.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onSelect(opt.value)}
              style={[
                styles.radioOption,
                isSelected && {
                  borderColor: Colors.primary,
                  backgroundColor: "#EDEAFF",
                },
              ]}
            >
              <View
                style={[
                  styles.radioCircle,
                  isSelected && { backgroundColor: Colors.primary },
                ]}
              />
              <Text style={{ marginLeft: 8 }}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  if (kind === "floating") {
    return (
      <Pressable style={styles.floating} onPress={onPress}>
        <Text style={styles.floatingText}>{label || "＋"}</Text>
      </Pressable>
    );
  }

  // default: full-width button
  return (
    <Pressable style={styles.full} onPress={onPress}>
      <Text style={styles.fullText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Radio buttons
  radioContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.md,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 12,
    marginBottom: 8,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },

  // Floating button
  floating: {
    position: "absolute",
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  floatingText: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 2,
  },

  // Full-width button
  full: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: Spacing.md,
    width: "100%",
  },
  fullText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
