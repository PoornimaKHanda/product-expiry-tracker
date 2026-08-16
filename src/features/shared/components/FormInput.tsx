import { TextInput, View } from "react-native";
import { RequiredLabel } from "@/src/features/shared/components/RequiredLabel";
import { FormStyles } from "@/src/styles/forms";

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean; // ⭐ NEW
  multiline?: boolean; // (we added earlier)
  maxLength?: number;
};

export function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  required = false,
  multiline = false,
  maxLength,
}: Props) {
  return (
    <View style={FormStyles.fieldGroup}>
      <RequiredLabel required={required}>{label}</RequiredLabel>

      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        maxLength={maxLength}
        style={[
          FormStyles.textInput,
          multiline && FormStyles.multilineTextInput,
        ]}
      />
    </View>
  );
}
