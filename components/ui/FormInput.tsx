import { Text, TextInput, View } from "react-native";
import { FormStyles } from "../../styles/forms";
import { Typography } from "../../theme/typography";

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
};

export function FormInput({ label, placeholder, value, onChangeText }: Props) {
  return (
    <View style={FormStyles.fieldGroup}>
      <Text style={Typography.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={FormStyles.textInput}
      />
    </View>
  );
}
