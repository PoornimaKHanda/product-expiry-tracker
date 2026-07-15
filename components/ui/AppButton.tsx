import React from "react";
import { Pressable, Text, View } from "react-native";
import { ButtonStyles } from "../../styles/buttons";

type RadioOption = {
  label: string;
  value: string;
};

type Props = {
  kind?: "floating" | "full" | "radio";
  label?: string;
  onPress?: () => void;
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
      <View style={ButtonStyles.radioContainer}>
        {options.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onSelect(opt.value)}
              style={[
                ButtonStyles.radioOption,
                isSelected && ButtonStyles.selectedRadioOption,
              ]}
            >
              <View
                style={[
                  ButtonStyles.radioCircle,
                  isSelected && ButtonStyles.selectedRadioDot,
                ]}
              />
              <Text style={ButtonStyles.radioOptionLabel}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  if (kind === "floating") {
    return (
      <Pressable style={ButtonStyles.floating} onPress={onPress}>
        <Text style={ButtonStyles.floatingText}>{label || "＋"}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable style={ButtonStyles.full} onPress={onPress}>
      <Text style={ButtonStyles.fullText}>{label}</Text>
    </Pressable>
  );
}
