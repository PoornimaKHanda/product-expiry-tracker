import { View, Text, Pressable, Platform } from "react-native";
import { Typography } from "../theme/typography";
import { Spacing } from "../theme/spacing";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  label: string;
  date?: string;
  onChange: (date: Date) => void;
};

export function FormDatePicker({ label, date, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios"); // iOS keeps picker open
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <View style={{ marginBottom: Spacing.md }}>
      <Text style={Typography.label}>{label}</Text>
      <Pressable
        onPress={() => setShowPicker(true)}
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
