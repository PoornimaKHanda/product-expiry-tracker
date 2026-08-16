import { View, TouchableOpacity, Text } from "react-native";
import { Typography } from "@/src/theme/typography";
import { FormStyles } from "@/src/styles/forms";

type Props = {
  onSelect: (years: number) => void;
  selected?: number | null;
};

const OPTIONS = [1, 2, 3, 5, 10];

export function WarrantyDurationPicker({ onSelect, selected }: Props) {
  return (
    <View style={FormStyles.fieldGroup}>
      <Text style={Typography.label}>Warranty Duration</Text>

      <View style={FormStyles.chipContainer}>
        {OPTIONS.map((year) => {
          const isSelected = selected === year;

          return (
            <TouchableOpacity
              key={year}
              style={[FormStyles.chip, isSelected && FormStyles.chipSelected]}
              onPress={() => onSelect(year)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  FormStyles.chipText,
                  isSelected && FormStyles.chipTextSelected,
                ]}
              >
                {year} yrs
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
