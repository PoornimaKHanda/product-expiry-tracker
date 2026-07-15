import { PickerModal } from "@/components/pickers/PickerModal";
import { strings } from "@/i18n";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useReminderOptions } from "../hooks/usePickerOptions";
import { CommonStyles } from "../styles/common";
import { PickerStyles } from "../styles/pickers";
import { Typography } from "../theme/typography";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export function ReminderPicker({ value, onChange }: Props) {
  const [visible, setVisible] = useState(false);
  const [addingCustom, setAddingCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const { options, addReminder } = useReminderOptions();

  const saveCustomReminder = async () => {
    const parsedDays = Number(customText);
    if (!Number.isFinite(parsedDays) || parsedDays <= 0) {
      return;
    }

    await addReminder(parsedDays);
    onChange(`custom:${parsedDays}`);
    setCustomText("");
    setAddingCustom(false);
    setVisible(false);
  };

  const selectedLabel =
    options.find((option) => option.value === value)?.label ||
    (value.startsWith("custom:")
      ? strings.customReminderLabel(Number(value.split(":")[1]))
      : strings.defaultReminders[0].label);

  return (
    <View style={CommonStyles.pickerContainer}>
      <Text style={[Typography.label, PickerStyles.labelSpacing]}>
        {strings.reminder}
      </Text>

      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={CommonStyles.pickerTrigger}
      >
        <Text
          style={[
            Typography.body,
            value
              ? PickerStyles.triggerTextActive
              : PickerStyles.triggerTextInactive,
          ]}
        >
          {selectedLabel}
        </Text>
        <Text style={PickerStyles.triggerIcon}>▼</Text>
      </TouchableOpacity>

      <PickerModal
        visible={visible}
        title={strings.selectReminderTitle}
        items={options}
        selectedValue={value}
        onSelect={(selected) => {
          onChange(selected);
          setVisible(false);
        }}
        onClose={() => {
          setVisible(false);
          setAddingCustom(false);
          setCustomText("");
        }}
        addButtonLabel={strings.addCustomReminder}
        isAddingCustom={addingCustom}
        onStartAddCustom={() => setAddingCustom(true)}
        customText={customText}
        onCustomTextChange={setCustomText}
        onSaveCustom={saveCustomReminder}
        onCancelCustom={() => {
          setAddingCustom(false);
          setCustomText("");
        }}
        customPlaceholder={strings.enterDaysBeforeExpiry}
      />
    </View>
  );
}
