import { Text, TextInput, View } from "react-native";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
};

export function FormInput({ label, placeholder, value, onChangeText }: Props) {
  return (
    <View style={{ marginBottom: Spacing.md }}>
      <Text style={Typography.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: Spacing.sm,
          marginTop: 4,
        }}
      />
    </View>
  );
}
