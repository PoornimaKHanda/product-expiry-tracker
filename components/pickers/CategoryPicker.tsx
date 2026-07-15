import { strings } from "@/i18n";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useCategoryOptions } from "../../hooks/usePickerOptions";
import { CommonStyles } from "../../styles/common";
import { PickerStyles } from "../../styles/pickers";
import { Typography } from "../../theme/typography";
import { PickerModal } from "./PickerModal";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export function CategoryPicker({ value, onChange }: Props) {
  const [visible, setVisible] = useState(false);
  const [addingCustom, setAddingCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const { options: categories, addCategory } = useCategoryOptions();

  const saveCustomCategory = async () => {
    const trimmedText = customText.trim();
    if (!trimmedText) return;

    await addCategory(trimmedText);
    onChange(trimmedText);
    setCustomText("");
    setAddingCustom(false);
    setVisible(false);
  };

  return (
    <View style={CommonStyles.pickerContainer}>
      <Text style={[Typography.label, PickerStyles.labelSpacing]}>
        {strings.category}
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
          {value || strings.selectCategory}
        </Text>
        <Text style={PickerStyles.triggerIcon}>▼</Text>
      </TouchableOpacity>

      <PickerModal
        visible={visible}
        title={strings.selectCategoryTitle}
        items={categories}
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
        addButtonLabel={strings.addCustomCategory}
        isAddingCustom={addingCustom}
        onStartAddCustom={() => setAddingCustom(true)}
        customText={customText}
        onCustomTextChange={setCustomText}
        onSaveCustom={saveCustomCategory}
        onCancelCustom={() => {
          setAddingCustom(false);
          setCustomText("");
        }}
        customPlaceholder={strings.enterCategory}
      />
    </View>
  );
}
