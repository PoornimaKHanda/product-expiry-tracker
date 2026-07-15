import { strings } from "@/i18n";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { FormStyles } from "../../styles/forms";
import { Typography } from "../../theme/typography";

type Props = {
  label: string;
  date?: string;
  onChange: (date: Date) => void;
};

export function FormDatePicker({ label, date, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <View style={FormStyles.fieldGroup}>
      <Text style={Typography.label}>{label}</Text>
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
