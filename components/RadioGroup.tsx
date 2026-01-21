import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
};

export function RadioGroup({ options, selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={[
              styles.option,
              isSelected && {
                borderColor: Colors.primary,
                backgroundColor: "#EDEAFF",
              },
            ]}
          >
            <View
              style={[
                styles.circle,
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap", // ✅ allows buttons to wrap on smaller screens
    marginBottom: Spacing.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 12,
    marginBottom: 8, // ✅ spacing for wrapped lines
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
});
