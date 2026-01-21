import { Pressable, Text, View } from "react-native";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type Props = {
  label: string;
  date?: string;
  onPress: () => void;
};

export function FormDatePicker({ label, date, onPress }: Props) {
  return (
    <View style={{ marginBottom: Spacing.md }}>
      <Text style={Typography.label}>{label}</Text>
      <Pressable
        onPress={onPress}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: Spacing.sm,
          marginTop: 4,
        }}
      >
        <Text>{date || "Select date"}</Text>
      </Pressable>
    </View>
  );
}
