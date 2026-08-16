import { strings } from "@/src/i18n";
import { RequiredLabel } from "@/src/features/shared/components/RequiredLabel";
import { FormStyles } from "@/src/styles/forms";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

type Props = {
  label: string;
  date?: string;
  required?: boolean;
  onChange: (date: Date) => void;
};

export function FormDatePicker({
  label,
  date,
  required = false,
  onChange,
}: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <View style={FormStyles.fieldGroup}>
      <RequiredLabel required={required}>{label}</RequiredLabel>
      <Pressable
        onPress={() => setShowPicker(true)}
        style={FormStyles.pickerTrigger}
      >
        <Text>{date || strings.selectDate}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={date ? new Date(date) : new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
}
